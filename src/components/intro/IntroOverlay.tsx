import React, { useEffect } from 'react';
import { initIntro } from '../../intro';

export const IntroOverlay: React.FC = () => {
  useEffect(() => {
    initIntro();
  }, []);

  return (
    <div id="introOverlay">
      <canvas id="asciiCanvas"></canvas>
      <div id="introLogoContainer" className="intro-logo-container">
        <img
          id="introRealLogo"
          className="intro-real-logo"
          src="/bit-sindri-sae-logo.png"
          alt="SAE India BIT Sindri Logo"
        />
      </div>
      <div id="introSubtitle" className="intro-sub">
        <div className="intro-title">SAE INDIA · BIT SINDRI</div>
        <div className="intro-tag">COLLEGIATE CHAPTER</div>
      </div>
      <button id="introSkipBtn" className="intro-skip-btn" type="button">
        SKIP [ESC] ❯
      </button>
    </div>
  );
};
