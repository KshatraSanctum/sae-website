import React from 'react';

interface TeamTeaserProps {
  onNavigate: (page: string) => void;
}

export const TeamTeaser: React.FC<TeamTeaserProps> = ({ onNavigate }) => {
  return (
    <section id="home-team" className="ref-team-section">
      <div className="ref-container">
        <div className="ref-team-grid">
          <div data-reveal className="reveal-up image-frame group">
            <img
              src="https://images.unsplash.com/photo-1700770956485-87150c75ad65?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1800"
              alt="Club members working together in the garage"
            />
            <div className="image-frame-overlay"></div>
            <div className="image-frame-caption">
              <div>
                <p className="image-frame-tag">One team</p>
                <p className="image-frame-title">Many disciplines</p>
              </div>
              <svg
                className="image-frame-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" />
                <path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4" />
              </svg>
            </div>
          </div>

          <div data-reveal className="reveal-up reveal-delay">
            <p className="ref-eyebrow">Find your place</p>
            <h2 className="ref-team-heading">
              You don't need to know everything.
              <span className="text-signal" style={{ display: 'block' }}>
                Just start.
              </span>
            </h2>
            <p className="ref-team-copy">
              Whether you design, code, fabricate, manage, photograph, or simply want to learn, there is room for you
              here. Our senior members and faculty mentors help you build confidence one challenge at a time.
            </p>
            <div className="ref-skills-row">
              <span className="ref-skill-pill">Vehicle Dynamics</span>
              <span className="ref-skill-pill">Powertrain</span>
              <span className="ref-skill-pill">Electronics</span>
              <span className="ref-skill-pill">Design</span>
              <span className="ref-skill-pill">Business</span>
              <span className="ref-skill-pill">Media</span>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <a
                href="#team"
                className="ref-btn ref-btn-light effect-shine"
                data-page="team"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('team');
                }}
              >
                Meet Our Office Bearers &amp; Team
                <svg
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
