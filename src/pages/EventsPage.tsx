import React, { useState, useEffect } from 'react';

interface EventItem {
  id: string;
  index: string;
  glyph: string;
  category: 'flagship' | 'workshop' | 'shakedown' | 'aero';
  categoryLabel: string;
  dateBadge: string;
  fullDate: string;
  title: string;
  subtitle: string;
  status: 'open' | 'upcoming' | 'finale';
  statusText: string;
  image: string;
  venue: string;
  timing: string;
  shortDesc: string;
  longDesc: string;
  specs: {
    label: string;
    value: string;
  }[];
}

const ALL_EVENTS: EventItem[] = [
  {
    id: 'cad-clinic',
    index: '01 / 07',
    glyph: '⌁',
    category: 'workshop',
    categoryLabel: 'Workshops & Clinics',
    dateBadge: 'OCT 28',
    fullDate: 'October 28, 2026',
    title: 'SolidWorks CAD & FEA Clinic',
    subtitle: 'Parametric Chassis & Aerodynamic Modeling',
    status: 'open',
    statusText: 'Registration Open',
    image: '/glimpses/workshop.webp',
    venue: 'Mechanical CAD Lab, BIT Sindri',
    timing: '14:00 — 18:00 IST',
    shortDesc:
      'Hands-on SolidWorks parametric modeling, roll-cage triangulation rulebook compliance, and ANSYS FEA structural stress simulations.',
    longDesc:
      'Led by senior chassis captains, this hands-on CAD masterclass walks participants through 3D wireframe generation, weldment structural members, rulebook safety margins, and finite element impact analysis for collegiate BAJA and SUPRA competitions.',
    specs: [
      { label: 'Tooling', value: 'SolidWorks 2024 & ANSYS Workbench' },
      { label: 'Eligibility', value: 'Open to all Engineering Batches' },
      { label: 'Bay', value: 'Mechanical CAD Lab' },
      { label: 'Prerequisite', value: 'Basic Engineering Drawing' },
    ],
  },
  {
    id: 'laws-of-motion',
    index: '02 / 07',
    glyph: '✦',
    category: 'flagship',
    categoryLabel: 'Flagship Meet',
    dateBadge: 'NOV 18',
    fullDate: 'November 18, 2026',
    title: 'Laws of Motion 2026',
    subtitle: 'The Chapter’s Premier Annual Tech Assembly',
    status: 'open',
    statusText: 'Registration Open · Limited Slots',
    image: '/events/lom 2026.webp',
    venue: 'Main Arena & Mechanical Bay #2, BIT Sindri',
    timing: '09:30 — 21:00 IST',
    shortDesc:
      'The premier annual multi-disciplinary congregation. High-speed RC dogfights, CAD model speed-runs, and live dynamic shakedowns under floodlights.',
    longDesc:
      'Laws of Motion (LOM) is SAE BIT Sindri’s premier annual assembly. Uniting student engineers across Eastern India, LOM features dynamic vehicle sprints, autonomous drone obstacle flights, balsa-wood glider challenges, and technical engineering evaluations.',
    specs: [
      { label: 'Disciplines', value: 'Buggy Shakedown · FPV Drone · RC Glider' },
      { label: 'Venue', value: 'East Ground & Mechanical Bay #2' },
      { label: 'Team Size', value: '1 to 5 Members per Track' },
      { label: 'Awards', value: 'Cash Pool + National SAE India Certification' },
    ],
  },
  {
    id: 'baja-shakedown',
    index: '03 / 07',
    glyph: '▰',
    category: 'shakedown',
    categoryLabel: 'Dynamic Shakedowns',
    dateBadge: 'DEC 12',
    fullDate: 'December 12, 2026',
    title: 'BAJA National Endurance Shakedown',
    subtitle: 'All-Terrain Dynamic Track Testing',
    status: 'upcoming',
    statusText: 'Upcoming Track Day',
    image: '/events/baja sae india 2015.webp',
    venue: 'Off-Road Test Circuit, BIT Sindri',
    timing: '08:00 — 16:30 IST',
    shortDesc:
      'A grueling 4-hour simulated endurance run over mud trenches, rock crawls, and suspension articulators to stress-test CVT tuning and roll-cage welds.',
    longDesc:
      'Before our all-terrain buggy travels to national competition tracks, the vehicle undergoes continuous endurance testing. Pilots evaluate damper rebound, steering scrub radius, CVT belt temperature, and hydraulic brake balance over harsh obstacle tracks.',
    specs: [
      { label: 'Vehicle', value: 'Single-Seater All-Terrain Buggy' },
      { label: 'Focus', value: 'Suspension Travel & CVT Drivetrain' },
      { label: 'Format', value: 'Maneuverability + 4-Hour Endurance' },
      { label: 'Location', value: 'Dirt Proving Track' },
    ],
  },
  {
    id: 'engine-teardown',
    index: '04 / 07',
    glyph: '◒',
    category: 'workshop',
    categoryLabel: 'Workshops & Clinics',
    dateBadge: 'JAN 16',
    fullDate: 'January 16, 2027',
    title: 'Powertrain & Engine Teardown',
    subtitle: 'IC Block Dismantle & EV Motor Diagnostics',
    status: 'upcoming',
    statusText: 'Upcoming Workshop',
    image: '/glimpses/workshop2.webp',
    venue: 'Automotive Bay #1, BIT Sindri',
    timing: '10:00 — 17:00 IST',
    shortDesc:
      'Hands-on session dismantling competition IC engines down to the crankcase, valve trains, and transmission gearing.',
    longDesc:
      'Get your hands covered in grease. We deconstruct single-cylinder race engines, calibrate valve lash, inspect cam profiles, analyze air-fuel induction, and compare performance with 48V PMSM electric motor drivetrains.',
    specs: [
      { label: 'Hardware', value: '10HP IC Motor + 48V PMSM EV Drive' },
      { label: 'Topics', value: 'Valvetrain, Cam Timing, BMS Controllers' },
      { label: 'Safety', value: 'Full Safety Gear Provided' },
      { label: 'Format', value: 'Benchtop Teardown & Live Rebuild' },
    ],
  },
  {
    id: 'skytrace-sprint',
    index: '05 / 07',
    glyph: '✦',
    category: 'aero',
    categoryLabel: 'Aeromodelling & Drone',
    dateBadge: 'FEB 06',
    fullDate: 'February 06, 2027',
    title: 'Skytrace FPV Aerothon & Drone Sprint',
    subtitle: 'Low-Latency Obstacle Racing',
    status: 'upcoming',
    statusText: 'Upcoming Meet',
    image: '/events/National aeromodelling competetion 2023.webp',
    venue: 'East Ground Air Corridor, BIT Sindri',
    timing: '15:00 — 19:30 IST',
    shortDesc:
      'High-speed obstacle racing through illuminated air gates and technical slaloms with 5.8GHz low-latency video telemetry.',
    longDesc:
      'Student drone pilots strap on 5.8GHz FPV headsets to navigate high-speed gates and technical slaloms with sub-millisecond reaction times. Open to carbon quadcopters, micro-whoops, and custom-tuned frames.',
    specs: [
      { label: 'Airframe', value: '3" to 5" Carbon Prop Quads' },
      { label: 'Video Feed', value: '5.8 GHz Low-Latency Telemetry' },
      { label: 'Format', value: 'Double Elimination Speed Bracket' },
      { label: 'Flight Line', value: 'East Ground Corridor' },
    ],
  },
  {
    id: 'paper-aero',
    index: '06 / 07',
    glyph: '+',
    category: 'aero',
    categoryLabel: 'Aeromodelling & Drone',
    dateBadge: 'MAR 14',
    fullDate: 'March 14, 2027',
    title: 'Paper Aero & Sub-Scale Glider Derby',
    subtitle: 'Fundamental Airfoil Physics & Open Glide',
    status: 'upcoming',
    statusText: 'Upcoming Meet',
    image: '/events/aerothon 2023.webp',
    venue: 'Main Campus Quad & Airstrip',
    timing: '11:00 — 16:00 IST',
    shortDesc:
      'Balsa-wood airframes, clean thermals, and exploring lift-to-drag ratios, dihedral angles, and airfoil camber.',
    longDesc:
      'Before constructing radio-controlled giants, we return to the fundamental physics of flight. Students fabricate lightweight balsa-wood gliders to test dihedral stability, center-of-gravity balance, and unpowered glide distance.',
    specs: [
      { label: 'Materials', value: 'Balsa Wood, Carbon Spars, Depron' },
      { label: 'Focus', value: 'Lift-to-Drag Ratio & Dihedral Stability' },
      { label: 'Metric', value: 'Max Time Aloft & Glide Distance' },
      { label: 'Eligibility', value: 'Open to All Batches' },
    ],
  },
  {
    id: 'supra-sprint',
    index: '07 / 07',
    glyph: '↗',
    category: 'shakedown',
    categoryLabel: 'Dynamic Shakedowns',
    dateBadge: 'APR 18',
    fullDate: 'April 18, 2027',
    title: 'SUPRA Formula Student Track Day',
    subtitle: 'Formula Student Circuit Shakedown',
    status: 'finale',
    statusText: 'Season Finale Track Day',
    image: '/events/supra sae india 2019.webp',
    venue: 'Proving Runway & Circuit, BIT Sindri',
    timing: '09:00 — 18:00 IST',
    shortDesc:
      'Our closing tarmac shakedown: downforce aero packages, steering scrub radius dialed in, and high-speed telemetry runs before national championships.',
    longDesc:
      'The pinnacle of the collegiate motorsport season. The Formula Student racecar takes to the tarmac for skidpad lateral-G evaluation, 75-meter acceleration launches, and full-circuit autocross timing with live telemetry feeds.',
    specs: [
      { label: 'Class', value: 'Formula Student Single-Seater' },
      { label: 'Track Focus', value: 'Skidpad Lateral G & Autocross Timing' },
      { label: 'Telemetry', value: 'Hall-Effect Wheel Speeds & CAN Bus' },
      { label: 'Target Track', value: 'Buddh International Circuit (BIC)' },
    ],
  },
];

type CategoryFilter = 'all' | 'flagship' | 'workshop' | 'shakedown' | 'aero';
type ViewMode = 'grid' | 'timeline';

export const EventsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [modalEvent, setModalEvent] = useState<EventItem | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<{ message: string; isError: boolean } | null>(null);

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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
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

  const featuredEvent = ALL_EVENTS.find((e) => e.id === 'laws-of-motion') || ALL_EVENTS[1];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      setSubscribeStatus({
        message: 'Please provide a valid email to receive registration calls.',
        isError: true,
      });
      return;
    }
    setSubscribeStatus({
      message: 'You are on the paddock alert list. Watch your inbox for upcoming registrations!',
      isError: false,
    });
    setEmailInput('');
  };

  return (
    <div className="events-hub-page" id="page-events">
      {/* =====================================================================
          1. LIVE TELEMETRY TICKER STRIP (NEXT EVENT ALERT)
          ===================================================================== */}
      <section className="events-ticker-wrapper" aria-label="Next Upcoming Event Ticker">
        <div className="events-hub-container events-ticker-inner">
          <div className="events-ticker-badge">
            <span className="live-beacon-dot" aria-hidden="true" />
            Next Chapter Event
          </div>
          <div className="events-ticker-text">
            <strong>Laws of Motion 2026</strong>
            <span>·</span>
            <span className="ticker-date">Nov 18, 2026</span>
            <span>·</span>
            <span>Mechanical Bay #2, BIT Sindri</span>
          </div>
          <button
            className="events-ticker-action"
            type="button"
            onClick={() => setModalEvent(featuredEvent)}
          >
            Register / Field Notes <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      {/* =====================================================================
          2. PURPOSEFUL EVENT PAGE HEADER
          ===================================================================== */}
      <header className="events-page-header">
        <div className="events-hub-container">
          <div className="events-header-eyebrow">
            <span className="eyebrow-line" aria-hidden="true" />
            Chapter Calendar &amp; Paddock · 2026–2027 Season
          </div>
          <h1>
            Events &amp;<br />
            <em>Competitions.</em>
          </h1>
          <p>
            Explore upcoming chapter meets, hands-on fabrication workshops, and national dynamic
            track shakedowns hosted by SAE BIT Sindri.
          </p>
        </div>
      </header>

      {/* =====================================================================
          3. FEATURED UPCOMING EVENT SPOTLIGHT CARD
          ===================================================================== */}
      <section className="featured-spotlight-section" aria-label="Featured Upcoming Event">
        <div className="events-hub-container">
          <div className="spotlight-section-title">
            <span className="spotlight-tag">// Premier Upcoming Meet</span>
            <span className="featured-date-chip">Next on the Calendar</span>
          </div>

          <article className="featured-event-card">
            {/* Visual Photo Layer */}
            <div
              className="featured-card-visual"
              style={{ backgroundImage: `url('${featuredEvent.image}')` }}
            >
              <div className="featured-card-visual-overlay" />
              <div className="featured-visual-top">
                <span className="featured-flagship-pill">FLAGSHIP EVENT</span>
                <span className="featured-coordinate">23°39′N 86°28′E</span>
              </div>
              <div className="featured-visual-bottom">
                <span className="featured-visual-stamp">
                  Season <strong>2026—27</strong>
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
                    <dt>Window</dt>
                    <dd>{featuredEvent.timing}</dd>
                  </div>
                  <div className="featured-meta-item">
                    <dt>Class</dt>
                    <dd>Buggy · FPV · RC Aero</dd>
                  </div>
                </dl>

                <div className="featured-actions">
                  <button
                    className="ev-btn ev-btn-gold"
                    type="button"
                    onClick={() => setModalEvent(featuredEvent)}
                  >
                    Register Your Seat <span aria-hidden="true">→</span>
                  </button>
                  <button
                    className="ev-btn ev-btn-outline"
                    type="button"
                    onClick={() => setModalEvent(featuredEvent)}
                  >
                    View Field Notes &amp; Rules <span aria-hidden="true">↗</span>
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
          <div className="events-controls-bar">
            {/* Discipline Filter Tabs */}
            <div className="events-filter-group" role="group" aria-label="Filter events by discipline">
              <button
                className={`events-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveFilter('all')}
                aria-pressed={activeFilter === 'all'}
              >
                All Meets <span>0{countFor('all')}</span>
              </button>
              <button
                className={`events-filter-btn ${activeFilter === 'flagship' ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveFilter('flagship')}
                aria-pressed={activeFilter === 'flagship'}
              >
                Flagship Meets <span>0{countFor('flagship')}</span>
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
                className={`events-filter-btn ${activeFilter === 'shakedown' ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveFilter('shakedown')}
                aria-pressed={activeFilter === 'shakedown'}
              >
                Dynamic Shakedowns <span>0{countFor('shakedown')}</span>
              </button>
              <button
                className={`events-filter-btn ${activeFilter === 'aero' ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveFilter('aero')}
                aria-pressed={activeFilter === 'aero'}
              >
                Aero &amp; Drone <span>0{countFor('aero')}</span>
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
            {filteredEvents.map((item) => (
              <article key={item.id} className="event-roster-card">
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
                        item.status === 'open'
                          ? 'status-open'
                          : item.status === 'finale'
                          ? 'status-finale'
                          : 'status-upcoming'
                      }`}
                    >
                      {item.statusText}
                    </span>
                  </div>
                  <div className="roster-date-badge">
                    <strong>{item.dateBadge}</strong> · 2026–27
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
                    <button
                      className="roster-register-btn"
                      type="button"
                      onClick={() => setModalEvent(item)}
                    >
                      {item.status === 'open' ? 'Register →' : 'Details →'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Timeline / Chronological Season Roadmap View */
          <div className="events-timeline-layout" aria-live="polite">
            {filteredEvents.map((item) => (
              <div key={`timeline-${item.id}`} className="timeline-milestone-item">
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
                      className="ev-btn ev-btn-gold"
                      type="button"
                      onClick={() => setModalEvent(item)}
                    >
                      {item.status === 'open' ? 'Register Seat →' : 'View Notes →'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =====================================================================
            6. NOTIFICATION RUNWAY CALLOUT
            ===================================================================== */}
        <section className="events-notify-card" aria-label="Paddock Notifications">
          <div className="events-notify-copy">
            <h2>
              Stay close to<br />
              <em>the runway.</em>
            </h2>
            <p>
              Get seasonal drop notifications, workshop seat openings, and paddock calls straight
              from our engineering bays.
            </p>
          </div>

          <form onSubmit={handleSubscribe} noValidate>
            <div className="notify-form-row">
              <input
                type="email"
                placeholder="engineer@bitsindri.ac.in"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                aria-label="Email Address for Event Notifications"
              />
              <button className="ev-btn ev-btn-gold" type="submit">
                Notify Me <span aria-hidden="true">↗</span>
              </button>
            </div>
            {subscribeStatus && (
              <div
                className={`notify-form-status ${subscribeStatus.isError ? 'error' : ''}`}
                role="status"
              >
                {subscribeStatus.message}
              </div>
            )}
          </form>
        </section>
      </main>

      {/* =====================================================================
          7. INTERACTIVE FIELD NOTES MODAL DIALOG
          ===================================================================== */}
      {modalEvent && (
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

              <div className="modal-category-label">
                {modalEvent.categoryLabel} · {modalEvent.index}
              </div>

              <h2 id="dialog-event-title">{modalEvent.title}</h2>
              <div className="modal-meta-line">
                {modalEvent.fullDate} · {modalEvent.venue} · {modalEvent.timing}
              </div>

              <div className="modal-rule-line" />

              <p className="modal-body-desc">{modalEvent.longDesc}</p>

              {/* Technical Specifications Table */}
              <dl className="modal-specs-table">
                {modalEvent.specs.map((spec, idx) => (
                  <div key={`spec-${idx}`}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="modal-actions-strip">
                <button
                  className="ev-btn ev-btn-gold"
                  type="button"
                  onClick={() => {
                    alert(`Seat Registration for ${modalEvent.title} recorded! Our coordinators will reach out.`);
                    setModalEvent(null);
                  }}
                >
                  Confirm Seat Registration <span aria-hidden="true">→</span>
                </button>
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
        </div>
      )}
    </div>
  );
};

export default EventsPage;
