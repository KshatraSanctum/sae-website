import { env, type RuntimeEnv } from '../../config/env';
import {
  createSupabaseBrowserClientProvider,
  supabaseBrowserClientProvider,
  type SupabaseBrowserClientProvider,
} from './supabaseService';

export interface JoinApplicationInput {
  readonly name: string;
  readonly roll: string;
  readonly branch: string;
  readonly year: string;
  readonly phone: string;
  readonly crew: string;
  readonly subdomain: string;
  readonly skills: string;
  readonly availability: string;
  readonly motivation: string;
  readonly whatsappConsent: boolean;
}

export interface SubmitJoinApplicationResponse {
  readonly applicationId: string;
  readonly status: string;
  readonly submittedAt: string;
}

const normalizeFunctionError = async (error: unknown): Promise<Error> => {
  if (error && typeof error === 'object' && 'context' in error) {
    const context = (error as { readonly context?: unknown }).context;
    if (context instanceof Response) {
      try {
        const payload = (await context.clone().json()) as { error?: unknown };
        if (typeof payload.error === 'string' && payload.error.trim()) {
          return new Error(payload.error);
        }
      } catch {
        // Fall through to the SDK error when the function did not return JSON.
      }
    }
  }

  return error instanceof Error ? error : new Error('The Supabase join function failed.');
};

const resolveClientProvider = (
  runtimeEnv: RuntimeEnv,
  clientProvider: SupabaseBrowserClientProvider | undefined,
): SupabaseBrowserClientProvider =>
  clientProvider ??
  (runtimeEnv === env
    ? supabaseBrowserClientProvider
    : createSupabaseBrowserClientProvider(runtimeEnv));

export const createSupabaseJoinService = (
  runtimeEnv: RuntimeEnv = env,
  clientProvider?: SupabaseBrowserClientProvider,
) => {
  const provider = resolveClientProvider(runtimeEnv, clientProvider);

  return {
    submitApplication: async (
      input: JoinApplicationInput,
    ): Promise<SubmitJoinApplicationResponse> => {
      const client = provider.getClient();
      const { data: sessionData, error: sessionError } = await client.auth.getSession();
      if (sessionError) throw sessionError;

      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        throw new Error('Sign in with Google before submitting your society application.');
      }

      const { data, error } = await client.functions.invoke<SubmitJoinApplicationResponse>(
        'submit-join-application',
        {
          body: input,
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (error) throw await normalizeFunctionError(error);
      if (!data) throw new Error('The join application service returned no data.');
      return data;
    },
  };
};

export const supabaseJoinService = createSupabaseJoinService(
  env,
  supabaseBrowserClientProvider,
);

export const submitJoinApplication = (
  input: JoinApplicationInput,
): Promise<SubmitJoinApplicationResponse> => supabaseJoinService.submitApplication(input);
