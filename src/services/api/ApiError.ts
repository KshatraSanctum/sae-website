export interface ApiErrorOptions {
  readonly status?: number;
  readonly statusText?: string;
  readonly url?: string;
  readonly details?: unknown;
  readonly cause?: unknown;
}

/** A normalized error shape for HTTP and transport failures. */
export class ApiError extends Error {
  readonly status?: number;
  readonly statusText?: string;
  readonly url?: string;
  readonly details?: unknown;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = 'ApiError';
    this.status = options.status;
    this.statusText = options.statusText;
    this.url = options.url;
    this.details = options.details;
  }

  static fromResponse(response: Response, details?: unknown): ApiError {
    const statusLabel = response.statusText
      ? `${response.status} ${response.statusText}`
      : String(response.status);

    return new ApiError(`API request failed with status ${statusLabel}.`, {
      status: response.status,
      statusText: response.statusText || undefined,
      url: response.url || undefined,
      details,
    });
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;
