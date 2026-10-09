import React from 'react';

interface AboutPageProps {
  isActive: boolean;
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ isActive, onNavigate }) => {
  return (
    <section className={`page ref-about-page ${isActive ? 'active' : ''}`} id="page-about">
      <div className="tech-grid about-bg-grid"></div>

      {/* Page Hero / Banner */}
      <div className="about-hero-wrap">
        <div className="ref-container" style={{ position: 'relative' }}>
          <div data-reveal className="reveal-up about-header-row">
            <div>
              <div className="team-eyebrow-row">
                <span className="team-eyebrow-line"></span>
                <p className="ref-eyebrow text-signal">// CHAPTER STORY &amp; MISSION · EST. BIT SINDRI</p>
              </div>
              <h1 className="ref-about-page-heading">
                Engineering the
                <span className="text-signal" style={{ display: 'block' }}>future of mobility.</span>
              </h1>
            </div>
            <p className="about-lead-copy">
              Founded to bridge academic classroom theory and competitive automotive performance, SAE India BIT Sindri is the premier collegiate mobility chapter turning student ambition into track-ready reality.
            </p>
          </div>
        </div>
      </div>

      {/* Story & Narrative Grid */}
      <section className="about-story-section">
        <div className="ref-container">
          <div className="about-story-grid">
            <div data-reveal className="reveal-up about-story-text">
              <span className="badge mono">// OUR ROOTS &amp; MISSION</span>
              <h2>Born in the Workshop. Proven on the Track.</h2>
              <p>
                SAE India BIT Sindri represents the pinnacle of multidisciplinary engineering at Birsa Institute of Technology, Sindri. What began as a passionate cohort of gearheads has evolved into an advanced collegiate engineering division building national competition buggies, Formula-class racecars, electric propulsion systems, and unmanned aerial platforms.
              </p>
              <p>
                Here, students don’t just read about finite element analysis, suspension kinematics, or battery thermal management—they calculate, simulate, weld, machine, wire, and test them until competition day.
              </p>
              <div className="about-principles-grid">
                <div className="about-principle-item">
                  <div className="about-principle-num">01</div>
                  <h4>Engineering Rigor</h4>
                  <p>Every tube, weld, and sensor is validated with CAD, FEA, and telemetry data before taking to the track.</p>
                </div>
                <div className="about-principle-item">
                  <div className="about-principle-num">02</div>
                  <h4>Cross-Discipline Synergy</h4>
                  <p>Mechanical, Electrical, Electronics, CS, and Mining students collaborating as one synchronized crew.</p>
                </div>
                <div className="about-principle-item">
                  <div className="about-principle-num">03</div>
                  <h4>Next-Gen Clean Tech</h4>
                  <p>Pioneering electric vehicles, hybrid powertrains, and smart telemetry to lead sustainable mobility.</p>
                </div>
                <div className="about-principle-item">
                  <div className="about-principle-num">04</div>
                  <h4>Student Leadership</h4>
                  <p>Full project ownership: budgeting, corporate sponsor management, logistics, and technical documentation.</p>
                </div>
              </div>
            </div>

            {/* Visual Feature / Stat highlight */}
            <div data-reveal className="reveal-up reveal-delay about-story-visual">
              <div className="about-visual-card">
                <div className="about-card-badge mono">// BY THE NUMBERS</div>
                <div className="about-numbers-stack">
                  <div className="about-num-row">
                    <span className="about-big-num">120<span className="text-signal">+</span></span>
                    <span className="about-num-desc">Active Student Members across engineering disciplines</span>
                  </div>
                  <div className="about-num-row">
                    <span className="about-big-num">08</span>
                    <span className="about-num-desc">Specialized Technical Sub-Teams (Chassis, Powertrain, EV, Aero, etc.)</span>
                  </div>
                  <div className="about-num-row">
                    <span className="about-big-num">16<span className="text-signal">+</span></span>
                    <span className="about-num-desc">Competition Vehicles &amp; Hardware Projects Built</span>
                  </div>
                  <div className="about-num-row">
                    <span className="about-big-num">06<span className="text-signal">+</span></span>
                    <span className="about-num-desc">Years of Continuous Collegiate Racing &amp; Innovation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO (THE CORE PILLARS) */}
      <section className="about-pillars-section">
        <div className="ref-container">
          <div data-reveal className="reveal-up ref-what-header">
            <div>
              <p className="ref-eyebrow text-signal">// WHAT WE DO</p>
              <h2 className="ref-what-heading">
                Ideas into <span className="text-signal">engineered reality.</span>
              </h2>
            </div>
            <p className="ref-what-subtext">
              Real projects. Real race deadlines. Real industrial skills. Explore the core disciplines that define our chapter work.
            </p>
          </div>

          <div className="about-pillars-grid">
            <article data-reveal className="reveal-up pillar-card">
              <div className="pillar-card-top">
                <span className="pillar-num">01</span>
                <span className="pillar-badge mono">DESIGN &amp; FABRICATION</span>
              </div>
              <h3 className="pillar-title">CAD, Simulation &amp; Manufacturing</h3>
              <p className="pillar-desc">
                From generative CAD modeling and structural FEA to CNC turning, TIG/MIG welding, and carbon-fiber composite layup. Our members engineer race-grade spaceframe chassis, custom uprights, steering racks, and aerodynamic elements from scratch.
              </p>
              <ul className="pillar-features">
                <li>SolidWorks, CATIA &amp; ANSYS structural analysis</li>
                <li>Custom suspension geometry &amp; roll center optimization</li>
                <li>In-house chassis fabrication, welding &amp; precision assembly</li>
              </ul>
            </article>

            <article data-reveal className="reveal-up reveal-delay pillar-card">
              <div className="pillar-card-top">
                <span className="pillar-num">02</span>
                <span className="pillar-badge mono">CLEAN MOBILITY</span>
              </div>
              <h3 className="pillar-title">EV Systems &amp; Advanced Powertrain</h3>
              <p className="pillar-desc">
                Spearheading the electric transition in collegiate motorsport. We engineer custom high-voltage lithium-ion battery packs, intelligent Battery Management Systems (BMS), motor controller parameter tuning, and real-time CAN bus telemetry.
              </p>
              <ul className="pillar-features">
                <li>High-voltage battery thermal management &amp; cell balancing</li>
                <li>Custom motor tuning &amp; regenerative braking logic</li>
                <li>Wireless telemetry dashboards &amp; trackside diagnostics</li>
              </ul>
            </article>

            <article data-reveal className="reveal-up pillar-card">
              <div className="pillar-card-top">
                <span className="pillar-num">03</span>
                <span className="pillar-badge mono">EDUCATION &amp; WORKSHOPS</span>
              </div>
              <h3 className="pillar-title">Workshops &amp; Engineering Bootcamps</h3>
              <p className="pillar-desc">
                Fostering technical literacy beyond the workshop. We host hands-on workshops for hundreds of campus students covering vehicle dynamics, automotive electronics, microcontroller coding, industrial CAD, and motorsport safety protocols.
              </p>
              <ul className="pillar-features">
                <li>Annual campus-wide CAD &amp; EV design masterclasses</li>
                <li>Hands-on welding, telemetry, and wiring bootcamps</li>
                <li>Senior-to-junior engineering mentorship programs</li>
              </ul>
            </article>

            <article data-reveal className="reveal-up reveal-delay pillar-card">
              <div className="pillar-card-top">
                <span className="pillar-num">04</span>
                <span className="pillar-badge mono">MANAGEMENT &amp; MEDIA</span>
              </div>
              <h3 className="pillar-title">Operations, Sponsorship &amp; Media</h3>
              <p className="pillar-desc">
                Running a championship team demands commercial excellence. Our operations division drives corporate sponsorship proposals, financial auditing, inventory procurement, event logistics, documentary cinematography, and digital outreach.
              </p>
              <ul className="pillar-features">
                <li>Corporate sponsor pitches &amp; CSR partnership development</li>
                <li>Budget management, supply chain &amp; part procurement</li>
                <li>Digital brand identity, media coverage &amp; public relations</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* AFFILIATION & INSTITUTIONAL BACKING */}
      <section className="about-affiliation-section">
        <div className="ref-container">
          <div data-reveal className="reveal-up about-affiliation-card">
            <div className="about-affil-content">
              <div className="about-affil-badges">
                <span className="badge mono">NATIONAL AFFILIATION</span>
                <span className="badge mono" style={{ borderColor: 'rgba(246, 183, 25, 0.4)', color: 'var(--color-signal)' }}>
                  SAEINDIA CHAPTER #3281
                </span>
              </div>
              <h2 className="about-affil-title">Backed by SAEINDIA &amp; BIT Sindri</h2>
              <p className="about-affil-text">
                SAE India BIT Sindri is an officially recognized Collegiate Chapter under the Eastern Section of SAEINDIA, affiliated with SAE International. Hosted at <strong>Birsa Institute of Technology (BIT) Sindri</strong>—a premier state government engineering institution established in 1949—the club operates with faculty mentorship from the Department of Mechanical Engineering and institutional backing from institute leadership.
              </p>
              <div className="about-affil-meta-row">
                <div className="affil-meta-item">
                  <span className="affil-meta-label">Parent Body</span>
                  <span className="affil-meta-val">SAEINDIA · SAE International</span>
                </div>
                <div className="affil-meta-item">
                  <span className="affil-meta-label">Collegiate Host</span>
                  <span className="affil-meta-val">BIT Sindri, Dhanbad (Est. 1949)</span>
                </div>
                <div className="affil-meta-item">
                  <span className="affil-meta-label">Host Department</span>
                  <span className="affil-meta-val">Dept. of Mechanical Engineering</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="about-cta-section">
        <div className="ref-container">
          <div data-reveal className="reveal-up team-join-banner">
            <div>
              <p className="ref-eyebrow text-signal">// BE PART OF THE STORY</p>
              <h3 className="team-join-heading">Ready to step onto the build floor?</h3>
            </div>
            <a
              href="#join"
              className="ref-btn ref-btn-primary effect-shine"
              data-page="join"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('join');
              }}
            >
              Join Velocity SAE
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </section>
  );
};
