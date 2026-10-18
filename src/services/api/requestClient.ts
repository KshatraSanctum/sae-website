import { env } from '../../config/env';
import { ApiError, isApiError } from './ApiError';

type ApiQueryPrimitive = string | number | boolean;
export type ApiQueryValue = ApiQueryPrimitive | null | undefined | readonly ApiQueryPrimitive[];

export interface ApiRequestOptions extends Omit<RequestInit, 'body' | 'signal'> {
  readonly query?: Readonly<Record<string, ApiQueryValue>>;
  readonly body?: unknown;
  readonly signal?: AbortSignal;
  readonly timeoutMs?: number;
}

export interface ApiClientConfig {
  readonly baseUrl?: string;
  readonly defaultTimeoutMs?: number;
  readonly fetcher?: typeof fetch;
}

export interface ApiClient {
  request<T>(path: string, options?: ApiRequestOptions): Promise<T>;
  get<T>(path: string, options?: Omit<ApiRequestOptions, 'body' | 'method'>): Promise<T>;
  post<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'body' | 'method'>): Promise<T>;
}

const isHttpUrl = (value: string): boolean => /^https?:\/\//i.test(value);

const resolveUrl = (
  baseUrl: string,
  path: string,
  query: Readonly<Record<string, ApiQueryValue>> | undefined,
): string => {
  const trimmedPath = path.trim();
  if (!trimmedPath) {
    throw new ApiError('API request path must not be empty.');
  }

  let url: URL;
  if (isHttpUrl(trimmedPath)) {
    url = new URL(trimmedPath);
  } else {
    if (!baseUrl) {
      throw new ApiError(
        'API base URL is not configured. Set VITE_API_BASE_URL before making an HTTP request.',
      );
    }

    const absoluteBaseUrl = isHttpUrl(baseUrl)
      ? baseUrl
      : typeof window !== 'undefined'
        ? new URL(baseUrl, window.location.origin).toString()
        : undefined;

    if (!absoluteBaseUrl) {
      throw new ApiError(
        'A relative API base URL can only be used in a browser. Configure an absolute VITE_API_BASE_URL for this environment.',
      );
    }

    url = new URL(trimmedPath.replace(/^\/+/, ''), `${absoluteBaseUrl.replace(/\/+$/, '')}/`);
  }

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      const values = Array.isArray(value) ? value : [value];
      values.forEach((item) => {
        if (item !== null && item !== undefined) {
          url.searchParams.append(key, String(item));
        }
      });
    });
  }

  return url.toString();
};

const isBodyInit = (value: unknown): value is BodyInit => {
  if (typeof value === 'string') {
    return true;
  }

  return (
    (typeof Blob !== 'undefined' && value instanceof Blob) ||
    (typeof FormData !== 'undefined' && value instanceof FormData) ||
    (typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams) ||
    (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer)
  );
};

const prepareBody = (body: unknown): BodyInit | undefined => {
  if (body === undefined) {
    return undefined;
  }

  return isBodyInit(body) ? body : JSON.stringify(body);
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return undefined;
  }

  const text = await response.text();
  if (!text) {
    return undefined;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  return text;
};

const validateTimeout = (timeoutMs: number): void => {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new ApiError(`API request timeout must be a positive number. Received ${timeoutMs}.`);
  }
};

export const createApiClient = (config: ApiClientConfig = {}): ApiClient => {
  const baseUrl = config.baseUrl ?? env.apiBaseUrl;
  const defaultTimeoutMs = config.defaultTimeoutMs ?? env.apiTimeoutMs;
  validateTimeout(defaultTimeoutMs);

  const request = async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
    const { body: rawBody, query, signal, timeoutMs = defaultTimeoutMs, ...requestInit } = options;
    validateTimeout(timeoutMs);

    const url = resolveUrl(baseUrl, path, query);
    const fetcher = config.fetcher ?? globalThis.fetch;
    if (!fetcher) {
      throw new ApiError('The Fetch API is unavailable in this runtime.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const forwardAbort = (): void => controller.abort(signal?.reason);
    if (signal?.aborted) {
      forwardAbort();
    } else {
      signal?.addEventListener('abort', forwardAbort, { once: true });
    }

    const headers = new Headers(requestInit.headers);
    const body = prepareBody(rawBody);
    if (rawBody !== undefined && !isBodyInit(rawBody) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const response = await fetcher(url, {
        ...requestInit,
        headers,
        body,
        signal: controller.signal,
      });
      const responseBody = await parseResponseBody(response);

      if (!response.ok) {
        throw ApiError.fromResponse(response, responseBody);
      }

      return responseBody as T;
    } catch (error) {
      if (isApiError(error)) {
        throw error;
      }

      if (controller.signal.aborted) {
        const message = signal?.aborted
          ? 'API request was aborted.'
          : `API request timed out after ${timeoutMs} ms.`;
        throw new ApiError(message, { url, cause: error });
      }

      throw new ApiError('API request failed before a response was received.', {
        url,
        cause: error,
      });
    } finally {
      clearTimeout(timeoutId);
      signal?.removeEventListener('abort', forwardAbort);
    }
  };

  return {
    request,
    get: <T>(path: string, options: Omit<ApiRequestOptions, 'body' | 'method'> = {}) =>
      request<T>(path, { ...options, method: 'GET' }),
    post: <T>(
      path: string,
      body?: unknown,
      options: Omit<ApiRequestOptions, 'body' | 'method'> = {},
    ) => request<T>(path, { ...options, method: 'POST', body }),
  };
};

/** The configured client is inert until a consumer explicitly calls a method. */
export const apiClient = createApiClient();

export const request = <T>(path: string, options?: ApiRequestOptions): Promise<T> =>
  apiClient.request<T>(path, options);
