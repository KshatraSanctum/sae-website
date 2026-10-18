import type { FC } from 'react';

interface TrackMobileCircuitBarProps {
  onBackToDetails: () => void;
}

export const TrackMobileCircuitBar: FC<TrackMobileCircuitBarProps> = ({ onBackToDetails }) => (
  <div className="track-mobile-circuit-bar">
    <button
      type="button"
      className="track-mobile-back-btn"
      onClick={onBackToDetails}
    >
      ← Back to Details
    </button>
    <span className="track-mobile-circuit-tag">CIRCUIT PREVIEW ONLY</span>
    <a
      href="https://github.com/saeindiabit-sindri/sae-website"
      target="_blank"
      rel="noopener noreferrer"
      className="track-mobile-circuit-contrib"
    >
      Contribute 🐙
    </a>
  </div>
);
