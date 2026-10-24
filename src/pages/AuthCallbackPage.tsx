import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  exchangeCodeForSession,
  getSession,
  setSession,
} from '../services/api';

const getSafeNextPath = (rawPath: string | null): string => {
  if (rawPath && rawPath.startsWith('/') && !rawPath.startsWith('//')) {
    return rawPath;
  }

  return '/track';
};

const readOAuthError = (search: URLSearchParams): string | null => {
  const errorDescription = search.get('error_description')?.trim();
  if (errorDescription) return errorDescription;

  const error = search.get('error')?.trim();
  return error || null;
};

export const AuthCallbackPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const search = new URLSearchParams(location.search);
    const nextPath = getSafeNextPath(search.get('next'));
    const oauthError = readOAuthError(search);
    const code = search.get('code')?.trim();
    const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
    const accessToken = hash.get('access_token')?.trim();
    const refreshToken = hash.get('refresh_token')?.trim();

    const completeAuthentication = async (): Promise<void> => {
      try {
        if (oauthError) {
          throw new Error(oauthError);
        }

        if (code) {
          const response = await exchangeCodeForSession(code);
          if (response.error) throw response.error;
        } else if (accessToken && refreshToken) {
          const response = await setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (response.error) throw response.error;
        } else {
          const response = await getSession();
          if (response.error) throw response.error;
          if (!response.data.session) {
            throw new Error('Google sign-in did not return an active session. Please try again.');
          }
        }

        if (active) {
          navigate(nextPath, { replace: true });
        }
      } catch (callbackError) {
        if (active) {
          setError(
            callbackError instanceof Error && callbackError.message.trim()
              ? callbackError.message
              : 'Google sign-in could not be completed. Please try again.',
          );
        }
      }
    };

    void completeAuthentication();

    return () => {
      active = false;
    };
  }, [location.hash, location.search, navigate]);

  if (error) {
    return (
      <section className="page active" aria-labelledby="auth-callback-title">
        <div className="ref-container" style={{ paddingTop: '140px', paddingBottom: '120px' }}>
          <div className="form-notice-box" role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>
              <strong id="auth-callback-title">Google sign-in failed:</strong> {error}
            </span>
          </div>
          <p style={{ marginTop: '18px' }}>
            <Link to="/track" className="btn-join-primary">Return to the race</Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="page active" aria-labelledby="auth-callback-title">
      <div className="ref-container" style={{ paddingTop: '140px', paddingBottom: '120px' }}>
        <div className="form-notice-box" role="status" aria-live="polite">
          <span aria-hidden="true">🔐</span>
          <strong id="auth-callback-title">Completing Google sign-in…</strong>
        </div>
      </div>
    </section>
  );
};

export default AuthCallbackPage;
