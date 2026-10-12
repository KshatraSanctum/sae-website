import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface EventItem {
  id: string;
  index: string;
  glyph: string;
  category: 'flagship' | 'competition' | 'workshop' | 'community';
  categoryLabel: string;
  dateBadge: string;
  fullDate: string;
  title: string;
  subtitle: string;
  status: 'conducted' | 'annual';
  statusText: string;
  image: string;
  venue: string;
  timing: string;
  shortDesc: string;
  longDesc: string;
  instagramUrl: string;
  specs: {
    label: string;
    value: string;
  }[];
}

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

const ALL_EVENTS: EventItem[] = [
  {
    id: 'tvaran-tech-fest',
    index: '01 / 08',
    glyph: '✦',
    category: 'flagship',
    categoryLabel: 'Annual Flagship Fest',
    dateBadge: 'MAY 09–10',
    fullDate: 'May 09 — May 10, 2026',
    title: 'TECH FEST — TVARAN',
    subtitle: 'Annual Technical Fest of SAE INDIA BIT Sindri',
    status: 'annual',
    statusText: 'Conducted · Annual Flagship',
    image: '/events/TECH_FEST.jpeg',
    venue: 'BIT Sindri Campus & Arenas',
    timing: '2-Day Annual Fest',
    shortDesc:
      'TVARAN is the annual technical fest of SAE INDIA BIT Sindri, celebrating innovation, creativity, and engineering excellence through exciting competitions, technical challenges, and collaborative events.',
    longDesc:
      'TVARAN is the premier annual technical festival organized by SAE INDIA BIT Sindri. Celebrating hands-on creativity and competitive spirit, the fest hosts robotics obstacle arenas, mechanical build-offs, mobility case study challenges, and technical campus quests. It stands as our chapter’s defining annual celebration of engineering passion and teamwork.',
    instagramUrl:
      'https://www.instagram.com/reel/DYCLwnfT5Kw/?utm_source=ig_web_copy_link&psln=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    specs: [
      { label: 'Event Type', value: 'Flagship Multi-Track Technical Fest' },
      { label: 'Dates Held', value: '09th May 2026 – 10th May 2026' },
      { label: 'Host Chapter', value: 'SAE INDIA Collegiate Society BIT Sindri' },
      { label: 'Highlights', value: 'Robotics, Bike Build, EV Hackathons & Quests' },
    ],
  },
  {
    id: 'auto-clue-quest',
    index: '02 / 08',
    glyph: '⌁',
    category: 'competition',
    categoryLabel: 'Campus Challenge',
    dateBadge: 'MAY 09',
    fullDate: 'May 09, 2026',
    title: 'AUTO-CLUE QUEST',
    subtitle: 'Logical Thinking, Puzzles & Clue Hunt',
    status: 'conducted',
    statusText: 'Conducted at TVARAN',
    image: '/events/AUTO-CLUE_QUEST.jpeg',
    venue: 'Campus Grounds & Quad, BIT Sindri',
    timing: 'Full-Day Campus Quest',
    shortDesc:
      'AUTO-CLUE QUEST is an exciting campus challenge that combines quizzes, puzzles, and clue-solving to test participants’ logical thinking, teamwork, and problem-solving skills.',
    longDesc:
      'A thrilling treasure and intelligence quest hosted as part of TVARAN 2026. Participant teams raced across campus solving cryptic engineering puzzles, automotive riddles, and physical checkpoints, pushing their speed, teamwork, and analytical deduction to the limit.',
    instagramUrl:
      'https://www.instagram.com/p/DX7VrB8kqDO/?utm_source=ig_web_copy_link&cplk=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    specs: [
      { label: 'Category', value: 'Logic, Puzzles & Scavenger Quest' },
      { label: 'Date Held', value: '09th May 2026' },
      { label: 'Festival', value: 'TVARAN 2026' },
      { label: 'Focus', value: 'Analytical Deduction & Team Problem-Solving' },
    ],
  },
  {
    id: 'build-a-bike',
    index: '03 / 08',
    glyph: '⚙',
    category: 'competition',
    categoryLabel: 'Mechanical Challenge',
    dateBadge: 'MAY 09–10',
    fullDate: 'May 09 — May 10, 2026',
    title: 'BUILD A BIKE',
    subtitle: 'Bicycle Assembly & Performance Challenge',
    status: 'conducted',
    statusText: 'Conducted at TVARAN',
    image: '/events/BUILD_A_BIKE.jpeg',
    venue: 'Mechanical Fabrication Bay, BIT Sindri',
    timing: '2-Day Mechanical Arena',
    shortDesc:
      'BUILD A BIKE is an exciting mechanical challenge that tests participants’ technical knowledge, precision, and teamwork through bicycle assembly and performance tasks.',
    longDesc:
      'A true test of craftsmanship and mechanical problem-solving. Teams received disassembled components and were evaluated on assembly precision, drivetrain calibration, alignment, brake tuning, and live performance ride testing under time-attack conditions.',
    instagramUrl:
      'https://www.instagram.com/p/DX7Wmx0ExAy/?utm_source=ig_web_copy_link&srtk=MzRlODBiNWFlZA==',
    specs: [
      { label: 'Discipline', value: 'Mechanical Assembly & Precision Tuning' },
      { label: 'Dates Held', value: '09th May 2026 – 10th May 2026' },
      { label: 'Venue', value: 'Central Mechanical Fabrication Bay' },
      { label: 'Criteria', value: 'Build Speed, Mechanical Accuracy & Ride Stability' },
    ],
  },
  {
    id: 'technothon',
    index: '04 / 08',
    glyph: '⚡',
    category: 'competition',
    categoryLabel: 'EV Case Study',
    dateBadge: 'MAY 09',
    fullDate: 'May 09, 2026',
    title: 'TECHNOTHON',
    subtitle: 'India EV & Green Mobility Case Study Challenge',
    status: 'conducted',
    statusText: 'Conducted at TVARAN',
    image: '/events/TECHNOTHON.jpeg',
    venue: 'Seminar Hall, BIT Sindri',
    timing: 'Case Presentations & Jury Defense',
    shortDesc:
      'TECHNOTHON is a case study presentation competition focused on India’s EV and mobility industry, encouraging strategic insights and sustainable engineering solutions.',
    longDesc:
      'TECHNOTHON challenged participants to analyze the crucial bottlenecks facing India’s electric mobility revolution: battery chemistry economics, charging network infrastructure, thermal safety, and fleet electrification. Teams pitched research-backed frameworks to a panel of expert evaluators.',
    instagramUrl:
      'https://www.instagram.com/p/DX7U26Tkzbs/?utm_source=ig_web_copy_link&dlrf=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    specs: [
      { label: 'Theme', value: 'EV Ecosystem, Batteries & Sustainable Mobility' },
      { label: 'Date Held', value: '09th May 2026' },
      { label: 'Format', value: 'Executive Deck Presentation & Defense' },
      { label: 'Festival', value: 'TVARAN 2026' },
    ],
  },
  {
    id: 'dirt-drive',
    index: '05 / 08',
    glyph: '▰',
    category: 'competition',
    categoryLabel: 'Bot Obstacle Challenge',
    dateBadge: 'MAY 10',
    fullDate: 'May 10, 2026',
    title: 'DIRT DRIVE',
    subtitle: 'All-Terrain Wireless Bot Arena',
    status: 'conducted',
    statusText: 'Conducted at TVARAN',
    image: '/events/DRIT_DRIVE.jpeg',
    venue: 'Off-Road Obstacle Arena, BIT Sindri',
    timing: 'Track Heats & Final Shakedown',
    shortDesc:
      'TVARAN presents DIRT DRIVE, an exciting bot-based challenge that tests creativity, teamwork, and precision through demanding obstacle tracks and unique terrain hurdles.',
    longDesc:
      'Student-engineered rovers and bot prototypes took on extreme obstacle terrain featuring mud trenches, elevated ramps, rumble strips, and sharp hairpin curves. The challenge tested chassis rigidity, wireless radio responsiveness, high-torque drivetrain durability, and piloting agility.',
    instagramUrl:
      'https://www.instagram.com/p/DX7j3H0k_hc/?utm_source=ig_web_copy_link&cplk=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    specs: [
      { label: 'Track Type', value: 'Multi-Surface All-Terrain Obstacle Arena' },
      { label: 'Date Held', value: '10th May 2026' },
      { label: 'Hardware', value: 'Custom-Built Wired / Wireless Bots' },
      { label: 'Festival', value: 'TVARAN 2026' },
    ],
  },
  {
    id: 'orientation-2026',
    index: '06 / 08',
    glyph: '✦',
    category: 'community',
    categoryLabel: 'Induction & Welcome',
    dateBadge: 'SEP 11',
    fullDate: 'September 11, 2026',
    title: 'ORIENTATION — BATCH OF 2026',
    subtitle: 'Welcoming the Next Generation of Mobility Engineers',
    status: 'conducted',
    statusText: 'Successfully Completed',
    image: '/events/ORIENTATION.jpeg',
    venue: 'Deshpande Auditorium, BIT Sindri',
    timing: 'Interactive Induction Session',
    shortDesc:
      'SAE INDIA BIT Sindri warmly welcomed the Batch of 2026, inspiring new members to explore automotive engineering, embrace innovation, and join our chapter family.',
    longDesc:
      'A high-energy welcome address introducing freshman engineers to collegiate motorsports, UAV flight development, workshop safety, and the culture of pair-programming, manufacturing, and national SAE India competitions. Senior leaders showcased our fleet of BAJA buggies, Formula racecars, and aero platforms.',
    instagramUrl:
      'https://www.instagram.com/p/DcyfcVWR51u/?utm_source=ig_web_copy_link&mdxt=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    specs: [
      { label: 'Target Batch', value: 'Incoming Engineering Batch of 2026' },
      { label: 'Date Held', value: '11th September 2026' },
      { label: 'Venue', value: 'Campus Auditorium' },
      { label: 'Keynotes', value: 'Motorsports, Aero Division & Chapter Roadmap' },
    ],
  },
  {
    id: 'outreach-workshop',
    index: '07 / 08',
    glyph: '◒',
    category: 'workshop',
    categoryLabel: 'School Outreach Workshop',
    dateBadge: 'WORKSHOP',
    fullDate: 'School STEM & Automobile Outreach',
    title: 'OUTREACH AUTOMOTIVE WORKSHOP',
    subtitle: 'Saraswati Shishu Vidya Mandir, Tetulmari',
    status: 'conducted',
    statusText: 'Outreach Completed',
    image: '/events/workshop2.webp',
    venue: 'Saraswati Shishu Vidya Mandir, Tetulmari',
    timing: 'Technical Demonstration Sessions',
    shortDesc:
      'SAE INDIA BIT Sindri organized a workshop at Saraswati Shishu Vidya Mandir, Tetulmari, featuring technical demonstrations to promote automobile engineering awareness.',
    longDesc:
      'Demonstrating our commitment to STEM community education, senior chapter members conducted an interactive automotive workshop for high school students. The session featured hands-on teardown models, powertrain working principles, aerodynamic basics, and interactive discussions to inspire future engineers.',
    instagramUrl:
      'https://www.instagram.com/p/DRUxH8ykppe/?utm_source=ig_web_copy_link&exln=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    specs: [
      { label: 'Host School', value: 'Saraswati Shishu Vidya Mandir, Tetulmari' },
      { label: 'Focus', value: 'Automotive Mechanics & Science Fundamentals' },
      { label: 'Format', value: 'Working Hardware Demos & Q&A Interactive' },
      { label: 'Mentors', value: 'SAE INDIA BIT Sindri Technical Team' },
    ],
  },
  {
    id: 'vishwakarma-puja',
    index: '08 / 08',
    glyph: '✦',
    category: 'community',
    categoryLabel: 'Tradition & Celebration',
    dateBadge: 'SEP 17',
    fullDate: 'September 17, 2026',
    title: 'VISHWAKARMA POOJA CELEBRATION',
    subtitle: 'Blessings for Craftsmanship, Tools & Machinery',
    status: 'conducted',
    statusText: 'Celebrated at The Bay',
    image: '/events/Vishwakarma Pooja.jpeg',
    venue: 'Mechanical Fabrication Bay, BIT Sindri',
    timing: 'Annual Workshop Puja & Gathering',
    shortDesc:
      'Vishwakarma Puja was celebrated in the workshop with devotion and enthusiasm, seeking blessings for safety, prosperity, and success in all engineering endeavours.',
    longDesc:
      'A deeply cherished tradition in the life of SAE BIT Sindri. The entire society gathers in the mechanical workshop to clean, polish, and worship the machine tools, welding equipment, chassis rigs, and competition vehicles, honoring the divine architect and seeking blessings for safety and success in all upcoming national competitions.',
    instagramUrl:
      'https://www.instagram.com/reel/DdgdoDwztlu/?utm_source=ig_web_copy_link&vrfl=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    specs: [
      { label: 'Tradition', value: 'Annual Vishwakarma Jayanti' },
      { label: 'Date Held', value: '17th September 2026' },
      { label: 'Location', value: 'Central Mechanical Fabrication Bay' },
      { label: 'Community', value: 'Collegiate Members, Faculty & Alumni' },
    ],
  },
];

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

  const featuredEvent = ALL_EVENTS[0]; // TECH FEST (TVARAN)

  return (
    <div className="events-hub-page" id="page-events">
      {/* =====================================================================
          1. ARCHIVE TELEMETRY STRIP (FLAGSHIP FEST RECAP)
          ===================================================================== */}
      <section className="events-ticker-wrapper" aria-label="Flagship Event Ticker">
        <div className="events-hub-container events-ticker-inner">
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
      <header className="events-page-header">
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

          <article className="featured-event-card">
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
          <div className="events-controls-bar">
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
        <section className="events-bottom-cta" aria-label="Join SAE BIT Sindri">
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
        </div>
      )}
    </div>
  );
};

export default EventsPage;
