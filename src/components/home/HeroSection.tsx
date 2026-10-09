import React, { useState } from 'react';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [activeScene, setActiveScene] = useState<'design' | 'build' | 'compete'>('build');

  return (
    <section className="ref-hero">
      <img
        src="https://images.unsplash.com/photo-1595008382755-48b0d68865f6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1800"
        alt="Automotive design displayed on an engineering workstation"
        className={`hero-scene ${activeScene === 'design' ? 'is-active' : ''}`}
        data-scene="design"
      />
      <img
        src="https://images.unsplash.com/photo-1700770956485-87150c75ad65?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1800"
        alt="Student engineers working together around a car in a garage"
        className={`hero-scene ${activeScene === 'build' ? 'is-active' : ''}`}
        data-scene="build"
      />
      <img
        src="https://images.unsplash.com/photo-1690984651796-6bbb102fbf30?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1800"
        alt="Race car moving at speed during a track competition"
        className={`hero-scene ${activeScene === 'compete' ? 'is-active' : ''}`}
        data-scene="compete"
      />
      <div className="hero-gradient-overlay"></div>
      <div className="tech-grid" style={{ position: 'absolute', inset: 0, opacity: 0.2 }}></div>
      <div
        className="ambient-glow"
        style={{
          position: 'absolute',
          right: '10rem',
          top: '5rem',
          width: '34rem',
          height: '34rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(246, 183, 25, 0.2)',
          filter: 'blur(48px)',
        }}
      ></div>

      <div className="ref-container hero-content-wrap">
        <div className="hero-copy-box">
          <div className="hero-enter hero-delay-1 hero-tag-row">
            <span className="hero-tag-line"></span>
            <p className="hero-tag-text">Engineering the future of mobility</p>
          </div>

          <h1
            className="slogan hero-enter hero-delay-2"
            id="heroSlogan"
            onMouseLeave={() => setActiveScene('build')}
          >
            <button
              type="button"
              className={`slogan-word ${activeScene === 'design' ? 'is-active' : ''}`}
              data-scene="design"
              aria-label="Show Design background"
              aria-pressed={activeScene === 'design'}
              onMouseEnter={() => setActiveScene('design')}
              onFocus={() => setActiveScene('design')}
              onClick={() => setActiveScene('design')}
            >
              Design<span className="text-signal">.</span>
            </button>
            <button
              type="button"
              className={`slogan-word ${activeScene === 'build' ? 'is-active' : ''}`}
              data-scene="build"
              aria-label="Show Build background"
              aria-pressed={activeScene === 'build'}
              onMouseEnter={() => setActiveScene('build')}
              onFocus={() => setActiveScene('build')}
              onClick={() => setActiveScene('build')}
            >
              Build<span className="text-signal">.</span>
            </button>
            <button
              type="button"
              className={`slogan-word ${activeScene === 'compete' ? 'is-active' : ''}`}
              data-scene="compete"
              aria-label="Show Compete background"
              aria-pressed={activeScene === 'compete'}
              onMouseEnter={() => setActiveScene('compete')}
              onFocus={() => setActiveScene('compete')}
              onClick={() => setActiveScene('compete')}
            >
              Compete<span className="text-signal">.</span>
            </button>
          </h1>

          <p className="hero-enter hero-delay-3 hero-subtext">
            From the first line on screen to the final lap on track, we are a student-led
            community turning engineering ideas into machines that perform.
          </p>

          <div className="hero-enter hero-delay-4 hero-cta-row">
            <a
              href="#join"
              className="ref-btn ref-btn-primary effect-shine"
              data-page="join"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('join');
              }}
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
            </a>
            <a
              href="#about"
              className="ref-btn ref-btn-light effect-shine"
              data-page="about"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('about');
              }}
            >
              Explore our club
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
