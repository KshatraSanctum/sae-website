import React from 'react';

const TRACK_1_ITEMS = [
  { img: '/glimpses/tech_fest.webp', badge: 'TVARAN FEST', title: 'Driven By Passion Photobooth' },
  { img: '/glimpses/tech_fest1.webp', badge: 'TEAM SPIRIT', title: 'Chapter Crew at Tvaran Booth' },
  { img: '/glimpses/tech_fest2.webp', badge: 'MECH COSPLAY', title: 'Optimus Prime Helmet Craft' },
  { img: '/glimpses/tech_fest3.webp', badge: 'CHAPTER PRIDE', title: 'Giant 3D SAE INDIA Installation' },
  { img: '/glimpses/tech_fest4.webp', badge: 'FORMULA STUDENT', title: 'In the Cockpit of Formula Racecar' },
  { img: '/glimpses/tech_fest5.webp', badge: 'SOCIETY FAMILY', title: 'Annual Chapter Fest Gathering' },
];

const TRACK_2_ITEMS = [
  { img: '/glimpses/workshop.webp', badge: 'UAV & PROPULSION', title: 'Drone Motor & Aerodynamics Briefing' },
  { img: '/glimpses/workshop2.webp', badge: 'TECH SEMINAR', title: 'Automotive Powertrain & Drivetrain Lecture' },
  { img: '/achievements/supra sae 2012.webp', badge: 'SUPRA SAE', title: 'Team Speedy Avengers (Car #115)' },
  { img: '/achievements/baja sae india 2015.webp', badge: 'BAJA SAE', title: 'mBAJA Pit Lane & Driver Prep at NATRAX' },
  { img: '/achievements/aerothon 2023.webp', badge: 'AEROSPACE & UAV', title: 'Team Vayu Custom Quadcopter Drone' },
  { img: '/glimpses/puja4.webp', badge: 'TRADITION', title: 'Vishwakarma Puja Celebration at The Bay' },
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
