import React, { useState, useEffect, useRef } from 'react';

interface EventsPageProps {
  isActive: boolean;
}

interface EventDetail {
  title: string;
  date: string;
  desc: string;
  img: string;
  upcoming: string;
}

const EVENT_DETAILS: EventDetail[] = [
  {
    title: 'BAJA SAE India',
    date: 'Annual National Competition',
    desc: 'Our flagship participation event. We design, fabricate, and race a rugged single-seater all-terrain vehicle. The team goes through intense design evaluations, dynamic testing, and a grueling endurance race.',
    img: 'https://via.placeholder.com/600x350/1e293b/eab308?text=BAJA+SAE+India',
    upcoming: 'Next Event: February 2027',
  },
  {
    title: 'CAD Design Workshop',
    date: 'Hosted by SAE BIT Sindri',
    desc: 'A comprehensive hands-on workshop focused on SolidWorks and AutoCAD. We train our members and fellow students in the fundamentals of 3D modeling and simulation essential for automotive component design.',
    img: 'https://via.placeholder.com/600x350/1e293b/eab308?text=CAD+Design+Workshop',
    upcoming: 'Coming Up: November 12, 2026',
  },
  {
    title: 'SUPRA SAE India',
    date: 'Annual National Competition',
    desc: 'The ultimate formula student competition. We engineer a formula-style race car from scratch, focusing on aerodynamics, power-to-weight ratio, and precision handling on the track.',
    img: 'https://via.placeholder.com/600x350/1e293b/eab308?text=SUPRA+SAE+India',
    upcoming: '',
  },
  {
    title: 'Engine Teardown Session',
    date: 'Hosted by SAE BIT Sindri',
    desc: 'Get your hands dirty in this interactive session where we dismantle and rebuild a standard IC engine. Understand powertrain mechanics, transmission systems, and performance tuning.',
    img: 'https://via.placeholder.com/600x350/1e293b/eab308?text=Engine+Teardown+Session',
    upcoming: 'Coming Up: December 5, 2026',
  },
];

const TOP_CARDS = [
  {
    badgeClass: 'badge-flagship',
    badgeText: 'FLAGSHIP',
    meta: 'Tech Mahotsav • Date TBA',
    title: 'Tvaran',
    desc: "The chapter's flagship event — design challenges, EV hackathon and hands-on builds open to the whole campus.",
    loc: '📍 BIT Sindri Campus',
  },
  {
    badgeClass: 'badge-recruitment',
    badgeText: 'RECRUITMENT',
    meta: 'Odd Semester • Date TBA',
    title: 'Freshers Induction & Orientation',
    desc: 'Walkthrough of the four crews, how to join, and what a build season looks like for new members.',
    loc: '📍 Mechanical Engineering Block',
  },
  {
    badgeClass: 'badge-workshop',
    badgeText: 'WORKSHOP',
    meta: 'Odd Semester • Date TBA',
    title: 'Chassis & Roll-Cage Design',
    desc: 'Hands-on session on frame fabrication, materials and the SAE rulebook constraints that shape every build.',
    loc: '📍 SAE Workshop Bay',
  },
  {
    badgeClass: 'badge-industrial',
    badgeText: 'INDUSTRIAL VISIT',
    meta: 'Even Semester • Date TBA',
    title: 'Manufacturing Plant Visit',
    desc: 'A look at production-line engineering and quality processes at an automotive manufacturing facility.',
    loc: '📍 Off-Campus',
  },
  {
    badgeClass: 'badge-workshop',
    badgeText: 'WORKSHOP',
    meta: 'Even Semester • Date TBA',
    title: 'EV Powertrain Tech Talk',
    desc: 'Covering motor selection, battery management and controller tuning for electric builds.',
    loc: '📍 Seminar Hall',
  },
  {
    badgeClass: 'badge-flagship',
    badgeText: 'FLAGSHIP',
    meta: 'Pre-Competition • Date TBA',
    title: 'Test & Tune Camp',
    desc: 'Final shakedown runs and reliability checks before the team travels for competition.',
    loc: '📍 Test Track',
  },
];

export const EventsPage: React.FC<EventsPageProps> = ({ isActive }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const handleSelectEvent = (index: number) => {
    if (index === activeIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsFading(false);
    }, 200);
  };

  useEffect(() => {
    if (!isActive || !timelineRef.current) return;

    const items = timelineRef.current.querySelectorAll<HTMLElement>('.timeline-item');
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idxAttr = entry.target.getAttribute('data-index');
            if (idxAttr) {
              const idx = parseInt(idxAttr, 10);
              handleSelectEvent(idx);
            }
          }
        });
      },
      { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, [isActive]);

  const current = EVENT_DETAILS[activeIndex] || EVENT_DETAILS[0];

  return (
    <section className={`page ${isActive ? 'active' : ''}`} id="page-events">
      <div className="custom-events-wrapper">
        <header className="custom-events-header">
          <h1>Events &amp; Competitions</h1>
          <p>
            Explore the national competitions we participate in and the technical
            workshops we host
          </p>
        </header>

        {/* Horizontal Cards Section Before the Timeline */}
        <section className="top-cards-section">
          <div className="cards-wrapper">
            {TOP_CARDS.map((card, idx) => (
              <div className="top-event-card" key={`top-card-${idx}`}>
                <div className="card-header">
                  <span className={`badge ${card.badgeClass}`}>{card.badgeText}</span>
                </div>
                <span className="card-meta">{card.meta}</span>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <div className="card-location">{card.loc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Flow */}
        <div className="events-container">
          {/* Left Side: Timeline Flow */}
          <div className="timeline-section" ref={timelineRef}>
            <div className="timeline-line"></div>

            {EVENT_DETAILS.map((ev, idx) => {
              const isLeft = idx % 2 === 0;
              const isItemActive = activeIndex === idx;
              return (
                <div
                  key={ev.title}
                  className={`timeline-item ${isLeft ? 'left' : 'right'} ${isItemActive ? 'active' : ''}`}
                  data-index={idx}
                  onClick={() => handleSelectEvent(idx)}
                >
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h3>{ev.title}</h3>
                    <span className="date">{ev.date}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side: Sticky Event Details */}
          <div className="details-section">
            <div
              className={`sticky-wrapper ${isFading ? 'fade-out' : ''}`}
              id="details-display"
            >
              <div className="image-box">
                <img
                  id="display-img"
                  src={current.img}
                  alt={current.title}
                />
              </div>
              <div className="info-container">
                <h2 id="display-title">{current.title}</h2>
                <p id="display-date" className="highlight-date">
                  {current.date}
                </p>
                <p id="display-desc">{current.desc}</p>

                {current.upcoming && (
                  <div id="display-upcoming" className="upcoming-badge">
                    {current.upcoming}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
