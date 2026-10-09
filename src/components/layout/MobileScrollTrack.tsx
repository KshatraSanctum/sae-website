import React from 'react';

export const MobileScrollTrack: React.FC = () => {
  return (
    <div className="mobile-scroll-track" id="mobileScrollTrack" aria-hidden="true">
      <div className="m-track-rail">
        <div className="m-track-fill" id="mTrackFill"></div>
      </div>
      <div className="m-track-labels">
        <span className="m-track-start">START</span>
        <span className="m-track-pct" id="mTrackPct">0%</span>
        <span className="m-track-finish">FINISH 🏁</span>
      </div>
    </div>
  );
};
