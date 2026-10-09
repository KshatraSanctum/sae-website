import React from 'react';

interface EventsTeaserProps {
  onNavigate: (page: string) => void;
}

export const EventsTeaser: React.FC<EventsTeaserProps> = ({ onNavigate }) => {
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
            <a
              href="#events"
              className="ref-event-action-btn"
              data-page="events"
              aria-label="View EV Powertrain Fundamentals"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('events');
              }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          </article>

          <article data-reveal className="reveal-side ref-event-item">
            <div className="ref-event-date-col">
              <span className="ref-event-date-num">02</span>
              <span className="ref-event-date-month">SEP</span>
            </div>
            <div>
              <p className="ref-event-type">Tech Talk</p>
              <h3 className="ref-event-title">From Campus to Motorsport</h3>
              <p className="ref-event-meta">3:30 PM · Main Auditorium</p>
            </div>
            <a
              href="#events"
              className="ref-event-action-btn"
              data-page="events"
              aria-label="View From Campus to Motorsport"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('events');
              }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          </article>

          <article data-reveal className="reveal-side ref-event-item">
            <div className="ref-event-date-col">
              <span className="ref-event-date-num">14</span>
              <span className="ref-event-date-month">SEP</span>
            </div>
            <div>
              <p className="ref-event-type">Build Day</p>
              <h3 className="ref-event-title">Formula Student Open Garage</h3>
              <p className="ref-event-meta">9:00 AM · SAE Workshop</p>
            </div>
            <a
              href="#events"
              className="ref-event-action-btn"
              data-page="events"
              aria-label="View Formula Student Open Garage"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('events');
              }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          </article>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <a
            href="#events"
            className="ref-btn ref-btn-outline effect-shine"
            data-page="events"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('events');
            }}
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
          </a>
        </div>
      </div>
    </section>
  );
};
