import type { FC } from 'react';

interface TrackGridLaunchCardProps {
  isCarAvailable: boolean;
  raceState: 'STANDBY' | 'STARTING' | 'RACING';
  isStartHovered: boolean;
  isCarParked: boolean;
}

export const TrackGridLaunchCard: FC<TrackGridLaunchCardProps> = ({
  isCarAvailable,
  raceState,
  isStartHovered,
  isCarParked,
}) => (
  <div className="track-grid-launch-card">
    <div className="track-grid-launch-meta">
      <span className="track-grid-launch-badge">
        {!isCarAvailable
          ? 'CIRCUIT VIEW ONLY'
          : raceState === 'STARTING'
            ? 'START SEQUENCE'
            : isStartHovered
              ? 'START ZONE ACTIVE'
              : 'HOVER START ZONE • P1'}
      </span>
      <h3 className="track-grid-launch-title">
        {!isCarAvailable
          ? '3D Car Unavailable'
          : raceState === 'STARTING'
            ? 'Starting...'
            : isStartHovered
              ? <>Press <kbd>Space</kbd> to start</>
              : 'Hover to prepare'}
      </h3>
      <p className="track-grid-launch-sub">
        {!isCarAvailable
          ? 'WebGL car controls are unavailable; browse the circuit below'
          : raceState === 'STARTING'
            ? 'Get ready to follow the track with your pointer.'
            : isStartHovered
              ? <>START ZONE ACTIVE — keep hovering and press <kbd>Space</kbd>.</>
              : <>Hover over the highlighted START ZONE and keep your pointer there. Press <kbd>Space</kbd> to start{isCarParked ? ' from the pit bay' : ''}.</>}
      </p>
    </div>
  </div>
);
