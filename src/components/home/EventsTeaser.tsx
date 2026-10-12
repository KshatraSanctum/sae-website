import React from 'react';
import { Link } from 'react-router-dom';

export const EventsTeaser: React.FC = () => {
  return (
    <section id="home-events" className="ref-events-section">
      <div className="ref-container">
        <div data-reveal className="reveal-up ref-events-head">
          <div>
            <p className="ref-eyebrow text-signal">Chapter Highlights</p>
            <h2 className="ref-events-heading">Hosted Events &amp; Meets</h2>
          </div>
          <svg
            className="ref-events-calendar-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </div>

        <div className="ref-events-list">
          <article data-reveal className="reveal-side ref-event-item">
            <div className="ref-event-date-col">
              <span className="ref-event-date-num">09</span>
              <span className="ref-event-date-month">MAY</span>
            </div>
            <div>
              <p className="ref-event-type">Flagship Tech Fest</p>
              <h3 className="ref-event-title">TECH FEST — TVARAN 2026</h3>
              <p className="ref-event-meta">Annual 2-Day Festival · BIT Sindri</p>
            </div>
            <Link
              to="/events"
              className="ref-event-arrow-btn"
              aria-label="View event details"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </article>

          <article data-reveal className="reveal-side reveal-delay ref-event-item">
            <div className="ref-event-date-col">
              <span className="ref-event-date-num">11</span>
              <span className="ref-event-date-month">SEP</span>
            </div>
            <div>
              <p className="ref-event-type">Chapter Induction</p>
              <h3 className="ref-event-title">Orientation — Batch of 2026</h3>
              <p className="ref-event-meta">Welcoming Freshman Engineers · Campus Auditorium</p>
            </div>
            <Link
              to="/events"
              className="ref-event-arrow-btn"
              aria-label="View event details"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </article>

          <article data-reveal className="reveal-side reveal-delay-2 ref-event-item">
            <div className="ref-event-date-col">
              <span className="ref-event-date-num">17</span>
              <span className="ref-event-date-month">SEP</span>
            </div>
            <div>
              <p className="ref-event-type">Chapter Tradition</p>
              <h3 className="ref-event-title">Vishwakarma Pooja Celebration</h3>
              <p className="ref-event-meta">Blessings for Tools &amp; Machines · Mechanical Bay</p>
            </div>
            <Link
              to="/events"
              className="ref-event-arrow-btn"
              aria-label="View event details"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </article>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            to="/events"
            className="ref-btn ref-btn-outline effect-shine"
          >
            Explore Full Events Archive
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
          </Link>
        </div>
      </div>
    </section>
  );
};
