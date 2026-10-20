import { useCallback, useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { TrackDifficulty } from '../utils/trackCircuit';
import {
  signInWithGoogle,
  signOut,
  supabaseAuthService,
  supabaseRaceService,
  type GetLeaderboardResponse,
  type StartRaceResponse,
} from '../services/api';
import { env } from '../config/env';

export interface UseTrackLeaderboardOptions {
  readonly trackId: string;
  readonly difficulty: TrackDifficulty;
  readonly limit?: number;
}

export type TrackRemoteSubmissionStatus =
  | 'idle'
  | 'submitting'
  | 'success'
  | 'pending'
  | 'error';

export interface UseTrackLeaderboardResult {
  readonly session: Session | null;
  readonly entries: GetLeaderboardResponse['entries'];
  readonly isConfigured: boolean;
  readonly isLoading: boolean;
  readonly isAuthLoading: boolean;
  readonly error: string | null;
  readonly authError: string | null;
  readonly remoteSubmissionStatus: TrackRemoteSubmissionStatus;
  readonly remoteSubmissionMessage: string | null;
  readonly signIn: () => Promise<void>;
  readonly signOut: () => Promise<void>;
  readonly refresh: () => Promise<void>;
  readonly startRemoteRace: () => Promise<void>;
  readonly submitRemoteScore: (lapMs: number, checkpointTimes?: readonly number[]) => Promise<void>;
}

const readErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message.trim()) {
    if (/edge function|failed to send a request/i.test(error.message)) {
      return 'The remote leaderboard is not available yet. Local racing remains available.';
    }

    return error.message;
  }

  return fallback;
};

const getUserDisplayName = (session: Session | null): string | null => {
  const metadata = session?.user.user_metadata;
  if (!metadata) {
    return null;
  }

  const candidate = metadata.full_name ?? metadata.name ?? metadata.display_name;
  return typeof candidate === 'string' && candidate.trim() ? candidate.trim() : null;
};

export const useTrackLeaderboard = ({
  trackId,
  difficulty,
  limit = 10,
}: UseTrackLeaderboardOptions): UseTrackLeaderboardResult => {
  const [session, setSession] = useState<Session | null>(null);
  const [entries, setEntries] = useState<GetLeaderboardResponse['entries']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(env.supabaseConfigured);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [remoteSubmissionStatus, setRemoteSubmissionStatus] =
    useState<TrackRemoteSubmissionStatus>('idle');
  const [remoteSubmissionMessage, setRemoteSubmissionMessage] = useState<string | null>(null);
  const remoteRaceRef = useRef<StartRaceResponse | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    if (!env.supabaseConfigured) {
      setEntries([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await supabaseRaceService.getLeaderboard({
        trackId,
        difficulty,
        limit,
        offset: 0,
      });
      setEntries(response.entries);
    } catch (requestError) {
      setEntries([]);
      setError(readErrorMessage(requestError, 'Unable to load the global leaderboard.'));
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, limit, trackId]);

  useEffect(() => {
    if (!env.supabaseConfigured) {
      setIsAuthLoading(false);
      return undefined;
    }

    let active = true;
    setIsAuthLoading(true);

    void supabaseAuthService
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (!active) return;
        if (sessionError) {
          setAuthError(readErrorMessage(sessionError, 'Unable to read the Google session.'));
        } else {
          setSession(data.session);
          setAuthError(null);
        }
      })
      .catch((sessionError: unknown) => {
        if (active) {
          setAuthError(readErrorMessage(sessionError, 'Unable to read the Google session.'));
        }
      })
      .finally(() => {
        if (active) setIsAuthLoading(false);
      });

    let subscription: ReturnType<typeof supabaseAuthService.onAuthStateChange> | null = null;
    try {
      subscription = supabaseAuthService.onAuthStateChange((_event, nextSession) => {
        if (!active) return;
        setSession(nextSession);
        setAuthError(null);
        if (!nextSession) {
          remoteRaceRef.current = null;
        }
      });
    } catch (subscriptionError) {
      setAuthError(readErrorMessage(subscriptionError, 'Unable to watch the Google session.'));
    }

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleSignIn = useCallback(async (): Promise<void> => {
    setAuthError(null);
    try {
      const { error: signInError } = await signInWithGoogle({
        redirectTo: typeof window === 'undefined' ? undefined : window.location.href,
      });
      if (signInError) throw signInError;
    } catch (signInError) {
      setAuthError(readErrorMessage(signInError, 'Google sign-in could not be started.'));
    }
  }, []);

  const handleSignOut = useCallback(async (): Promise<void> => {
    setAuthError(null);
    try {
      const { error: signOutError } = await signOut();
      if (signOutError) throw signOutError;
      setSession(null);
      remoteRaceRef.current = null;
    } catch (signOutError) {
      setAuthError(readErrorMessage(signOutError, 'Google sign-out could not be completed.'));
    }
  }, []);

  const startRemoteRace = useCallback(async (): Promise<void> => {
    if (!session || !env.supabaseConfigured) {
      remoteRaceRef.current = null;
      return;
    }

    try {
      remoteRaceRef.current = await supabaseRaceService.startRace({
        trackId,
        difficulty,
      });
      setRemoteSubmissionStatus('idle');
      setRemoteSubmissionMessage(null);
    } catch (startError) {
      remoteRaceRef.current = null;
      setRemoteSubmissionStatus('error');
      console.error('Unable to start the remote race session', startError);
      setRemoteSubmissionMessage(
        `Remote session unavailable; this lap will remain local. ${readErrorMessage(
          startError,
          '',
        )}`.trim(),
      );
    }
  }, [difficulty, session, trackId]);

  const submitRemoteScore = useCallback(
    async (lapMs: number, checkpointTimes?: readonly number[]): Promise<void> => {
      const remoteRace = remoteRaceRef.current;
      if (!remoteRace || !env.supabaseConfigured) return;

      // A race session accepts one submission. Clear it before the request so
      // the track's seamless next-lap loop cannot submit the same session twice.
      remoteRaceRef.current = null;
      setRemoteSubmissionStatus('submitting');
      setRemoteSubmissionMessage(null);

      try {
        const roundedLapMs = Math.round(lapMs);
        const roundedCheckpoints = checkpointTimes
          ? checkpointTimes.map((time) => Math.round(time))
          : undefined;

        const response = await supabaseRaceService.submitScore({
          sessionId: remoteRace.sessionId,
          sessionToken: remoteRace.sessionToken,
          lapMs: roundedLapMs,
          checkpointTimes: roundedCheckpoints,
        });

        const normalizedStatus = response.status.trim().toLowerCase();
        if (normalizedStatus === 'accepted') {
          setRemoteSubmissionStatus('success');
          setRemoteSubmissionMessage('Lap accepted on the global leaderboard.');
          void refresh();
        } else if (normalizedStatus === 'pending') {
          setRemoteSubmissionStatus('pending');
          setRemoteSubmissionMessage('Lap submitted for review.');
        } else {
          setRemoteSubmissionStatus('error');
          setRemoteSubmissionMessage(`Lap marked ${normalizedStatus || 'for review'}.`);
        }
      } catch (submissionError) {
        setRemoteSubmissionStatus('error');
        setRemoteSubmissionMessage(
          readErrorMessage(submissionError, 'Remote lap submission failed; your local record is safe.'),
        );
      }
    },
    [refresh],
  );

  return {
    session,
    entries,
    isConfigured: env.supabaseConfigured,
    isLoading,
    isAuthLoading,
    error,
    authError,
    remoteSubmissionStatus,
    remoteSubmissionMessage,
    signIn: handleSignIn,
    signOut: handleSignOut,
    refresh,
    startRemoteRace,
    submitRemoteScore,
  };
};

export const getTrackLeaderboardIdentity = (session: Session | null) => ({
  displayName: getUserDisplayName(session),
  email: session?.user.email ?? null,
});
