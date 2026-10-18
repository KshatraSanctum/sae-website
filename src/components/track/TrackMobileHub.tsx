import type { FC } from 'react';
import { Link } from 'react-router-dom';

interface TrackMobileHubProps {
  onViewCircuitMap: () => void;
}

export const TrackMobileHub: FC<TrackMobileHubProps> = ({ onViewCircuitMap }) => (
  <section className="track-mobile-hub-card" aria-label="Mobile Simulation Advisory">
    <div className="mobile-hub-badge-wrap">
      <span className="mobile-hub-badge">
        <span className="mobile-hub-dot" aria-hidden="true" />
        SIMULATOR IN BETA
      </span>
    </div>
    <div className="mobile-hub-device-row" aria-hidden="true">
      <span className="m-icon">💻</span>
      <span className="m-arrow">➔</span>
      <span className="m-icon">🏎️</span>
    </div>
    <h2 className="mobile-hub-title">Desktop Required to Race</h2>
    <p className="mobile-hub-desc">
      The 3D Formula Student race track is currently optimized for desktop with physical keyboard launch (<kbd>Space</kbd>) and precision pointer steering.
    </p>
    <div className="mobile-hub-points">
      <div className="mobile-point-item">
        <span className="p-bullet">⌨️</span>
        <span><strong>Keyboard Telemetry:</strong> Spacebar launch &amp; reset hotkey (<kbd>R</kbd>).</span>
      </div>
      <div className="mobile-point-item">
        <span className="p-bullet">🖱️</span>
        <span><strong>Pointer Dynamics:</strong> High-precision apex tracking and drift limits.</span>
      </div>
      <div className="mobile-point-item">
        <span className="p-bullet">📲</span>
        <span><strong>Touch Controls:</strong> Mobile touch-steering is in active development in our bay!</span>
      </div>
    </div>

    <div className="mobile-hub-actions">
      <button
        type="button"
        className="mobile-act-btn mobile-act-primary"
        onClick={onViewCircuitMap}
      >
        🗺️ View Full Circuit Map &amp; Turns
      </button>
      <a
        href="https://github.com/saeindiabit-sindri/sae-website"
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-act-btn mobile-act-contribute"
      >
        🛠️ Contribute on GitHub 🐙
      </a>
      <Link
        to="/competitions"
        className="mobile-act-btn mobile-act-secondary"
      >
        🏆 Explore Competitions &amp; Trophies
      </Link>
    </div>

    <div className="mobile-hub-specs-grid">
      <div className="mobile-spec-item">
        <span className="s-val">4.31 KM</span>
        <span className="s-label">Circuit Scale</span>
      </div>
      <div className="mobile-spec-item">
        <span className="s-val">15 Turns</span>
        <span className="s-label">Technical Corners</span>
      </div>
      <div className="mobile-spec-item">
        <span className="s-val">2 Zones</span>
        <span className="s-label">DRS Straights</span>
      </div>
      <div className="mobile-spec-item">
        <span className="s-val">3 Sectors</span>
        <span className="s-label">Split Timing</span>
      </div>
    </div>
  </section>
);
