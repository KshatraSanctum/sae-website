import type { FC } from 'react';

interface TrackTelemetryHudProps {
  raceState: 'STANDBY' | 'STARTING' | 'RACING';
  lapTimeDisplay: string;
  bestLapTime: number | null;
  formatTime: (ms: number) => string;
  s1Cleared: boolean;
  s2Cleared: boolean;
  s3Cleared: boolean;
  s1Time: string | null;
  s2Time: string | null;
  s3Time: string | null;
  speedKmh: number;
  rpmPct: number;
  isCrashed: boolean;
  isCarParked: boolean;
}

export const TrackTelemetryHud: FC<TrackTelemetryHudProps> = ({
  raceState,
  lapTimeDisplay,
  bestLapTime,
  formatTime,
  s1Cleared,
  s2Cleared,
  s3Cleared,
  s1Time,
  s2Time,
  s3Time,
  speedKmh,
  rpmPct,
  isCrashed,
  isCarParked,
}) => (
  <>
    {/* Telemetry HUD: Top Left Timer & Sectors */}
    <div className="track-hud-top-left">
      <div className="hud-timer-card">
        <div className="hud-timer-label">Lap Time</div>
        <div className={`hud-timer-digits ${raceState === 'RACING' ? 'is-running' : ''}`}>
          {lapTimeDisplay}
        </div>
        <div className="hud-best-row">
          <span className="hud-best-badge">PERSONAL BEST</span>
          <span>{bestLapTime ? formatTime(bestLapTime * 1000) : '--:--.---'}</span>
        </div>
      </div>

      {/* Sector split pills */}
      <div className="hud-sectors-row">
        <div className={`hud-sector-pill ${s1Cleared ? 'is-cleared' : raceState === 'RACING' ? 'is-active' : ''}`}>
          <span>S1</span>
          <strong>{s1Time ? s1Time.slice(3) : '--'}</strong>
        </div>
        <div className={`hud-sector-pill ${s2Cleared ? 'is-cleared' : s1Cleared ? 'is-active' : ''}`}>
          <span>S2</span>
          <strong>{s2Time ? s2Time.slice(3) : '--'}</strong>
        </div>
        <div className={`hud-sector-pill ${s3Cleared ? 'is-cleared' : s2Cleared ? 'is-active' : ''}`}>
          <span>S3</span>
          <strong>{s3Time ? s3Time.slice(3) : '--'}</strong>
        </div>
      </div>
    </div>

    {/* Telemetry HUD: Bottom Right Speedometer */}
    <div className="track-hud-bottom-right">
      <div className="hud-speed-gauge">
        <div className="hud-speed-value">
          <span>{speedKmh}</span>
          <span className="hud-speed-unit">KM/H</span>
        </div>
        <div className="hud-rpm-track">
          <div className="hud-rpm-fill" style={{ width: `${rpmPct}%` }} />
        </div>
        <div className="hud-telemetry-meta">
          <span>GEAR: {speedKmh > 110 ? '4' : speedKmh > 70 ? '3' : speedKmh > 25 ? '2' : '1'}</span>
          <span>STATUS: {isCrashed ? 'CRASH' : isCarParked ? 'PARKED' : raceState === 'RACING' ? 'DRIVING' : 'STANDBY'}</span>
        </div>
      </div>
    </div>
  </>
);
