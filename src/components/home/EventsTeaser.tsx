import React from 'react';
import { Link } from 'react-router-dom';

const FEATURED_EVENTS = [
  {
    day: '09',
    month: 'MAY',
    type: 'Flagship Tech Fest',
    title: 'TECH FEST — TVARAN 2026',
    meta: 'Annual 2-Day Festival · BIT Sindri',
    image: '/events/TECH_FEST.jpeg',
  },
  {
    day: '11',
    month: 'SEP',
    type: 'Chapter Induction',
    title: 'Orientation — Batch of 2026',
    meta: 'Welcoming Freshman Engineers · Campus Auditorium',
    image: '/events/ORIENTATION.jpeg',
  },
  {
    day: '17',
    month: 'SEP',
    type: 'Chapter Tradition',
    title: 'Vishwakarma Pooja Celebration',
    meta: 'Blessings for Tools & Machines · Mechanical Bay',
    image: '/events/Vishwakarma Pooja.jpeg',
  },
];

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
          {FEATURED_EVENTS.map((item, index) => {
            const delayClass = index === 1 ? 'reveal-delay' : index === 2 ? 'reveal-delay-2' : '';
            return (
              <article
                key={item.title}
                data-reveal
                className={`reveal-side ${delayClass} ref-event-item`}
              >
                {/* Event Image Half-Division Faded Backdrop */}
                <div className="ref-event-visual-backdrop" aria-hidden="true">
                  <div
                    className="ref-event-visual-img"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                  <div className="ref-event-visual-gradient" />
                </div>

                <div className="ref-event-date-col">
                  <span className="ref-event-date-num">{item.day}</span>
                  <span className="ref-event-date-month">{item.month}</span>
                </div>
                <div className="ref-event-info-col">
                  <p className="ref-event-type">{item.type}</p>
                  <h3 className="ref-event-title">{item.title}</h3>
                  <p className="ref-event-meta">{item.meta}</p>
                </div>
                <Link
                  to="/events"
                  className="ref-event-arrow-btn"
                  aria-label={`View event details for ${item.title}`}
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
            );
          })}
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
