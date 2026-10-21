import React, { useEffect, useState } from 'react';
import { initIntro, shouldShowIntro } from '../../intro';

export const IntroOverlay: React.FC = () => {
  const [visible, setVisible] = useState(() => shouldShowIntro());

  useEffect(() => {
    if (visible) {
      try {
        initIntro();
      } catch (error) {
        // The intro is decorative; a failed animation must not block the site.
        console.error('Unable to initialize the intro animation.', error);
        setVisible(false);
      }
    }
  }, [visible]);

  if (!visible) return null;

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
