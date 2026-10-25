import React from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <section className="page ref-about-page active" id="page-about">
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
              <span className="badge mono" style={{ borderColor: 'rgba(246, 183, 25, 0.45)', color: 'var(--color-signal)' }}>
                // OUR ROOTS &amp; MISSION
              </span>
              <h2>Born in the Workshop. Proven on the Track.</h2>
              <p>
                SAE India BIT Sindri brings together passionate engineering students who believe in learning by doing. What started as a group of students interested in automobiles and engineering has grown into a team working on exciting projects such as BAJA, SUPRA and EFFICYCLE.
              </p>
              <p>
                At SAE, learning goes beyond textbooks and classrooms. Students get hands-on experience in designing, building, testing, and improving their projects. From understanding vehicle dynamics and powertrains to working with CAD software, welding, machining, and electrical systems, members learn how engineering works in real life.
              </p>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', color: '#ffffff', marginTop: '2.25rem', marginBottom: '1.25rem', letterSpacing: '0.04em' }}>
                Our Key Focus Areas
              </h3>
              <div className="about-principles-grid" style={{ marginTop: '0' }}>
                <div className="about-principle-item">
                  <div className="about-principle-num">01</div>
                  <h4>Engineering Excellence</h4>
                  <p>We focus on building reliable and efficient machines. Every component, whether it is a tube, weld, or sensor, is carefully designed and tested using tools such as CAD and FEA.</p>
                </div>
                <div className="about-principle-item">
                  <div className="about-principle-num">02</div>
                  <h4>Teamwork Across Disciplines</h4>
                  <p>SAE brings together students from Mechanical, Electrical, Electronics, Computer Science, and Mining Engineering. Everyone contributes their knowledge and skills to work towards a common goal.</p>
                </div>
                <div className="about-principle-item">
                  <div className="about-principle-num">03</div>
                  <h4>Innovation and Clean Technology</h4>
                  <p>We encourage students to explore electric vehicles, hybrid powertrains, and smart monitoring systems. We aim to develop innovative solutions that support cleaner and more sustainable transportation.</p>
                </div>
                <div className="about-principle-item">
                  <div className="about-principle-num">04</div>
                  <h4>Leadership and Project Management</h4>
                  <p>Members learn more than technical skills. They also get opportunities to manage projects, plan budgets, coordinate logistics, communicate with sponsors, and handle technical documentation.</p>
                </div>
              </div>
            </div>

            {/* Visual Feature / Stat highlight */}
            <div data-reveal className="reveal-up reveal-delay about-story-visual">
              {/* Faculty & Institutional Mentorship Card */}
              <div className="about-prof-card">
                <div className="about-card-badge mono">// FACULTY ADVISORS · MECHANICAL BRANCH</div>
                <div className="about-prof-grid">
                  {/* Prof 1: Dr Manoj Kumar */}
                  <article className="prof-item">
                    <div className="prof-photo-box">
                      <picture>
                        <source srcSet="/about_items/DrManoj_enhanced.webp" type="image/webp" />
                        <img
                          src="/about_items/DrManoj_enhanced.png"
                          alt="Dr Manoj Kumar, Faculty Advisor - Mechanical Branch"
                          className="prof-photo-img"
                          loading="lazy"
                          decoding="async"
                          width="400"
                          height="500"
                        />
                      </picture>
                      <div className="prof-photo-overlay" />
                    </div>
                    <div className="prof-info">
                      <span className="prof-tag mono">FACULTY ADVISOR</span>
                      <h4 className="prof-name">Dr Manoj Kumar</h4>
                      <p className="prof-sub">
                        Mechanical Engineering Branch<br />BIT Sindri
                      </p>
                    </div>
                  </article>

                  {/* Prof 2: Dr Rajan Kumar */}
                  <article className="prof-item">
                    <div className="prof-photo-box">
                      <picture>
                        <source srcSet="/about_items/DrRajan_enhanced.webp" type="image/webp" />
                        <img
                          src="/about_items/DrRajan_enhanced.png"
                          alt="Dr Rajan Kumar, Faculty Advisor - Mechanical Branch"
                          className="prof-photo-img"
                          loading="lazy"
                          decoding="async"
                          width="400"
                          height="500"
                        />
                      </picture>
                      <div className="prof-photo-overlay" />
                    </div>
                    <div className="prof-info">
                      <span className="prof-tag mono">FACULTY ADVISOR</span>
                      <h4 className="prof-name">Dr Rajan Kumar</h4>
                      <p className="prof-sub">
                        Mechanical Engineering Branch<br />BIT Sindri
                      </p>
                    </div>
                  </article>
                </div>
              </div>

              {/* By The Numbers Card */}
              <div className="about-visual-card">
                <div className="about-card-badge mono">// BY THE NUMBERS</div>
                <div className="about-numbers-stack">
                  <div className="about-num-row">
                    <span className="about-big-num">70<span className="text-signal">+</span></span>
                    <span className="about-num-desc">Active Student Members across engineering disciplines</span>
                  </div>
                  <div className="about-num-row">
                    <span className="about-big-num">08</span>
                    <span className="about-num-desc">Specialized Technical Sub-Teams (Chassis, Powertrain, EV, Aero, etc.)</span>
                  </div>
                  <div className="about-num-row">
                    <span className="about-big-num">10<span className="text-signal">+</span></span>
                    <span className="about-num-desc">Competition Vehicles &amp; Hardware Projects Built</span>
                  </div>
                  <div className="about-num-row">
                    <span className="about-big-num">15<span className="text-signal">+</span></span>
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
                <span className="pillar-badge mono">OFF-ROAD MOBILITY</span>
              </div>
              <h3 className="pillar-title">BAJA SAE India</h3>
              <p className="pillar-desc">
                Designing and developing an all-terrain vehicle to compete in the BAJA SAE India competition. Our team focuses on vehicle dynamics, chassis design, suspension geometry, and performance optimization.
              </p>
              <ul className="pillar-features">
                <li>All-terrain vehicle design and fabrication</li>
                <li>Suspension, steering, and braking systems</li>
                <li>Vehicle testing and performance optimization</li>
              </ul>
            </article>

            <article data-reveal className="reveal-up reveal-delay pillar-card">
              <div className="pillar-card-top">
                <span className="pillar-num">02</span>
                <span className="pillar-badge mono">ALL-TERRAIN ENGINEERING</span>
              </div>
              <h3 className="pillar-title">Quad Torc</h3>
              <p className="pillar-desc">
                Building a rugged quad vehicle engineered for durability, stability, and off-road performance. Our team emphasizes efficient design, robust fabrication, and reliable vehicle dynamics.
              </p>
              <ul className="pillar-features">
                <li>Quad vehicle design and fabrication</li>
                <li>Chassis strength and suspension tuning</li>
                <li>Testing, handling, and terrain adaptability</li>
              </ul>
            </article>

            <article data-reveal className="reveal-up pillar-card">
              <div className="pillar-card-top">
                <span className="pillar-num">03</span>
                <span className="pillar-badge mono">AERIAL SYSTEMS</span>
              </div>
              <h3 className="pillar-title">Aerothon</h3>
              <p className="pillar-desc">
                Developing innovative aerial systems through aerodynamic design, drone integration, and performance testing. Our team explores UAV technology, flight stability, and practical engineering solutions.
              </p>
              <ul className="pillar-features">
                <li>UAV design and system integration</li>
                <li>Aerodynamics and flight stability</li>
                <li>Drone testing and performance evaluation</li>
              </ul>
            </article>

            <article data-reveal className="reveal-up reveal-delay pillar-card">
              <div className="pillar-card-top">
                <span className="pillar-num">04</span>
                <span className="pillar-badge mono">ENERGY-EFFICIENT MOBILITY</span>
              </div>
              <h3 className="pillar-title">Effi-Cycle</h3>
              <p className="pillar-desc">
                Designing and fabricating an energy-efficient human-electric hybrid vehicle focused on sustainability, lightweight construction, and innovative mobility solutions.
              </p>
              <ul className="pillar-features">
                <li>Lightweight chassis design and fabrication</li>
                <li>Energy-efficient drivetrain optimization</li>
                <li>Vehicle testing and efficiency improvement</li>
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
                <span className="badge mono" style={{ borderColor: 'rgba(246, 183, 25, 0.45)', color: 'var(--color-signal)' }}>
                  OUR AFFILIATION
                </span>
              </div>
              <h2 className="about-affil-title">Backed by SAEINDIA &amp; BIT Sindri</h2>
              <p className="about-affil-text">
                SAE India BIT Sindri is an officially recognized Collegiate Chapter under the Eastern Section of SAEINDIA, affiliated with SAE International. Hosted at <strong>Birsa Institute of Technology (BIT) Sindri</strong>—a premier state government engineering institution established in 1949—the society operates with faculty mentorship from the Department of Mechanical Engineering and institutional backing from institute leadership.
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
            <Link
              to="/join"
              className="ref-btn ref-btn-primary effect-shine"
            >
              Join SAE BIT SINDRI
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
};
