import React from 'react';

const TRACK_1_ITEMS = [
  { img: '/glimpses/tech_fest.webp', badge: 'TECH MAHOTSAV', title: 'Vehicle Unveiling & Demos' },
  { img: '/glimpses/tech_fest1.webp', badge: 'EXHIBITION', title: 'Formula & Buggy Showcase' },
  { img: '/glimpses/tech_fest2.webp', badge: 'CAMPUS DRIVE', title: 'Student Innovations on Display' },
  { img: '/glimpses/tech_fest3.webp', badge: 'LIVE DEMO', title: 'Aero Dynamics & Track Testing' },
  { img: '/glimpses/tech_fest4.webp', badge: 'SHOWCASE', title: 'Chapter Interactive Pavilion' },
  { img: '/glimpses/tech_fest5.webp', badge: 'MOTORSPORT', title: 'Trackside Pit & Engineering' },
];

const TRACK_2_ITEMS = [
  { img: '/glimpses/workshop.webp', badge: 'WORKSHOP BAY', title: 'Engine Teardown & Mechanics' },
  { img: '/glimpses/workshop2.webp', badge: 'FABRICATION', title: 'Chassis CAD & Metalworking' },
  { img: '/glimpses/puja.webp', badge: 'TRADITION', title: 'Vishwakarma Puja Ceremonies' },
  { img: '/glimpses/puja1.webp', badge: 'BAY BLESSING', title: 'Mechanical Blessings at The Bay' },
  { img: '/glimpses/puja3.webp', badge: 'COMMUNITY', title: 'Annual Chapter Ceremony' },
  { img: '/glimpses/puja4.webp', badge: 'CREW UNITY', title: 'The Collegiate Chapter Family' },
];

export const GlimpsesSection: React.FC = () => {
  return (
    <section id="home-glimpses-section" className="ref-glimpses-section">
      <div className="ref-glimpses-header-wrap">
        <p className="ref-eyebrow text-signal">// Life at SAE BIT Sindri</p>
        <h2 className="ref-glimpses-heading">
          Moments From <span className="text-signal">The Bay.</span>
        </h2>
        <p className="ref-glimpses-copy">
          From late-night chassis fabrication and engine teardowns to tech fest showcases and traditional chapter celebrations — here is the passion driving our journey.
        </p>
      </div>

      <div className="glimpses-marquee-container">
        {/* Row 1: Right to Left (Tech Fests & Exhibitions) */}
        <div className="glimpses-marquee-row">
          <div className="glimpses-marquee-track track-dir-left">
            {/* Set 1 */}
            <div className="glimpses-marquee-group">
              {TRACK_1_ITEMS.map((item, idx) => (
                <div className="glimpse-card" key={`t1-${idx}`}>
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    width="340"
                    height="225"
                    className="glimpse-img"
                  />
                  <div className="glimpse-overlay"></div>
                  <div className="glimpse-content">
                    <span className="glimpse-badge mono">{item.badge}</span>
                    <h4 className="glimpse-title">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>

            {/* Set 2 (Duplicate for infinite seamless loop) */}
            <div className="glimpses-marquee-group" aria-hidden="true">
              {TRACK_1_ITEMS.map((item, idx) => (
                <div className="glimpse-card" key={`t1-dup-${idx}`}>
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    width="340"
                    height="225"
                    className="glimpse-img"
                  />
                  <div className="glimpse-overlay"></div>
                  <div className="glimpse-content">
                    <span className="glimpse-badge mono">{item.badge}</span>
                    <h4 className="glimpse-title">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Left to Right (Workshops, Bay & Traditions) */}
        <div className="glimpses-marquee-row">
          <div className="glimpses-marquee-track track-dir-right">
            {/* Set 1 */}
            <div className="glimpses-marquee-group">
              {TRACK_2_ITEMS.map((item, idx) => (
                <div className="glimpse-card" key={`t2-${idx}`}>
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    width="340"
                    height="225"
                    className="glimpse-img"
                  />
                  <div className="glimpse-overlay"></div>
                  <div className="glimpse-content">
                    <span className="glimpse-badge mono">{item.badge}</span>
                    <h4 className="glimpse-title">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>

            {/* Set 2 (Duplicate for infinite seamless loop) */}
            <div className="glimpses-marquee-group" aria-hidden="true">
              {TRACK_2_ITEMS.map((item, idx) => (
                <div className="glimpse-card" key={`t2-dup-${idx}`}>
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    width="340"
                    height="225"
                    className="glimpse-img"
                  />
                  <div className="glimpse-overlay"></div>
                  <div className="glimpse-content">
                    <span className="glimpse-badge mono">{item.badge}</span>
                    <h4 className="glimpse-title">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
