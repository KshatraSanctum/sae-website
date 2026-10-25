import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SocietyAnimatedLogo } from '../common/SocietyAnimatedLogo';

const MOBILE_HERO_QUERY = '(max-width: 767px)';

const getInitialMobileLayout = () =>
  typeof window !== 'undefined' && window.matchMedia(MOBILE_HERO_QUERY).matches;

export const HeroSection: React.FC = () => {
  const [activeScene, setActiveScene] = useState<'design' | 'build' | 'compete' | null>(null);
  const [isMobileLayout, setIsMobileLayout] = useState(getInitialMobileLayout);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_HERO_QUERY);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsMobileLayout(event.matches);
    };

    setIsMobileLayout(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleViewportChange);
      return () => mediaQuery.removeEventListener('change', handleViewportChange);
    }

    mediaQuery.addListener(handleViewportChange);
    return () => mediaQuery.removeListener(handleViewportChange);
  }, []);

  return (
    <section className="ref-hero">
      <img
        src="https://images.unsplash.com/photo-1595008382755-48b0d68865f6?auto=format&fit=crop&w=1400&q=75"
        alt="Automotive design displayed on an engineering workstation"
        className={`hero-scene ${activeScene === 'design' ? 'is-active' : ''}`}
        data-scene="design"
        width="1400"
        height="933"
        decoding="async"
      />
      <img
        src="https://images.unsplash.com/photo-1700770956485-87150c75ad65?auto=format&fit=crop&w=1400&q=75"
        alt="Student engineers working together around a car in a garage"
        className={`hero-scene ${activeScene === 'build' ? 'is-active' : ''}`}
        data-scene="build"
        width="1400"
        height="933"
        loading="lazy"
        decoding="async"
      />
      <img
        src="https://images.unsplash.com/photo-1690984651796-6bbb102fbf30?auto=format&fit=crop&w=1400&q=75"
        alt="Race car moving at speed during a track competition"
        className={`hero-scene ${activeScene === 'compete' ? 'is-active' : ''}`}
        data-scene="compete"
        width="1400"
        height="933"
        loading="lazy"
        decoding="async"
      />
      <div className="hero-gradient-overlay"></div>

      <div className="ref-container hero-content-wrap">
        {/* Mobile Background Crest (watermark behind the copy with reduced opacity) */}
        {isMobileLayout && (
          <div
            className={`hero-visual-backdrop-mobile ${activeScene ? 'is-hidden' : ''}`}
            aria-hidden="true"
          >
            <div className="hero-logo-frame">
              <SocietyAnimatedLogo
                size="100%"
                activeScene={activeScene}
              />
            </div>
          </div>
        )}

        <div className="hero-copy-box">
          {/* 1. Header Tagline Row */}
          <div className="hero-enter hero-delay-1 hero-tag-row">
            <span className="hero-tag-line"></span>
            <p className="hero-tag-text">Engineering the future of mobility</p>
          </div>

          {/* 2. Slogan: Design. Build. Compete. */}
          <div className="hero-slogan-wrap">
            <h1
              className="slogan hero-enter hero-delay-2"
              id="heroSlogan"
              onMouseLeave={() => setActiveScene(null)}
            >
              <button
                type="button"
                className={`slogan-word ${activeScene === 'design' ? 'is-active' : ''}`}
                data-scene="design"
                aria-label="Toggle Design engineering phase visual"
                onClick={() => setActiveScene(prev => prev === 'design' ? null : 'design')}
                onMouseEnter={() => setActiveScene('design')}
                onFocus={() => setActiveScene('design')}
              >
                Design.
              </button>
              <button
                type="button"
                className={`slogan-word ${activeScene === 'build' ? 'is-active' : ''}`}
                data-scene="build"
                aria-label="Toggle Build fabrication phase visual"
                onClick={() => setActiveScene(prev => prev === 'build' ? null : 'build')}
                onMouseEnter={() => setActiveScene('build')}
                onFocus={() => setActiveScene('build')}
              >
                Build.
              </button>
              <button
                type="button"
                className={`slogan-word ${activeScene === 'compete' ? 'is-active' : ''}`}
                data-scene="compete"
                aria-label="Toggle Compete track racing phase visual"
                onClick={() => setActiveScene(prev => prev === 'compete' ? null : 'compete')}
                onMouseEnter={() => setActiveScene('compete')}
                onFocus={() => setActiveScene('compete')}
              >
                Compete.
              </button>
            </h1>
          </div>

          {/* 4. Short Description */}
          <p className="hero-enter hero-delay-3 hero-sub hero-subtext">
            Designing, building, and racing national-tier Formula Bharat and BAJA SAE prototypes.
            Student-engineered spaceframe chassis, electric powertrains, custom suspension geometry, and real-time telemetry from the ground up.
          </p>

          {/* 5. CTA Row */}
          <div className="hero-enter hero-delay-4 hero-cta-row">
            <Link
              to="/join"
              className="ref-btn ref-btn-primary effect-shine"
            >
              Become a member
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>
            <Link
              to="/about"
              className="ref-btn ref-btn-light effect-shine"
            >
              Explore our Society
            </Link>
          </div>
        </div>

        {/* Right Side: Animated Chapter Crest (desktop only, hides when hovering) */}
        {!isMobileLayout && (
          <div
            className={`hero-visual-box hero-visual-box-desktop hero-enter hero-delay-3 ${activeScene ? 'is-hidden' : ''}`}
            aria-hidden={activeScene !== null}
          >
            <div className="hero-logo-frame">
              <SocietyAnimatedLogo
                size={390}
                activeScene={activeScene}
              />
            </div>
            <div className="hero-logo-telemetry mono">
              <span className="hero-telemetry-dot" />
              <span className="hero-telemetry-text">EST. BIT SINDRI · SAE CHAPTER</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
