import type { FC } from 'react';
import type { TrackDifficulty } from '../../utils/trackCircuit';

export interface TrackLeaderboardSession {
  readonly displayName?: string | null;
  readonly email?: string | null;
}

export interface TrackLeaderboardEntry {
  readonly id: string;
  readonly playerName: string;
  /** Score in milliseconds, matching the remote race submission contract. */
  readonly score: number;
  readonly rank: number;
  readonly createdAt?: string | null;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export type TrackLeaderboardSubmissionStatus =
  | 'idle'
  | 'pending'
  | 'submitting'
  | 'submitted'
  | 'success'
  | 'error'
  | 'failed'
  | (string & {});

export interface TrackLeaderboardProps {
  readonly session: TrackLeaderboardSession | null;
  readonly entries: readonly TrackLeaderboardEntry[];
  readonly isLoading: boolean;
  readonly error?: string | null;
  readonly authError?: string | null;
  readonly isAuthLoading: boolean;
  readonly remoteSubmissionStatus?: TrackLeaderboardSubmissionStatus | null;
  readonly remoteSubmissionMessage?: string | null;
  readonly difficulty: TrackDifficulty;
  readonly trackName?: string;
  readonly isConfigured?: boolean;
  readonly configurationMessage?: string | null;
  readonly formatLapTime?: (score: number, entry: TrackLeaderboardEntry) => string;
  readonly onSignIn: () => void | Promise<void>;
  readonly onSignOut: () => void | Promise<void>;
  readonly onRefresh: () => void | Promise<void>;
}

const DEFAULT_TRACK_NAME = 'BIT Sindri International Circuit';

/** Format a millisecond lap score as MM:SS.mmm. */
export const formatTrackLeaderboardLapTime = (score: number): string => {
  if (!Number.isFinite(score) || score < 0) {
    return '--:--.---';
  }

  const totalMilliseconds = Math.round(score);
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = totalMilliseconds % 1000;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
};

const getMetadataString = (
  metadata: Readonly<Record<string, unknown>> | undefined,
  key: string,
): string | null => {
  const value = metadata?.[key];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
};

const formatDifficultyLabel = (difficulty: string): string => {
  const normalized = difficulty.trim().toUpperCase();
  if (normalized === 'PRO') return 'Pro Sim';
  if (normalized === 'STANDARD') return 'Standard';
  return difficulty;
};

const formatSubmissionDate = (createdAt: string | null | undefined): string | null => {
  if (!createdAt) return null;

  const timestamp = Date.parse(createdAt);
  if (!Number.isFinite(timestamp)) return null;

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(timestamp);
};

const getInitials = (value: string): string => {
  const initials = value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return initials || 'G';
};

const getSubmissionStatusView = (
  status: TrackLeaderboardSubmissionStatus | null | undefined,
  message: string | null | undefined,
): { tone: 'pending' | 'success' | 'error'; label: string } | null => {
  if (!status || status === 'idle') return null;

  const normalized = status.trim().toLowerCase();
  const tone = normalized.includes('error') || normalized.includes('fail') ? 'error' :
    normalized.includes('submit') || normalized.includes('pending') || normalized.includes('process')
      ? 'pending'
      : 'success';

  if (message?.trim()) {
    return { tone, label: message.trim() };
  }

  if (tone === 'error') {
    return { tone, label: 'Remote lap submission failed. You can keep racing locally.' };
  }

  if (tone === 'pending') {
    return { tone, label: 'Submitting your lap to the global leaderboard…' };
  }

  return { tone, label: 'Lap submitted to the global leaderboard.' };
};

export const TrackLeaderboard: FC<TrackLeaderboardProps> = ({
  session,
  entries,
  isLoading,
  error,
  authError,
  isAuthLoading,
  remoteSubmissionStatus,
  remoteSubmissionMessage,
  difficulty,
  trackName = DEFAULT_TRACK_NAME,
  isConfigured = true,
  configurationMessage,
  formatLapTime,
  onSignIn,
  onSignOut,
  onRefresh,
}) => {
  const displayName = session?.displayName?.trim() || null;
  const email = session?.email?.trim() || null;
  const identityLabel = displayName || email || 'Google account';
  const submissionStatus = getSubmissionStatusView(remoteSubmissionStatus, remoteSubmissionMessage);

  return (
    <section
      className="track-leaderboard"
      aria-labelledby="track-leaderboard-title"
      aria-busy={isLoading}
    >
      <div className="track-leaderboard-header">
        <div className="track-leaderboard-heading-group">
          <span className="track-leaderboard-kicker">COMPETITIVE TIMING</span>
          <h2 id="track-leaderboard-title" className="track-leaderboard-title">
            Global Leaderboard
          </h2>
          <p className="track-leaderboard-description">
            Any Google account can compete on this circuit. Score moderation and review remain separate from the race controls.
          </p>
        </div>

        <div className="track-leaderboard-auth" aria-label="Leaderboard account controls">
          {session ? (
            <div className="track-leaderboard-account">
              <span className="track-leaderboard-avatar" aria-hidden="true">
                {getInitials(identityLabel)}
              </span>
              <div className="track-leaderboard-account-copy">
                <strong className="track-leaderboard-account-name">{identityLabel}</strong>
                {email && email !== displayName && (
                  <span className="track-leaderboard-account-email">{email}</span>
                )}
                {isAuthLoading && (
                  <span className="track-leaderboard-auth-status" role="status" aria-live="polite">
                    Checking Google session…
                  </span>
                )}
              </div>
              <button
                type="button"
                className="track-leaderboard-signout"
                onClick={() => void onSignOut()}
                disabled={isAuthLoading}
                aria-label="Sign out of Google"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="track-leaderboard-google-button"
              onClick={() => void onSignIn()}
              disabled={isAuthLoading}
              aria-label={isAuthLoading ? 'Checking Google session' : 'Sign in with Google'}
            >
              <span className="track-leaderboard-google-icon" aria-hidden="true">G</span>
              <span>{isAuthLoading ? 'Checking Google session…' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>
      </div>

      {authError && (
        <div className="track-leaderboard-auth-error" role="alert" aria-live="polite">
          {authError}
        </div>
      )}

      <div className="track-leaderboard-toolbar" aria-label="Leaderboard context and actions">
        <div className="track-leaderboard-context">
          <span className="track-leaderboard-context-item">
            <span className="track-leaderboard-context-label">Track</span>
            <strong>{trackName}</strong>
          </span>
          <span className="track-leaderboard-context-item">
            <span className="track-leaderboard-context-label">Difficulty</span>
            <strong>{formatDifficultyLabel(difficulty)}</strong>
          </span>
        </div>
        <button
          type="button"
          className="track-leaderboard-refresh"
          onClick={() => void onRefresh()}
          disabled={isLoading || !isConfigured}
          aria-label="Refresh global leaderboard"
        >
          <span aria-hidden="true">↻</span>
          <span>Refresh</span>
        </button>
      </div>

      {submissionStatus && (
        <div
          className={`track-leaderboard-submission track-leaderboard-submission-${submissionStatus.tone}`}
          role={submissionStatus.tone === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          <span className="track-leaderboard-submission-dot" aria-hidden="true" />
          <span>{submissionStatus.label}</span>
        </div>
      )}

      <div className="track-leaderboard-body">
        {!isConfigured ? (
          <div className="track-leaderboard-state track-leaderboard-state-config" role="status" aria-live="polite">
            <span className="track-leaderboard-state-icon" aria-hidden="true">⚙</span>
            <div className="track-leaderboard-state-copy">
              <strong className="track-leaderboard-state-title">Leaderboard not configured</strong>
              <span className="track-leaderboard-state-description">
                {configurationMessage || 'Connect the remote race service to load and submit global times.'}
              </span>
            </div>
          </div>
        ) : isLoading ? (
          <div className="track-leaderboard-state track-leaderboard-state-loading" role="status" aria-live="polite">
            <span className="track-leaderboard-loading-indicator" aria-hidden="true" />
            <div className="track-leaderboard-state-copy">
              <strong className="track-leaderboard-state-title">Loading global leaderboard</strong>
              <span className="track-leaderboard-state-description">Fetching the latest accepted lap times…</span>
            </div>
          </div>
        ) : error ? (
          <div className="track-leaderboard-state track-leaderboard-state-error" role="alert">
            <span className="track-leaderboard-state-icon" aria-hidden="true">!</span>
            <div className="track-leaderboard-state-copy">
              <strong className="track-leaderboard-state-title">Unable to load leaderboard</strong>
              <span className="track-leaderboard-state-description">{error}</span>
            </div>
            <button
              type="button"
              className="track-leaderboard-state-action"
              onClick={() => void onRefresh()}
              aria-label="Retry loading global leaderboard"
            >
              Try again
            </button>
          </div>
        ) : entries.length === 0 ? (
          <div className="track-leaderboard-state track-leaderboard-state-empty" role="status" aria-live="polite">
            <span className="track-leaderboard-state-icon" aria-hidden="true">🏁</span>
            <div className="track-leaderboard-state-copy">
              <strong className="track-leaderboard-state-title">No accepted laps yet</strong>
              <span className="track-leaderboard-state-description">
                Be the first driver to post a clean time on this track.
              </span>
            </div>
          </div>
        ) : (
          <div className="track-leaderboard-table-wrap">
            <table className="track-leaderboard-table">
              <caption className="track-leaderboard-sr-only">
                Global leaderboard for {trackName} at {formatDifficultyLabel(difficulty)} difficulty
              </caption>
              <thead className="track-leaderboard-table-head">
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Player</th>
                  <th scope="col">Track / difficulty</th>
                  <th scope="col">Lap time</th>
                </tr>
              </thead>
              <tbody className="track-leaderboard-table-body">
                {entries.map((entry) => {
                  const metadataDifficulty = getMetadataString(entry.metadata, 'difficulty') || difficulty;
                  const metadataTrack =
                    getMetadataString(entry.metadata, 'trackName') ||
                    getMetadataString(entry.metadata, 'trackId') ||
                    trackName;
                  const submittedDate = formatSubmissionDate(entry.createdAt);
                  const playerName = entry.playerName.trim() || 'Anonymous driver';
                  const rank = Number.isFinite(entry.rank) ? `#${entry.rank}` : '—';
                  const lapTime = formatLapTime
                    ? formatLapTime(entry.score, entry)
                    : formatTrackLeaderboardLapTime(entry.score);

                  return (
                    <tr key={entry.id} className="track-leaderboard-row">
                      <td className="track-leaderboard-cell track-leaderboard-cell-rank" data-label="Rank">
                        <span className="track-leaderboard-rank-badge">{rank}</span>
                      </td>
                      <td className="track-leaderboard-cell track-leaderboard-cell-player" data-label="Player">
                        <div className="track-leaderboard-player">
                          <strong className="track-leaderboard-player-name">{playerName}</strong>
                          {submittedDate && (
                            <time className="track-leaderboard-player-date" dateTime={entry.createdAt ?? undefined}>
                              {submittedDate}
                            </time>
                          )}
                        </div>
                      </td>
                      <td className="track-leaderboard-cell track-leaderboard-cell-context" data-label="Track / difficulty">
                        <div className="track-leaderboard-entry-context">
                          <span className="track-leaderboard-entry-track">{metadataTrack}</span>
                          <span className="track-leaderboard-entry-difficulty">
                            {formatDifficultyLabel(metadataDifficulty)}
                          </span>
                        </div>
                      </td>
                      <td className="track-leaderboard-cell track-leaderboard-cell-score" data-label="Lap time">
                        <strong className="track-leaderboard-score">{lapTime}</strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrackLeaderboard;
