import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { env } from '../config/env';
import {
  getGoogleAuthRedirectUrl,
  signInWithGoogle,
  signOut,
  supabaseAuthService,
} from '../services/api';

interface UseGoogleAuthOptions {
  readonly redirectPath: string;
}

interface UseGoogleAuthResult {
  readonly session: Session | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly signIn: () => Promise<void>;
  readonly signOut: () => Promise<void>;
}

const readAuthError = (error: unknown, fallback: string): string =>
  error instanceof Error && error.message.trim() ? error.message : fallback;

export const useGoogleAuth = ({ redirectPath }: UseGoogleAuthOptions): UseGoogleAuthResult => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(env.supabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!env.supabaseConfigured) {
      setIsLoading(false);
      return undefined;
    }

    let active = true;
    setIsLoading(true);

    void supabaseAuthService
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (!active) return;
        if (sessionError) {
          setError(readAuthError(sessionError, 'Unable to read the Google session.'));
        } else {
          setSession(data.session);
          setError(null);
        }
      })
      .catch((sessionError: unknown) => {
        if (active) setError(readAuthError(sessionError, 'Unable to read the Google session.'));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    let subscription: ReturnType<typeof supabaseAuthService.onAuthStateChange> | null = null;
    try {
      subscription = supabaseAuthService.onAuthStateChange((_event, nextSession) => {
        if (!active) return;
        setSession(nextSession);
        setError(null);
      });
    } catch (subscriptionError) {
      setError(readAuthError(subscriptionError, 'Unable to watch the Google session.'));
    }

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignIn = useCallback(async (): Promise<void> => {
    setError(null);
    try {
      const { error: signInError } = await signInWithGoogle({
        redirectTo: getGoogleAuthRedirectUrl(redirectPath),
      });
      if (signInError) throw signInError;
    } catch (signInError) {
      setError(readAuthError(signInError, 'Google sign-in could not be started.'));
    }
  }, [redirectPath]);

  const handleSignOut = useCallback(async (): Promise<void> => {
    setError(null);
    try {
      const { error: signOutError } = await signOut();
      if (signOutError) throw signOutError;
      setSession(null);
    } catch (signOutError) {
      setError(readAuthError(signOutError, 'Google sign-out could not be completed.'));
    }
  }, []);

  return {
    session,
    isLoading,
    error,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
};
