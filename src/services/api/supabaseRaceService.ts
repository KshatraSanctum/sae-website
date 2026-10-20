import { env, type RuntimeEnv } from '../../config/env';
import {
  createSupabaseBrowserClientProvider,
  supabaseBrowserClientProvider,
  type SupabaseBrowserClientProvider,
} from './supabaseService';

export interface StartRaceInput {
  readonly trackId?: string;
  readonly difficulty?: string;
}

export interface StartRaceResponse {
  readonly sessionId: string;
  readonly sessionToken: string;
  readonly trackId: string;
  readonly trackVersion: string;
  readonly physicsVersion: string;
  readonly difficulty: string;
  readonly startedAt: string;
  readonly expiresAt: string;
  readonly rules: Readonly<Record<string, unknown>>;
}

export interface SubmitScoreInput {
  readonly sessionId: string;
  readonly sessionToken: string;
  readonly lapMs: number;
  readonly checkpointTimes?: readonly number[];
}

export interface SubmitScoreResponse {
  readonly submissionId: string;
  readonly status: string;
  readonly lapMs: number;
}

export interface GetLeaderboardInput {
  readonly trackId?: string;
  readonly difficulty?: string;
  readonly limit?: number;
  readonly offset?: number;
}

export interface SupabaseLeaderboardEntry {
  readonly id: string;
  readonly playerName: string;
  readonly score: number;
  readonly rank: number;
  readonly createdAt: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface GetLeaderboardResponse {
  readonly entries: readonly SupabaseLeaderboardEntry[];
}

export interface SupabaseRaceService {
  startRace(input?: StartRaceInput): Promise<StartRaceResponse>;
  submitScore(input: SubmitScoreInput): Promise<SubmitScoreResponse>;
  getLeaderboard(input?: GetLeaderboardInput): Promise<GetLeaderboardResponse>;
}

export type SupabaseLeaderboardService = SupabaseRaceService;

type RaceFunctionName = 'start-race' | 'submit-score' | 'get-leaderboard';

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

  return error instanceof Error ? error : new Error('The Supabase race function failed.');
};

const resolveClientProvider = (
  runtimeEnv: RuntimeEnv,
  clientProvider: SupabaseBrowserClientProvider | undefined,
): SupabaseBrowserClientProvider =>
  clientProvider ??
  (runtimeEnv === env
    ? supabaseBrowserClientProvider
    : createSupabaseBrowserClientProvider(runtimeEnv));

const invokeRaceFunction = async <T>(
  clientProvider: SupabaseBrowserClientProvider,
  functionName: RaceFunctionName,
  body: object,
): Promise<T> => {
  const client = clientProvider.getClient();
  const headers: Record<string, string> = {};

  if (functionName !== 'get-leaderboard') {
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError) {
      throw sessionError;
    }

    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      throw new Error('Sign in with Google before starting or submitting a remote race.');
    }

    // Pass the current access token explicitly. This avoids relying on a
    // cached Functions client header after an OAuth redirect and keeps the
    // server-side user check deterministic.
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const { data, error } = await client.functions.invoke<T>(functionName, {
    body,
    headers,
  });

  if (error) {
    throw await normalizeFunctionError(error);
  }

  if (data === null || data === undefined) {
    throw new Error(`Supabase Edge Function "${functionName}" returned no data.`);
  }

  return data;
};

/**
 * Lazily invoke the deployed race Edge Functions through the shared browser
 * client. Constructing or importing this service performs no I/O.
 */
export const createSupabaseRaceService = (
  runtimeEnv: RuntimeEnv = env,
  clientProvider?: SupabaseBrowserClientProvider,
): SupabaseRaceService => {
  const provider = resolveClientProvider(runtimeEnv, clientProvider);

  return {
    startRace: (input = {}) => invokeRaceFunction<StartRaceResponse>(provider, 'start-race', input),
    submitScore: (input) =>
      invokeRaceFunction<SubmitScoreResponse>(provider, 'submit-score', input),
    getLeaderboard: (input = {}) =>
      invokeRaceFunction<GetLeaderboardResponse>(provider, 'get-leaderboard', input),
  };
};

/** Safe default for the static app; configuration is checked on method calls. */
export const supabaseRaceService = createSupabaseRaceService(
  env,
  supabaseBrowserClientProvider,
);

export const supabaseLeaderboardService = supabaseRaceService;

export const createSupabaseLeaderboardService = createSupabaseRaceService;

export const startRace = (input?: StartRaceInput): Promise<StartRaceResponse> =>
  supabaseRaceService.startRace(input);

export const submitScore = (input: SubmitScoreInput): Promise<SubmitScoreResponse> =>
  supabaseRaceService.submitScore(input);

export const getLeaderboard = (
  input?: GetLeaderboardInput,
): Promise<GetLeaderboardResponse> => supabaseRaceService.getLeaderboard(input);
