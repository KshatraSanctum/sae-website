import { createClient } from '@supabase/supabase-js';
import type {
  AuthChangeEvent,
  Session,
  Subscription,
  SupabaseClient,
} from '@supabase/supabase-js';
import { env, type RuntimeEnv } from '../../config/env';

export interface GoogleOAuthOptions {
  readonly redirectTo?: string;
  readonly scopes?: string;
  readonly queryParams?: Readonly<Record<string, string>>;
  readonly skipBrowserRedirect?: boolean;
}

export type SupabaseOAuthResponse = Awaited<
  ReturnType<SupabaseClient['auth']['signInWithOAuth']>
>;
export type SupabaseSessionResponse = Awaited<
  ReturnType<SupabaseClient['auth']['getSession']>
>;
export type SupabaseSignOutOptions = Parameters<SupabaseClient['auth']['signOut']>[0];
export type SupabaseSignOutResponse = Awaited<
  ReturnType<SupabaseClient['auth']['signOut']>
>;
export type SupabaseAuthStateChangeCallback = (
  event: AuthChangeEvent,
  session: Session | null,
) => void;
export type SupabaseAuthStateSubscription = Subscription;

export type SupabaseBrowserClient = SupabaseClient;

export interface SupabaseBrowserClientProvider {
  getClient(): SupabaseBrowserClient;
}

export interface SupabaseAuthService {
  signInWithGoogle(options?: GoogleOAuthOptions): Promise<SupabaseOAuthResponse>;
  getSession(): Promise<SupabaseSessionResponse>;
  signOut(options?: SupabaseSignOutOptions): Promise<SupabaseSignOutResponse>;
  onAuthStateChange(callback: SupabaseAuthStateChangeCallback): SupabaseAuthStateSubscription;
}

export class SupabaseConfigurationError extends Error {
  public constructor() {
    super(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or legacy VITE_SUPABASE_ANON_KEY) before using a Supabase service.',
    );
    this.name = 'SupabaseConfigurationError';
  }
}

const getSupabasePublicKey = (runtimeEnv: RuntimeEnv): string | undefined =>
  runtimeEnv.supabasePublishableKey ?? runtimeEnv.supabaseAnonKey;

/**
 * Lazily create one browser client for a runtime configuration. Consumers can
 * share this provider so auth and Edge Function calls use the same client.
 */
export const createSupabaseBrowserClientProvider = (
  runtimeEnv: RuntimeEnv = env,
): SupabaseBrowserClientProvider => {
  let client: SupabaseBrowserClient | undefined;

  return {
    getClient: () => {
      if (client) {
        return client;
      }

      const publicKey = getSupabasePublicKey(runtimeEnv);
      if (!runtimeEnv.supabaseConfigured || !runtimeEnv.supabaseUrl || !publicKey) {
        throw new SupabaseConfigurationError();
      }

      client = createClient(runtimeEnv.supabaseUrl, publicKey);
      return client;
    },
  };
};

/** Shared lazy provider for the default browser services. */
export const supabaseBrowserClientProvider = createSupabaseBrowserClientProvider(env);

export const getSupabaseBrowserClient = (): SupabaseBrowserClient =>
  supabaseBrowserClientProvider.getClient();

const resolveClientProvider = (
  runtimeEnv: RuntimeEnv,
  clientProvider: SupabaseBrowserClientProvider | undefined,
): SupabaseBrowserClientProvider =>
  clientProvider ??
  (runtimeEnv === env
    ? supabaseBrowserClientProvider
    : createSupabaseBrowserClientProvider(runtimeEnv));

/**
 * Create the auth boundary without constructing a client until a method is
 * explicitly called. The supplied configuration is already validated by
 * readRuntimeEnv (or by the exported env singleton).
 */
export const createSupabaseAuthService = (
  runtimeEnv: RuntimeEnv = env,
  clientProvider?: SupabaseBrowserClientProvider,
): SupabaseAuthService => {
  const provider = resolveClientProvider(runtimeEnv, clientProvider);

  return {
    signInWithGoogle: async (options) =>
      provider.getClient().auth.signInWithOAuth({
        provider: 'google',
        options: options
          ? {
              ...options,
              queryParams: options.queryParams ? { ...options.queryParams } : undefined,
            }
          : undefined,
      }),
    getSession: async () => provider.getClient().auth.getSession(),
    signOut: async (options) => provider.getClient().auth.signOut(options),
    onAuthStateChange: (callback) =>
      provider.getClient().auth.onAuthStateChange(callback).data.subscription,
  };
};

/** Safe default for the static app; it performs no client setup on import. */
export const supabaseAuthService = createSupabaseAuthService(env, supabaseBrowserClientProvider);

export const signInWithGoogle = (options?: GoogleOAuthOptions): Promise<SupabaseOAuthResponse> =>
  supabaseAuthService.signInWithGoogle(options);

export const getSession = (): Promise<SupabaseSessionResponse> =>
  supabaseAuthService.getSession();

export const signOut = (
  options?: SupabaseSignOutOptions,
): Promise<SupabaseSignOutResponse> => supabaseAuthService.signOut(options);

export const onAuthStateChange = (
  callback: SupabaseAuthStateChangeCallback,
): SupabaseAuthStateSubscription => supabaseAuthService.onAuthStateChange(callback);
