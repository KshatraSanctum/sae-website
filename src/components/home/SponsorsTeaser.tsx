import React from 'react';

interface SponsorsTeaserProps {
  onNavigate: (page: string) => void;
}

const ROW_1_SPONSORS = [
  { name: 'Tata Motors', tier: 'Industrial Partner', logo: '/sponsors/tata.svg' },
  { name: 'Dassault Systèmes', tier: 'Software Partner', logo: '/sponsors/dassault-systemes.png' },
  { name: 'JK Tyre', tier: 'Tyre Partner', logo: '/sponsors/jk-tyre.png' },
  { name: 'Ansys', tier: 'Simulation Partner', logo: '/sponsors/ansys.png' },
  { name: 'Indian Oil', tier: 'Energy Partner', logo: '/sponsors/indian-oil.svg' },
  { name: 'Ricardo', tier: 'Technical Partner', logo: '/sponsors/ricardo.svg' },
  { name: 'ONGC', tier: 'Corporate Partner', logo: '/sponsors/ongc.png' },
  { name: 'BIT Sindri', tier: 'Institutional Patron', logo: '/sponsors/bit-sindri.png' },
];

const ROW_2_SPONSORS = [
  { name: 'Altair', tier: 'Software Partner', logo: '/sponsors/altair.svg' },
  { name: 'Bharat Petroleum', tier: 'Energy Partner', logo: '/sponsors/bharat-petroleum.png' },
  { name: 'TotalEnergies', tier: 'Lubricants Partner', logo: '/sponsors/total.svg' },
  { name: 'Hindustan Motors', tier: 'Industrial Partner', logo: '/sponsors/hindustan-motors.svg' },
  { name: 'Jawa Motorcycles', tier: 'Engine Systems', logo: '/sponsors/jawa.png' },
  { name: 'RJS Racing', tier: 'Safety Equipment', logo: '/sponsors/rjs-racing.png' },
  { name: 'AIEFA Vision', tier: 'Academic Partner', logo: '/sponsors/aiefa.png' },
];

export const SponsorsTeaser: React.FC<SponsorsTeaserProps> = ({ onNavigate }) => {
  return (
    <section id="home-sponsors-teaser" className="ref-sponsors-section">
      <div className="ref-container" style={{ padding: 0, maxWidth: '80rem', margin: '0 auto' }}>
        <div className="ref-sponsors-grid">
          {/* Left Side: Editorial Content */}
          <div data-reveal className="reveal-up ref-sponsors-left">
            <p className="ref-eyebrow text-signal">// Industry &amp; Partners</p>
            <h2 className="ref-sponsors-heading">
              Backed by Industry.
              <br />
              <span className="text-signal">Built for Victory.</span>
            </h2>
            <p className="ref-sponsors-copy">
              From high-precision CAD suites and structural FEA software to aerospace-grade 4130 chromoly and track-proven racing rubber, our corporate and technical partners equip our student engineers with industrial tools to build championship machines.
            </p>
            <div className="ref-sponsors-actions">
              <a
                href="#sponsors"
                className="ref-btn ref-btn-outline effect-shine"
                data-page="sponsors"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('sponsors');
                }}
              >
                Explore All Sponsors
                <svg
                  aria-hidden="true"
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

          {/* Right Side: Floating Sponsors Marquee */}
          <div className="ref-sponsors-right">
            <div className="sponsors-marquee-container">
              {/* Row 1: Right to Left */}
              <div className="sponsors-marquee-row">
                <div className="sponsors-marquee-track track-speed-normal">
                  {/* Set 1 */}
                  <div className="sponsors-marquee-group">
                    {ROW_1_SPONSORS.map((s, idx) => (
                      <div className="sponsor-mini-card" key={`s1-${idx}`}>
                        <div className="sponsor-mini-logo-wrap">
                          <img src={s.logo} alt={s.name} loading="lazy" className="sponsor-mini-img" />
                        </div>
                        <div className="sponsor-mini-info">
                          <span className="sponsor-mini-name">{s.name}</span>
                          <span className="sponsor-mini-tier mono">{s.tier}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Duplicate Set 1 for Infinite Loop */}
                  <div className="sponsors-marquee-group" aria-hidden="true">
                    {ROW_1_SPONSORS.map((s, idx) => (
                      <div className="sponsor-mini-card" key={`s1-dup-${idx}`}>
                        <div className="sponsor-mini-logo-wrap">
                          <img src={s.logo} alt={s.name} loading="lazy" className="sponsor-mini-img" />
                        </div>
                        <div className="sponsor-mini-info">
                          <span className="sponsor-mini-name">{s.name}</span>
                          <span className="sponsor-mini-tier mono">{s.tier}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Right to Left (Slightly slower / offset) */}
              <div className="sponsors-marquee-row">
                <div className="sponsors-marquee-track track-speed-alt">
                  {/* Set 2 */}
                  <div className="sponsors-marquee-group">
                    {ROW_2_SPONSORS.map((s, idx) => (
                      <div className="sponsor-mini-card" key={`s2-${idx}`}>
                        <div className="sponsor-mini-logo-wrap">
                          <img src={s.logo} alt={s.name} loading="lazy" className="sponsor-mini-img" />
                        </div>
                        <div className="sponsor-mini-info">
                          <span className="sponsor-mini-name">{s.name}</span>
                          <span className="sponsor-mini-tier mono">{s.tier}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Duplicate Set 2 for Infinite Loop */}
                  <div className="sponsors-marquee-group" aria-hidden="true">
                    {ROW_2_SPONSORS.map((s, idx) => (
                      <div className="sponsor-mini-card" key={`s2-dup-${idx}`}>
                        <div className="sponsor-mini-logo-wrap">
                          <img src={s.logo} alt={s.name} loading="lazy" className="sponsor-mini-img" />
                        </div>
                        <div className="sponsor-mini-info">
                          <span className="sponsor-mini-name">{s.name}</span>
                          <span className="sponsor-mini-tier mono">{s.tier}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
