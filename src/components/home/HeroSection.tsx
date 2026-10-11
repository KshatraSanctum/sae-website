import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
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
              onMouseEnter={() => setActiveScene('design')}
              onFocus={() => setActiveScene('design')}
            >
              Design.
            </button>
            <button
              type="button"
              className={`slogan-word ${activeScene === 'build' ? 'is-active' : ''}`}
              data-scene="build"
              onMouseEnter={() => setActiveScene('build')}
              onFocus={() => setActiveScene('build')}
            >
              Build.
            </button>
            <button
              type="button"
              className={`slogan-word ${activeScene === 'compete' ? 'is-active' : ''}`}
              data-scene="compete"
              onMouseEnter={() => setActiveScene('compete')}
              onFocus={() => setActiveScene('compete')}
            >
              Compete.
            </button>
          </h1>

          <p className="hero-enter hero-delay-3 hero-sub hero-subtext">
            The official collegiate mobility chapter of BIT Sindri. Designing and engineering national-tier
            championship racecars, aerodynamic drones, electric powertrains, and the engineering leaders of tomorrow.
          </p>

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
      </div>
    </section>
  );
};
