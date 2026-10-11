import React, { useState } from 'react';
import { SPONSORS, SPONSOR_FILTER_DEFS, type SponsorItem } from '../data';

interface SponsorsPageProps {
  isActive?: boolean;
}

export const SponsorsPage: React.FC<SponsorsPageProps> = ({ isActive = true }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredSponsors: SponsorItem[] =
    activeFilter === 'all'
      ? SPONSORS
      : SPONSORS.filter((s) => {
          if (activeFilter === 'institutional') {
            return s.tier === 'institutional' || s.tier === 'associate';
          }
          return s.tier === activeFilter;
        });

  return (
    <section className={`page ${isActive ? 'active' : ''}`} id="page-sponsors">
      {/* Header */}
      <div data-reveal className="reveal-up team-header-row">
        <div>
          <div className="team-eyebrow-row">
            <span className="team-eyebrow-line"></span>
            <p className="ref-eyebrow text-signal">Supporting our mission</p>
          </div>
          <h1 className="ref-team-heading">
            Our
            <span className="text-signal" style={{ display: 'block' }}>Sponsors.</span>
          </h1>
        </div>
        <p className="team-subtext">
          Our journey is made possible by the generous support of our sponsors. Meet the industry leaders,
          technology providers, and institutions backing our collegiate society.
        </p>
      </div>

      {/* Sponsor Filters */}
      <div className="filters" id="sponsorFilters">
        {SPONSOR_FILTER_DEFS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`chip ${activeFilter === key ? 'active' : ''}`}
            data-sponsor-filter={key}
            onClick={() => setActiveFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sponsor Cards Grid */}
      <div className="sponsor-grid" id="sponsorGrid">
        {filteredSponsors.map((s, idx) => (
          <div className="sponsor-card" key={`sponsor-${s.name}-${idx}`}>
            <div className="sponsor-logo-box">
              <img src={s.logo} alt={`${s.name} Logo`} loading="lazy" className="sponsor-logo-img" />
            </div>
            <div className="sponsor-body">
              <span className="sponsor-tier mono">{s.tierLabel}</span>
              <h3>{s.name}</h3>
              <span className="sponsor-cat">{s.category}</span>
              <p>{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Become a Sponsor CTA Banner */}
      <div className="sponsor-cta-banner">
        <div className="sponsor-cta-content">
          <span className="badge mono">PARTNER WITH US</span>
          <h2>Fuel the Next Generation of Automotive Engineers</h2>
          <p>
            Gain direct brand visibility across national competitions, recruiting access to top engineering talent at
            BIT Sindri, and collaborative R&amp;D opportunities.
          </p>
        </div>
        <div className="sponsor-cta-action">
          <a
            href="mailto:saeindiabitsindri@gmail.com?subject=Sponsorship%20Inquiry%20-%20SAE%20BIT%20Sindri"
            className="ref-btn ref-btn-primary effect-shine"
          >
            Partner With Us
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
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
