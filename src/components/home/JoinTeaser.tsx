import React from 'react';

interface JoinTeaserProps {
  onNavigate: (page: string) => void;
}

export const JoinTeaser: React.FC<JoinTeaserProps> = ({ onNavigate }) => {
  return (
    <section id="home-join-cta" className="ref-join-cta-section">
      <div className="tech-grid" style={{ position: 'absolute', inset: 0, opacity: 0.1 }}></div>
      <div data-reveal className="reveal-up ref-container ref-join-cta-inner">
        <div>
          <p className="ref-join-cta-tag">Ready to get started?</p>
          <h2 className="ref-join-cta-heading">Build something that moves you.</h2>
        </div>
        <a
          href="#join"
          className="ref-join-cta-btn"
          data-page="join"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('join');
          }}
        >
          Join Velocity SAE
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </a>
      </div>
    </section>
  );
};
