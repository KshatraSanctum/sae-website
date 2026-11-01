import React from 'react';
import { WinterCanvas } from './WinterCanvas';
import '../../../styles/winter-footer.css';

export const WinterFooterTheme: React.FC = () => {
  return (
    <div className="winter-footer-root" aria-hidden="true">
      {/* 1. Snow Top Frost Border Accent */}
      <div className="winter-snow-top-edge" />

      {/* 2. Soft Ambient Winter Blue Glow */}
      <div className="winter-frost-glow" />

      {/* 3. HTML5 Snowfall & Wind Blowing Canvas */}
      <WinterCanvas />
    </div>
  );
};
