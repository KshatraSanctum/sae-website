import React from 'react';
import { Link } from 'react-router-dom';

export const EventsTeaser: React.FC = () => {
  return (
    <section id="home-events" className="ref-events-section">
      <div className="ref-container">
        <div data-reveal className="reveal-up ref-events-head">
          <div>
            <p className="ref-eyebrow text-signal">On the calendar</p>
            <h2 className="ref-events-heading">Upcoming events</h2>
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
              <span className="ref-event-date-num">18</span>
              <span className="ref-event-date-month">AUG</span>
            </div>
            <div>
              <p className="ref-event-type">Workshop</p>
              <h3 className="ref-event-title">EV Powertrain Fundamentals</h3>
              <p className="ref-event-meta">10:00 AM · Innovation Lab</p>
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
              <span className="ref-event-date-num">02</span>
              <span className="ref-event-date-month">SEP</span>
            </div>
            <div>
              <p className="ref-event-type">Orientation</p>
              <h3 className="ref-event-title">Fall Recruitment &amp; Team Welcome</h3>
              <p className="ref-event-meta">5:30 PM · Mechanical Hall B</p>
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
              <span className="ref-event-date-num">14</span>
              <span className="ref-event-date-month">OCT</span>
            </div>
            <div>
              <p className="ref-event-type">Guest Lecture</p>
              <h3 className="ref-event-title">Aerodynamics in Competition Design</h3>
              <p className="ref-event-meta">3:00 PM · Online via Teams</p>
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
            View All Chapter Events
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
