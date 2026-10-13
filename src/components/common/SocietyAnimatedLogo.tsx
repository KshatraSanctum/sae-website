import React from 'react';

export interface SocietyAnimatedLogoProps {
  /** Size in pixels (e.g. 380, 420) or CSS string */
  size?: number | string;
  /** Custom CSS classes */
  className?: string;
  /** Currently hovered hero scene ('design' | 'build' | 'compete' | null) */
  activeScene?: 'design' | 'build' | 'compete' | null;
  /** Whether to show outer atmospheric aura */
  showGlow?: boolean;
}

export const SocietyAnimatedLogo: React.FC<SocietyAnimatedLogoProps> = ({
  size = 380,
  className = '',
  activeScene = null,
  showGlow = true,
}) => {
  const dim = typeof size === 'number' ? `${size}px` : size;

  // Scene-reactive aura styling
  const getSceneGlow = () => {
    switch (activeScene) {
      case 'design':
        return 'rgba(56, 189, 248, 0.28)'; // Technical cyan / CAD glow
      case 'build':
        return 'rgba(246, 183, 25, 0.35)'; // High-torque amber / workshop glow
      case 'compete':
        return 'rgba(239, 68, 68, 0.32)'; // Race red / track RPM glow
      default:
        return 'rgba(246, 183, 25, 0.24)'; // Official chapter gold aura
    }
  };

  return (
    <div
      className={`society-animated-logo-container ${className} ${activeScene ? `scene-${activeScene}` : ''}`}
      style={{
        width: dim,
        height: dim,
      }}
      role="img"
      aria-label="SAE BIT Sindri Collegiate Society Official Emblem"
    >
      {/* Outer Atmospheric Aura (Pulse on Hover & Scene-reactive) */}
      {showGlow && (
        <div
          className="society-logo-backdrop-glow"
          style={{ '--society-logo-glow': getSceneGlow() } as React.CSSProperties}
          aria-hidden="true"
        />
      )}

      {/* High-Resolution Master Animated Vector SVG */}
      <div className="society-logo-disc">
        <picture>
          <source
            media="(prefers-reduced-motion: reduce)"
            srcSet="/Society%20of%20Automotive%20Engineers7858.svg"
          />
          <img
            src="/Society%20of%20Automotive%20Engineers7858_animated.svg"
            alt=""
            aria-hidden="true"
            width={1080}
            height={1080}
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </picture>
      </div>
    </div>
  );
};

export default SocietyAnimatedLogo;
