import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ALL_EVENTS, type EventItem } from '../data/events';

const InstagramIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

type CategoryFilter = 'all' | 'flagship' | 'competition' | 'workshop' | 'community';
type ViewMode = 'grid' | 'timeline';

export const EventsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [modalEvent, setModalEvent] = useState<EventItem | null>(null);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalEvent) {
        setModalEvent(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalEvent]);

  // Prevent scroll while modal is active
  useEffect(() => {
    if (modalEvent) {
      document.documentElement.classList.add('modal-open');
      document.body.classList.add('modal-open');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [modalEvent]);

  const filteredEvents = ALL_EVENTS.filter((ev) => {
    if (activeFilter === 'all') return true;
    return ev.category === activeFilter;
  });

  const countFor = (cat: CategoryFilter) => {
    if (cat === 'all') return ALL_EVENTS.length;
    return ALL_EVENTS.filter((e) => e.category === cat).length;
  };

  const featuredEvent = ALL_EVENTS[0]; // TECH FEST (TVARAN)

  return (
    <div className="events-hub-page" id="page-events">
      {/* =====================================================================
          1. ARCHIVE TELEMETRY STRIP (FLAGSHIP FEST RECAP)
          ===================================================================== */}
      <section className="events-ticker-wrapper" aria-label="Flagship Event Ticker">
        <div data-reveal className="events-hub-container events-ticker-inner reveal-up">
          <div className="events-ticker-badge">
            <span className="live-beacon-dot" aria-hidden="true" />
            Flagship Festival Recap
          </div>
          <div className="events-ticker-text">
            <strong>{featuredEvent.title}</strong>
            <span>·</span>
            <span className="ticker-date">{featuredEvent.fullDate}</span>
            <span>·</span>
            <span>{featuredEvent.venue}</span>
          </div>
          <button
            className="events-ticker-action"
            type="button"
            onClick={() => setModalEvent(featuredEvent)}
          >
            Explore Fest Archive <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      {/* =====================================================================
          2. PURPOSEFUL EVENT PAGE HEADER (ARCHIVE & RECAP)
          ===================================================================== */}
      <header data-reveal className="events-page-header reveal-up">
        <div className="events-hub-container">
          <div className="events-header-eyebrow">
            <span className="eyebrow-line" aria-hidden="true" />
            Chapter History &amp; Event Archive · Hosted by SAE BIT Sindri
          </div>
          <h1>
            Events &amp;<br />
            <em>Showcases.</em>
          </h1>
          <p>
            An archival chronicle of technical fests, student design competitions, school STEM outreach workshops,
            and traditions successfully organized by SAE INDIA BIT Sindri.
          </p>
        </div>
      </header>

      {/* =====================================================================
          3. FEATURED EVENT SPOTLIGHT CARD: TECH FEST (TVARAN)
          ===================================================================== */}
      <section className="featured-spotlight-section" aria-label="Flagship Technical Fest Spotlight">
        <div className="events-hub-container">
          <div className="spotlight-section-title">
            <span className="spotlight-tag">// Annual Flagship Festival</span>
            <span className="featured-date-chip">Conducted Successfully</span>
          </div>

          <article data-reveal className="featured-event-card reveal-up">
            {/* Visual Photo Layer */}
            <div
              className="featured-card-visual"
              style={{ backgroundImage: `url('${featuredEvent.image}')` }}
            >
              <div className="featured-card-visual-overlay" />
              <div className="featured-visual-top">
                <span className="featured-flagship-pill">FLAGSHIP EVENT</span>
                <span className="featured-coordinate">BIT SINDRI</span>
              </div>
              <div className="featured-visual-bottom">
                <span className="featured-visual-stamp">
                  Season <strong>2026</strong>
                </span>
              </div>
            </div>

            {/* Content & Action Area */}
            <div className="featured-card-content">
              <div>
                <div className="featured-status-row">
                  <span className="featured-status-pill">
                    <span className="live-beacon-dot" aria-hidden="true" />
                    {featuredEvent.statusText}
                  </span>
                  <span className="featured-date-chip">{featuredEvent.fullDate}</span>
                </div>

                <h2>{featuredEvent.title}</h2>
                <div className="featured-card-subtitle">{featuredEvent.subtitle}</div>
                <p className="featured-card-desc">{featuredEvent.shortDesc}</p>
              </div>

              <div>
                {/* 3-Column Metadata Grid */}
                <dl className="featured-meta-grid">
                  <div className="featured-meta-item">
                    <dt>Venue</dt>
                    <dd>{featuredEvent.venue}</dd>
                  </div>
                  <div className="featured-meta-item">
                    <dt>Dates Held</dt>
                    <dd>09–10 May 2026</dd>
                  </div>
                  <div className="featured-meta-item">
                    <dt>Tracks</dt>
                    <dd>Quests · Bots · Bike · EV</dd>
                  </div>
                </dl>

                <div className="featured-actions">
                  <a
                    href={featuredEvent.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ev-btn ev-btn-insta"
                  >
                    <InstagramIcon size={16} /> Watch Reel on Instagram <span aria-hidden="true">↗</span>
                  </a>
                  <button
                    className="ev-btn ev-btn-outline"
                    type="button"
                    onClick={() => setModalEvent(featuredEvent)}
                  >
                    View Fest Details &amp; Notes <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* =====================================================================
          4. CONTROLS: FILTER BUTTONS & VIEW MODE TOGGLE
          ===================================================================== */}
      <section className="events-controls-section" aria-label="Event Filter and View Controls">
        <div className="events-hub-container">
          <div data-reveal className="events-controls-bar reveal-up">
            {/* Discipline Filter Tabs */}
            <div className="events-filter-group" role="group" aria-label="Filter events by category">
              <button
                className={`events-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveFilter('all')}
                aria-pressed={activeFilter === 'all'}
              >
                All Events <span>0{countFor('all')}</span>
              </button>
              <button
                className={`events-filter-btn ${activeFilter === 'flagship' ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveFilter('flagship')}
                aria-pressed={activeFilter === 'flagship'}
              >
                Flagship Fest <span>0{countFor('flagship')}</span>
              </button>
              <button
                className={`events-filter-btn ${activeFilter === 'competition' ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveFilter('competition')}
                aria-pressed={activeFilter === 'competition'}
              >
                Competitions <span>0{countFor('competition')}</span>
              </button>
              <button
                className={`events-filter-btn ${activeFilter === 'workshop' ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveFilter('workshop')}
                aria-pressed={activeFilter === 'workshop'}
              >
                Workshops <span>0{countFor('workshop')}</span>
              </button>
              <button
                className={`events-filter-btn ${activeFilter === 'community' ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveFilter('community')}
                aria-pressed={activeFilter === 'community'}
              >
                Chapter &amp; Tradition <span>0{countFor('community')}</span>
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="events-view-switcher" role="group" aria-label="Toggle View Mode">
              <button
                className={`view-switch-btn ${viewMode === 'grid' ? 'active' : ''}`}
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
              >
                <span aria-hidden="true">⊞</span> Grid View
              </button>
              <button
                className={`view-switch-btn ${viewMode === 'timeline' ? 'active' : ''}`}
                type="button"
                onClick={() => setViewMode('timeline')}
                aria-pressed={viewMode === 'timeline'}
              >
                <span aria-hidden="true">☰</span> Timeline View
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. EVENT ROSTER: GRID VIEW & TIMELINE VIEW
          ===================================================================== */}
      <main className="events-hub-container">
        {viewMode === 'grid' ? (
          /* Grid View of Event Cards */
          <div className="events-grid-layout" aria-live="polite">
            {filteredEvents.map((item, index) => (
              <article
                key={item.id}
                data-reveal
                className="event-roster-card reveal-up"
                style={{ transitionDelay: `${Math.min(index, 5) * 70}ms` }}
              >
                {/* Photo Header */}
                <div
                  className="roster-card-image"
                  style={{ backgroundImage: `url('${item.image}')` }}
                >
                  <div className="roster-card-overlay" />
                  <div className="roster-card-badges">
                    <span className="roster-category-chip">{item.categoryLabel}</span>
                    <span
                      className={`roster-status-chip ${
                        item.status === 'annual' ? 'status-annual' : 'status-conducted'
                      }`}
                    >
                      {item.statusText}
                    </span>
                  </div>
                  <div className="roster-date-badge">
                    <strong>{item.dateBadge}</strong> · 2026
                  </div>
                </div>

                {/* Card Body */}
                <div className="roster-card-body">
                  <h3>{item.title}</h3>
                  <div className="roster-card-venue">
                    <span aria-hidden="true">📍</span> {item.venue}
                  </div>
                  <p className="roster-card-desc">{item.shortDesc}</p>

                  <div className="roster-card-footer">
                    <button
                      className="roster-notes-link"
                      type="button"
                      onClick={() => setModalEvent(item)}
                    >
                      Field Notes <span aria-hidden="true">↗</span>
                    </button>
                    <a
                      href={item.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="roster-insta-link"
                    >
                      <InstagramIcon size={12} /> Instagram <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Timeline / Chronological Season Roadmap View */
          <div className="events-timeline-layout" aria-live="polite">
            {filteredEvents.map((item, index) => (
              <div
                key={`timeline-${item.id}`}
                data-reveal
                className="timeline-milestone-item reveal-up"
                style={{ transitionDelay: `${Math.min(index, 5) * 70}ms` }}
              >
                <div className="timeline-milestone-dot" aria-hidden="true" />
                <div className="timeline-milestone-card">
                  <div className="timeline-card-info">
                    <div className="timeline-card-meta">
                      <span>{item.fullDate}</span>
                      <span>·</span>
                      <span className="venue-text">📍 {item.venue}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p className="timeline-card-desc">{item.shortDesc}</p>
                  </div>

                  <div className="timeline-card-actions">
                    <button
                      className="ev-btn ev-btn-outline"
                      type="button"
                      onClick={() => setModalEvent(item)}
                    >
                      View Notes →
                    </button>
                    <a
                      href={item.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ev-btn ev-btn-insta"
                    >
                      <InstagramIcon size={14} /> Instagram ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =====================================================================
            6. CHAPTER NEXT MILESTONE CTA (MATCHING HOME & ACHIEVEMENTS)
            ===================================================================== */}
        <section data-reveal className="events-bottom-cta reveal-up" aria-label="Join SAE BIT Sindri">
          <div className="events-cta-inner">
            <div className="events-cta-copy">
              <p className="events-cta-eyebrow">// PASSION FUELS THE DRIVE · PRECISION WINS THE RACE</p>
              <h2 className="events-cta-heading">
                <span className="cta-heading-line">GREAT MACHINES AREN'T BORN.</span>
                <span className="cta-heading-line">THEY'RE ENGINEERED HERE.</span>
              </h2>
            </div>

            <div className="events-cta-actions">
              <Link
                to="/join"
                className="events-cta-btn events-cta-btn-primary effect-shine"
              >
                Join SAE BIT SINDRI
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>
              <Link
                to="/team"
                className="events-cta-btn events-cta-btn-outline"
              >
                Meet the Team Behind It
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          7. INTERACTIVE FIELD NOTES & EVENT MODAL DIALOG
          ===================================================================== */}
      {modalEvent &&
        createPortal(
          <div
            className="events-modal-backdrop"
            onClick={() => setModalEvent(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-event-title"
          >
            <div
              className="events-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="events-modal-inner">
                <button
                  className="events-modal-close"
                  type="button"
                  aria-label="Close event details modal"
                  onClick={() => setModalEvent(null)}
                >
                  ×
                </button>

                {/* Event Image Banner */}
                <div
                  className="modal-header-image"
                  style={{ backgroundImage: `url('${modalEvent.image}')` }}
                  role="img"
                  aria-label={modalEvent.title}
                />

                <div className="modal-category-label">
                  {modalEvent.categoryLabel} · {modalEvent.index}
                </div>

                <h2 id="dialog-event-title">{modalEvent.title}</h2>
                <div className="modal-meta-line">
                  {modalEvent.fullDate} · {modalEvent.venue}
                </div>

                <div className="modal-rule-line" />

                <p className="modal-body-desc">{modalEvent.longDesc}</p>

                {/* Specifications & Overview Table */}
                <dl className="modal-specs-table">
                  {modalEvent.specs.map((spec, idx) => (
                    <div key={`spec-${idx}`}>
                      <dt>{spec.label}</dt>
                      <dd>{spec.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="modal-actions-strip">
                  <a
                    href={modalEvent.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ev-btn ev-btn-insta"
                  >
                    <InstagramIcon size={16} /> Open Post / Reel on Instagram <span aria-hidden="true">↗</span>
                  </a>
                  <button
                    className="ev-btn ev-btn-outline"
                    type="button"
                    onClick={() => setModalEvent(null)}
                  >
                    Close Notes
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default EventsPage;
