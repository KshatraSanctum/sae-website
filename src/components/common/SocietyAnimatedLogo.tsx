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
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Animated SAE BIT Sindri Collegiate Society Official Emblem"
    >
      {/* Outer Atmospheric Aura (Pulse on Hover & Scene-reactive) */}
      {showGlow && (
        <div
          className="society-logo-backdrop-glow"
          style={{
            position: 'absolute',
            inset: '-15%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${getSceneGlow()} 0%, transparent 70%)`,
            filter: 'blur(32px)',
            pointerEvents: 'none',
            zIndex: 0,
            transition: 'background 0.5s ease',
          }}
        />
      )}

      {/* High-Resolution Master Animated Vector SVG */}
      <div
        className="society-logo-disc"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 1,
          borderRadius: '50%',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >
        <img
          src="/Society%20of%20Automotive%20Engineers7858_animated.svg"
          alt="SAE India BIT Sindri Animated Emblem with Rotating Gear and Orbiting Electrons"
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          loading="eager"
        />
      </div>
    </div>
  );
};

export default SocietyAnimatedLogo;
