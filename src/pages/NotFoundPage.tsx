import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <section className="page active" id="page-notfound" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="ref-container" style={{ maxWidth: '42rem' }}>
        <div data-reveal className="reveal-up">
          <span className="badge mono" style={{ borderColor: 'rgba(246, 183, 25, 0.45)', color: 'var(--color-signal)', marginBottom: '1.5rem', display: 'inline-block' }}>
            STATUS 404 · OFF TRACK
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', lineHeight: '1.05', color: '#ffffff', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            Out of track <span className="text-signal">boundaries.</span>
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.05rem', lineHeight: '1.6', marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            The page or route you navigated to does not exist or has been relocated in our pit bay. Return to the main circuit to continue exploring SAE BIT Sindri.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/" className="ref-btn ref-btn-primary effect-shine">
              Return to Circuit
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link to="/achievements" className="ref-btn ref-btn-light effect-shine">
              View Achievements
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
