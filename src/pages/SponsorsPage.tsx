import React, { useState, useEffect } from 'react';
import { SPONSORS, SPONSOR_FILTER_DEFS, type SponsorItem } from '../data';

interface SponsorsPageProps {
  isActive?: boolean;
}

export const SponsorsPage: React.FC<SponsorsPageProps> = ({ isActive = true }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activePoster, setActivePoster] = useState<{ title: string; image: string; category?: string } | null>(null);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePoster) {
        setActivePoster(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePoster]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (activePoster) {
      document.documentElement.classList.add('modal-open');
      document.body.classList.add('modal-open');
    } else {
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
    };
  }, [activePoster]);

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
        {filteredSponsors.map((s, idx) => {
          const isGold = s.tierLabel.toLowerCase().includes('gold') || Boolean(s.badge);
          return (
            <div className={`sponsor-card ${isGold ? 'is-gold' : ''}`} key={`sponsor-${s.name}-${idx}`}>
              {s.badge && (
                <div className="sponsor-card-badge-wrap">
                  <span className="sponsor-card-badge mono">{s.badge}</span>
                </div>
              )}
              <div className="sponsor-logo-box">
                <img src={s.logo} alt={`${s.name} Logo`} loading="lazy" decoding="async" width="120" height="60" className="sponsor-logo-img" />
              </div>
              <div className="sponsor-body">
                <span className="sponsor-tier mono">{s.tierLabel}</span>
                <h3>{s.name}</h3>
                <span className="sponsor-cat">{s.category}</span>
                <p>{s.description}</p>
                {s.poster && (
                  <div className="sponsor-card-action">
                    <button
                      type="button"
                      className="sponsor-poster-btn"
                      onClick={() => setActivePoster({ title: s.name, image: s.poster!, category: s.category })}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                      Official Announcement Poster
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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

      {/* Sponsor Announcement Modal */}
      {activePoster && (
        <div
          className="sponsor-poster-modal-backdrop"
          onClick={() => setActivePoster(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sponsor-modal-title"
        >
          <div
            className="sponsor-poster-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="sponsor-poster-close"
              onClick={() => setActivePoster(null)}
              aria-label="Close announcement modal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="sponsor-poster-frame">
              <img
                src={activePoster.image}
                alt={`${activePoster.title} Official Announcement Poster`}
                className="sponsor-poster-img"
              />
            </div>
            <div className="sponsor-poster-footer">
              <div>
                <span className="sponsor-poster-badge mono">OFFICIAL ANNOUNCEMENT</span>
                <h3 id="sponsor-modal-title">{activePoster.title}</h3>
                {activePoster.category && <p>{activePoster.category}</p>}
              </div>
              <a
                href={activePoster.image}
                target="_blank"
                rel="noopener noreferrer"
                className="ref-btn ref-btn-outline effect-shine"
              >
                Open Full Res
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
