import React from 'react';
import { Link } from 'react-router-dom';

export const AboutTeaser: React.FC = () => {
  return (
    <section id="home-about" className="ref-about-section">
      <div className="ref-container" style={{ padding: 0, maxWidth: '80rem', margin: '0 auto' }}>
        <div className="ref-about-grid">
          <div data-reveal className="reveal-up ref-about-left">
            <p className="ref-eyebrow">Who we are</p>
            <h2 className="ref-about-heading">
              More than a society.
              <br />
              <span className="text-signal">A proving ground.</span>
            </h2>
            <p className="ref-about-copy">
              SAE brings ambitious students together to solve real engineering problems. From first sketch to
              final test run, every project is a chance to apply theory, challenge assumptions, and grow as a team.
            </p>
            <p className="ref-about-copy" style={{ marginTop: '1rem', opacity: 0.85 }}>
              As the official collegiate mobility chapter of BIT Sindri, our student engineers design national competition racecars, drones, fixed wing aircrafts, build electric powertrains, and conduct hands-on technical masterclasses.
            </p>
            <p className="ref-about-copy" style={{ marginTop: '1rem', opacity: 0.85 }}>
              Apart from that, we do organise various events in the college which includes - Technical Workshops, GD, Techfest(Tvaran).
            </p>
            <Link
              to="/about"
              className="ref-btn ref-btn-outline effect-shine"
              style={{ marginTop: '2rem' }}
            >
              Learn More About Us
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
          </div>

          <div data-reveal className="reveal-up reveal-delay ref-stats-grid">
            <div className="ref-stat-box">
              <strong className="ref-stat-value">70+</strong>
              <span className="ref-stat-label">Active members</span>
            </div>
            <div className="ref-stat-box">
              <strong className="ref-stat-value">08</strong>
              <span className="ref-stat-label">Technical teams</span>
            </div>
            <div className="ref-stat-box">
              <strong className="ref-stat-value">10</strong>
              <span className="ref-stat-label">Projects completed</span>
            </div>
            <div className="ref-stat-box">
              <strong className="ref-stat-value">15+</strong>
              <span className="ref-stat-label">Years of making</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
