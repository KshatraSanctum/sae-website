/**
 * The small, explicit subset of Vite's environment that the application may
 * consume. Keeping this list typed prevents accidentally exposing arbitrary
 * build-time values to application code.
 */
export interface RuntimeEnvSource {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_TIMEOUT_MS?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  /** @deprecated Use VITE_SUPABASE_PUBLISHABLE_KEY instead. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

export interface RuntimeEnv {
  /** An empty value intentionally leaves the HTTP client unconfigured. */
  readonly apiBaseUrl: string;
  readonly apiTimeoutMs: number;
  readonly supabaseUrl?: string;
  /** The effective browser-safe Supabase key, preferring the publishable key. */
  readonly supabasePublishableKey?: string;
  /** @deprecated Kept as an alias for existing consumers. */
  readonly supabaseAnonKey?: string;
  readonly supabaseConfigured: boolean;
}

export const DEFAULT_API_BASE_URL = '';
export const DEFAULT_API_TIMEOUT_MS = 10_000;

const getViteEnv = (): RuntimeEnvSource => {
  return (import.meta.env ?? {}) as RuntimeEnvSource;
};

const readOptionalString = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const readTimeout = (value: string | undefined): number => {
  const trimmed = readOptionalString(value);
  if (!trimmed) {
    return DEFAULT_API_TIMEOUT_MS;
  }

  const timeout = Number(trimmed);
  if (!Number.isInteger(timeout) || timeout <= 0) {
    throw new Error(
      `Invalid VITE_API_TIMEOUT_MS "${trimmed}". Use a positive integer number of milliseconds.`,
    );
  }

  return timeout;
};

const readApiBaseUrl = (value: string | undefined): string => {
  const baseUrl = readOptionalString(value) ?? DEFAULT_API_BASE_URL;
  if (!baseUrl) {
    return baseUrl;
  }

  const isRelativePath = baseUrl.startsWith('/') && !baseUrl.startsWith('//');
  try {
    const parsed = isRelativePath ? new URL(baseUrl, 'http://runtime.local') : new URL(baseUrl);
    if (!isRelativePath && !['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('unsupported protocol');
    }
  } catch {
    throw new Error(
      `Invalid VITE_API_BASE_URL "${baseUrl}". Use an absolute http(s) URL or a path beginning with "/".`,
    );
  }

  return baseUrl.replace(/\/+$/, '');
};

const readSupabaseUrl = (value: string | undefined): string | undefined => {
  const url = readOptionalString(value);
  if (!url) {
    return undefined;
  }

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('unsupported protocol');
    }
  } catch {
    throw new Error(`Invalid VITE_SUPABASE_URL "${url}". Use an absolute http(s) URL.`);
  }

  return url.replace(/\/+$/, '');
};

/**
 * Parse and validate runtime configuration at one boundary.
 *
 * The API and Supabase settings are optional so the current static application
 * continues to work without an `.env` file. Partially configured Supabase
 * credentials are rejected early with an actionable message.
 */
export const readRuntimeEnv = (source: RuntimeEnvSource = getViteEnv()): RuntimeEnv => {
  const apiBaseUrl = readApiBaseUrl(source.VITE_API_BASE_URL);
  const apiTimeoutMs = readTimeout(source.VITE_API_TIMEOUT_MS);
  const supabaseUrl = readSupabaseUrl(source.VITE_SUPABASE_URL);
  const supabasePublishableKey =
    readOptionalString(source.VITE_SUPABASE_PUBLISHABLE_KEY) ??
    readOptionalString(source.VITE_SUPABASE_ANON_KEY);

  if ((supabaseUrl && !supabasePublishableKey) || (!supabaseUrl && supabasePublishableKey)) {
    throw new Error(
      'VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or legacy VITE_SUPABASE_ANON_KEY) must be provided together when configuring Supabase.',
    );
  }

  return Object.freeze({
    apiBaseUrl,
    apiTimeoutMs,
    supabaseUrl,
    supabasePublishableKey,
    supabaseAnonKey: supabasePublishableKey,
    supabaseConfigured: Boolean(supabaseUrl && supabasePublishableKey),
  });
};

/** Parsed application configuration for consumers that need runtime settings. */
export const env = readRuntimeEnv();
