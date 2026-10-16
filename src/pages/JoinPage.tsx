import React, { useState } from 'react';

interface JoinPageProps {
  isActive?: boolean;
}

export const JoinPage: React.FC<JoinPageProps> = ({ isActive = true }) => {
  const [formData, setFormData] = useState({
    name: '',
    roll: '',
    branch: '',
    year: '',
    email: '',
    phone: '',
    crew: '',
    subdomain: '',
    motivation: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submissionTime, setSubmissionTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    setSubmissionTime(
      now.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    );
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      roll: '',
      branch: '',
      year: '',
      email: '',
      phone: '',
      crew: '',
      subdomain: '',
      motivation: '',
    });
    setSubmitted(false);
  };

  const scrollToApply = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('join-application')?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectCrewAndScroll = (crewName: string, subdomainDefault: string = '') => {
    setFormData((prev) => ({
      ...prev,
      crew: crewName,
      subdomain: subdomainDefault || prev.subdomain,
    }));
    document.getElementById('join-application')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={`page ref-join-page ${isActive ? 'active' : ''}`} id="page-join">
      {/* Background Ambience & Tech Grid */}
      <div className="tech-grid join-bg-grid" aria-hidden="true"></div>

      {/* Hero / Banner Header (Matching AboutPage & TeamPage aesthetic) */}
      <div className="join-hero-wrap">
        <div className="ref-container" style={{ position: 'relative' }}>
          <div data-reveal className="reveal-up join-header-row">
            <div>
              <div className="team-eyebrow-row">
                <span className="team-eyebrow-line"></span>
                <p className="ref-eyebrow text-signal">// RECRUITMENT &amp; INDUCTIONS · COLLEGIATE SOCIETY</p>
              </div>
              <h1 className="ref-join-page-heading">
                Step Onto The
                <span className="text-signal" style={{ display: 'block' }}>Build Floor.</span>
              </h1>
            </div>
            <p className="join-lead-copy">
              Whether you want to engineer Formula cars, fabricate off-road buggies, develop hybrid powertrains, pilot
              autonomous UAVs, or drive corporate sponsorship and creative media — SAE BIT Sindri is where ambition
              meets the racetrack.
            </p>
          </div>
        </div>
      </div>

      <div className="ref-container join-main-container" style={{ position: 'relative' }}>
        {/* Season Recruitment Callout Banner */}
        <div data-reveal className="reveal-up join-banner">
          <div className="join-banner-content">
            <span className="join-live-pill">
              <span className="live-beacon-dot" aria-hidden="true"></span>
              SEASON INDUCTIONS OPEN · BATCHES 2K24 &amp; 2K25
            </span>
            <h2>Ready to Build Something Extraordinary?</h2>
            <p>
              Open to freshers and second-year students from all engineering branches. No prior workshop or motorsport
              experience required — we provide hands-on fabrication training, CAD/CAE mentorship, and track-ready skills.
            </p>
            <div className="join-banner-chips">
              <span className="join-banner-chip">🏎️ 4 Specialized Crews</span>
              <span className="join-banner-chip">🛠️ Hands-on Workshop Access</span>
              <span className="join-banner-chip">🏆 National Competitions (BAJA · SUPRA)</span>
              <span className="join-banner-chip">👥 All Engineering Branches Welcome</span>
            </div>
          </div>
          <div className="join-banner-action">
            <a href="#join-application" className="btn-join-primary" id="scrollApplyBtn" onClick={scrollToApply}>
              Apply For Inductions <span className="btn-arrow" aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        {/* Section 1: Why Join SAE BIT Sindri */}
        <div data-reveal className="reveal-up join-section-head">
          <span className="join-section-tag">// CORE CHAPTER ADVANTAGES</span>
          <h2>Why Join SAE BIT Sindri?</h2>
          <span className="team-blurb">What awaits you when you step into our design and fabrication bay</span>
        </div>

        <div className="join-grid">
          <div data-reveal className="reveal-up join-card">
            <div>
              <div className="join-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <h3>Real-World Engineering</h3>
              <p>
                Go beyond textbook theory. Work with industry-standard CAD/CAE tools (SolidWorks, ANSYS), machine custom
                components in the workshop, weld chassis frames, and tune vehicle dynamics.
              </p>
            </div>
            <div className="join-card-tags">
              <span className="join-card-tag">CAD / FEA Design</span>
              <span className="join-card-tag">TIG Welding &amp; CNC</span>
              <span className="join-card-tag">Track Telemetry</span>
            </div>
          </div>

          <div data-reveal className="reveal-up join-card">
            <div>
              <div className="join-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3>Tier-1 National Competitions</h3>
              <p>
                Represent BIT Sindri on India's premier collegiate motorsports stages — BAJA SAE India, SUPRA Formula
                Student, EFFICYCLE, and national Aerothon flight challenges against top IITs and NITs.
              </p>
            </div>
            <div className="join-card-tags">
              <span className="join-card-tag">BAJA SAE India</span>
              <span className="join-card-tag">SUPRA Formula Student</span>
              <span className="join-card-tag">EFFICYCLE Hybrid</span>
            </div>
          </div>

          <div data-reveal className="reveal-up join-card">
            <div>
              <div className="join-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>Cross-Discipline Brotherhood</h3>
              <p>
                Join an active fraternity of mechanical, electrical, electronics, computer science, and core engineering
                students collaborating day and night to build competition-ready machines.
              </p>
            </div>
            <div className="join-card-tags">
              <span className="join-card-tag">All Branches Welcome</span>
              <span className="join-card-tag">Hands-on Culture</span>
              <span className="join-card-tag">Lifelong Brotherhood</span>
            </div>
          </div>

          <div data-reveal className="reveal-up join-card">
            <div>
              <div className="join-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3>Alumni &amp; Industry Network</h3>
              <p>
                Direct mentorship and career guidance from chapter alumni leading engineering divisions across top global
                automotive, aerospace, and robotics giants.
              </p>
            </div>
            <div className="join-card-tags">
              <span className="join-card-tag">Tata Motors</span>
              <span className="join-card-tag">Mahindra Racing</span>
              <span className="join-card-tag">Boeing &amp; ISRO</span>
            </div>
          </div>
        </div>

        {/* Section 2: Explore Our Teams & Disciplines */}
        <div data-reveal className="reveal-up join-section-head">
          <span className="join-section-tag">// RACING CREWS &amp; WINGS</span>
          <h2>Explore Our Teams &amp; Domains</h2>
          <span className="team-blurb">Select the engineering discipline or operational wing where you want to make an impact</span>
        </div>

        <div className="crews-grid">
          {/* Team Wonders */}
          <div data-reveal className="reveal-up crew-card">
            <div>
              <div className="crew-header-top">
                <span className="crew-tag">OFF-ROAD &amp; HYBRID</span>
                <span className="crew-comp-badge">BAJA &amp; EFFICYCLE</span>
              </div>
              <h3>Team Wonders</h3>
              <p className="crew-desc">
                Constructs rugged all-terrain buggies for BAJA SAE India and eco-friendly hybrid human-electric vehicles
                for EFFICYCLE, built to tackle steep rocks, deep mud, and brutal endurance tracks.
              </p>
              <span className="crew-subdomains-title">// Core Specializations:</span>
              <div className="crew-subdomains">
                <span className="domain-pill">Roll Cage &amp; Chassis</span>
                <span className="domain-pill">Suspension &amp; Steering Dynamics</span>
                <span className="domain-pill">Powertrain &amp; Gearbox</span>
                <span className="domain-pill">Hydraulic Braking</span>
                <span className="domain-pill">Hybrid Electric Drive</span>
              </div>
            </div>
            <button
              type="button"
              className="crew-select-btn"
              onClick={() => selectCrewAndScroll('Team Wonders (BAJA / EFFICYCLE)', 'Chassis & Roll Cage')}
            >
              <span>Select Team Wonders in Form</span>
              <span aria-hidden="true">↓</span>
            </button>
          </div>

          {/* Team Spitfire */}
          <div data-reveal className="reveal-up crew-card">
            <div>
              <div className="crew-header-top">
                <span className="crew-tag">FORMULA STUDENT</span>
                <span className="crew-comp-badge">SUPRA SAE INDIA</span>
              </div>
              <h3>Team Spitfire</h3>
              <p className="crew-desc">
                Engineers single-seater, high-revving open-wheel race cars designed for circuit cornering, aerodynamic
                downforce, electronic telemetry, and explosive straight-line acceleration.
              </p>
              <span className="crew-subdomains-title">// Core Specializations:</span>
              <div className="crew-subdomains">
                <span className="domain-pill">Aerodynamics &amp; CFD Wings</span>
                <span className="domain-pill">Spaceframe Chassis</span>
                <span className="domain-pill">Engine Tuning &amp; ECU</span>
                <span className="domain-pill">Telemetry &amp; DAQ Sensors</span>
                <span className="domain-pill">Composite Materials</span>
              </div>
            </div>
            <button
              type="button"
              className="crew-select-btn"
              onClick={() => selectCrewAndScroll('Team Spitfire (SUPRA)', 'Aerodynamics & CFD')}
            >
              <span>Select Team Spitfire in Form</span>
              <span aria-hidden="true">↓</span>
            </button>
          </div>

          {/* Vayu Wing */}
          <div data-reveal className="reveal-up crew-card">
            <div>
              <div className="crew-header-top">
                <span className="crew-tag">AEROSPACE &amp; UAV</span>
                <span className="crew-comp-badge">AEROTHON &amp; DRONES</span>
              </div>
              <h3>Vayu Wing</h3>
              <p className="crew-desc">
                Designs and fabricates fixed-wing RC aircraft, autonomous multirotors, and payload delivery UAVs for
                national aerospace challenges, aerial surveying, and flight dynamics testing.
              </p>
              <span className="crew-subdomains-title">// Core Specializations:</span>
              <div className="crew-subdomains">
                <span className="domain-pill">Airframe &amp; Aerofoil Design</span>
                <span className="domain-pill">Avionics &amp; Flight Controllers</span>
                <span className="domain-pill">Autonomous GPS Navigation</span>
                <span className="domain-pill">Payload Release Mechanisms</span>
                <span className="domain-pill">Radio &amp; FPV Systems</span>
              </div>
            </div>
            <button
              type="button"
              className="crew-select-btn"
              onClick={() => selectCrewAndScroll('Vayu (Aero & UAV)', 'Avionics & Drone Control')}
            >
              <span>Select Vayu Wing in Form</span>
              <span aria-hidden="true">↓</span>
            </button>
          </div>

          {/* Management & Media */}
          <div data-reveal className="reveal-up crew-card">
            <div>
              <div className="crew-header-top">
                <span className="crew-tag">OPERATIONS &amp; CREATIVE</span>
                <span className="crew-comp-badge">CHAPTER MANAGEMENT</span>
              </div>
              <h3>Management &amp; Media</h3>
              <p className="crew-desc">
                The strategic backbone powering chapter operations — securing corporate sponsorships, orchestrating
                nationwide event logistics, curating digital media, and building software infrastructure.
              </p>
              <span className="crew-subdomains-title">// Core Specializations:</span>
              <div className="crew-subdomains">
                <span className="domain-pill">Corporate Sponsorship</span>
                <span className="domain-pill">Cinematography &amp; Media</span>
                <span className="domain-pill">Web Architecture &amp; Tech</span>
                <span className="domain-pill">Public Relations &amp; Press</span>
                <span className="domain-pill">Event Logistics &amp; Finance</span>
              </div>
            </div>
            <button
              type="button"
              className="crew-select-btn"
              onClick={() => selectCrewAndScroll('Operations & Sponsorship', 'Sponsorship & Finance')}
            >
              <span>Select Management &amp; Media in Form</span>
              <span aria-hidden="true">↓</span>
            </button>
          </div>
        </div>

        {/* Section 3: Induction Process Timeline */}
        <div data-reveal className="reveal-up join-section-head">
          <span className="join-section-tag">// SELECTION ROADMAP</span>
          <h2>The 5-Step Induction Process</h2>
          <span className="team-blurb">A beginner-friendly roadmap designed to evaluate your curiosity, grit, and passion</span>
        </div>

        <div className="induction-steps">
          <div data-reveal className="reveal-up step-card">
            <div className="step-card-header">
              <span className="step-num">01</span>
              <span className="step-phase-badge">Phase 01</span>
            </div>
            <div className="step-info">
              <h4>Online Registration</h4>
              <p>Fill out the application form below with your branch, batch, and crew preferences.</p>
            </div>
            <div className="step-status-chip">
              <span className="live-beacon-dot" aria-hidden="true" style={{ width: 5, height: 5 }}></span>
              Open Now
            </div>
          </div>

          <div data-reveal className="reveal-up step-card">
            <div className="step-card-header">
              <span className="step-num">02</span>
              <span className="step-phase-badge">Phase 02</span>
            </div>
            <div className="step-info">
              <h4>Orientation Session</h4>
              <p>Attend our interactive walkthrough covering vehicle architecture, rulebooks, and season roadmaps.</p>
            </div>
            <div className="step-status-chip">
              <span>✦</span> On-Campus Session
            </div>
          </div>

          <div data-reveal className="reveal-up step-card">
            <div className="step-card-header">
              <span className="step-num">03</span>
              <span className="step-phase-badge">Phase 03</span>
            </div>
            <div className="step-info">
              <h4>Aptitude &amp; Task</h4>
              <p>A hands-on, domain-specific challenge testing foundational thinking, creativity, and problem-solving.</p>
            </div>
            <div className="step-status-chip">
              <span>✦</span> Hands-On Mini Task
            </div>
          </div>

          <div data-reveal className="reveal-up step-card">
            <div className="step-card-header">
              <span className="step-num">04</span>
              <span className="step-phase-badge">Phase 04</span>
            </div>
            <div className="step-info">
              <h4>Personal Interaction</h4>
              <p>One-on-one conversation with chapter leads to understand your passion, availability, and drive.</p>
            </div>
            <div className="step-status-chip">
              <span>✦</span> Interview &amp; Fit
            </div>
          </div>

          <div data-reveal className="reveal-up step-card">
            <div className="step-card-header">
              <span className="step-num">05</span>
              <span className="step-phase-badge">Phase 05</span>
            </div>
            <div className="step-info">
              <h4>Workshop Onboarding</h4>
              <p>Join your assigned crew, receive safety gear training, and start building for national competitions!</p>
            </div>
            <div className="step-status-chip">
              <span>✦</span> Welcome to Garage
            </div>
          </div>
        </div>

        {/* Section 4: Application Form */}
        <div className="join-form-wrapper" id="join-application">
          <div data-reveal className="reveal-up join-form-card">
            <div className="form-header">
              <span className="eyebrow">// OFFICIAL CHAPTER REGISTRATION</span>
              <h2>Apply to Join SAE BIT Sindri</h2>
              <p>
                Fill out this official registration form for the upcoming build season. All submissions are reviewed by
                the senior council. You will receive orientation venue and schedule updates via WhatsApp and email.
              </p>
              <div className="form-notice-box">
                <span aria-hidden="true">🔒</span>
                <span>
                  <strong>Admissions Notice:</strong> Open to all BIT Sindri students regardless of prior experience. No
                  technical prerequisites required.
                </span>
              </div>
            </div>

            {!submitted ? (
              <form id="joinForm" className="join-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="applicantName">
                      <span>Full Name <span className="required-star">*</span></span>
                    </label>
                    <input
                      type="text"
                      id="applicantName"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <span className="form-hint">Enter your full official college name</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="applicantRoll">
                      <span>Roll Number / Reg. ID <span className="required-star">*</span></span>
                    </label>
                    <input
                      type="text"
                      id="applicantRoll"
                      required
                      placeholder="e.g. 24/ME/045 or 2K24/082"
                      value={formData.roll}
                      onChange={(e) => setFormData({ ...formData, roll: e.target.value })}
                    />
                    <span className="form-hint">Official BIT Sindri roll or registration number</span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="applicantBranch">
                      <span>Engineering Branch <span className="required-star">*</span></span>
                    </label>
                    <select
                      id="applicantBranch"
                      required
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    >
                      <option value="" disabled>Select your branch</option>
                      <option value="Mechanical">Mechanical Engineering</option>
                      <option value="Electrical">Electrical Engineering</option>
                      <option value="ECE">Electronics &amp; Communication Engineering (ECE)</option>
                      <option value="Production">Production &amp; Industrial Engineering</option>
                      <option value="Civil">Civil Engineering</option>
                      <option value="Computer Science">Computer Science &amp; Engineering (CSE)</option>
                      <option value="IT">Information Technology (IT)</option>
                      <option value="Chemical">Chemical Engineering</option>
                      <option value="Metallurgy">Metallurgical Engineering</option>
                      <option value="Mining">Mining Engineering</option>
                    </select>
                    <span className="form-hint">Students of all 10 branches are eligible</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="applicantYear">
                      <span>Current Academic Year <span className="required-star">*</span></span>
                    </label>
                    <select
                      id="applicantYear"
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    >
                      <option value="" disabled>Select your academic year</option>
                      <option value="1st Year (Freshers - 2K25)">1st Year (Freshers / Batch 2K25)</option>
                      <option value="2nd Year (Batch 2K24)">2nd Year (Sophomores / Batch 2K24)</option>
                      <option value="3rd Year (Batch 2K23)">3rd Year (Pre-final / Batch 2K23)</option>
                    </select>
                    <span className="form-hint">Freshers and 2nd years given induction priority</span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="applicantEmail">
                      <span>Email Address <span className="required-star">*</span></span>
                    </label>
                    <input
                      type="email"
                      id="applicantEmail"
                      required
                      placeholder="name@bitsindri.ac.in or personal email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <span className="form-hint">We will email you the orientation schedule</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="applicantPhone">
                      <span>WhatsApp / Contact Number <span className="required-star">*</span></span>
                    </label>
                    <input
                      type="tel"
                      id="applicantPhone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <span className="form-hint">Used for official WhatsApp induction group updates</span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="applicantCrew">
                      <span>Primary Crew Preference <span className="required-star">*</span></span>
                    </label>
                    <select
                      id="applicantCrew"
                      required
                      value={formData.crew}
                      onChange={(e) => setFormData({ ...formData, crew: e.target.value })}
                    >
                      <option value="" disabled>Select primary preference</option>
                      <option value="Team Wonders (BAJA / EFFICYCLE)">Team Wonders (BAJA / EFFICYCLE - Off-road)</option>
                      <option value="Team Spitfire (SUPRA)">Team Spitfire (SUPRA - Formula Student)</option>
                      <option value="Vayu (Aero & UAV)">Vayu Wing (Drones &amp; RC Aircraft)</option>
                      <option value="Robotics Wing">Robotics Wing (Autonomous &amp; Embedded)</option>
                      <option value="Operations &amp; Sponsorship">Operations, Corporate Sponsorship &amp; PR</option>
                      <option value="Media &amp; Web Design">Media, Graphic Design &amp; Web Development</option>
                    </select>
                    <span className="form-hint">You can change preferences during the orientation</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="applicantSubdomain">
                      <span>Sub-domain of Interest</span>
                    </label>
                    <select
                      id="applicantSubdomain"
                      value={formData.subdomain}
                      onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                    >
                      <option value="">No preference / Open to all</option>
                      <option value="Chassis & Roll Cage">Chassis &amp; Roll Cage Fabrication</option>
                      <option value="Suspension & Steering">Suspension &amp; Steering Dynamics</option>
                      <option value="Powertrain & Drivetrain">Powertrain, Engine &amp; Gearbox</option>
                      <option value="Braking Systems">Hydraulic Braking Systems</option>
                      <option value="Electronics & DAQ">Electronics, Sensors &amp; Telemetry</option>
                      <option value="Aerodynamics & CFD">Aerodynamics &amp; CFD Wing Design</option>
                      <option value="Avionics & Drone Control">Avionics, Drones &amp; Flight Controllers</option>
                      <option value="Sponsorship & Finance">Corporate Sponsorship &amp; Finance</option>
                      <option value="Media & Documentation">Cinematography, Graphics &amp; Social Media</option>
                    </select>
                    <span className="form-hint">Select a domain or leave open to explore</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="applicantMotivation">
                    <span>Why do you want to join SAE BIT Sindri? <span className="required-star">*</span></span>
                  </label>
                  <textarea
                    id="applicantMotivation"
                    rows={4}
                    required
                    placeholder="Tell us about your interests, past projects or hobbies (if any), and what excites you about motorsports, aerospace, or automotive engineering..."
                    value={formData.motivation}
                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  ></textarea>
                  <span className="form-hint">Briefly explain your passion, curiosity, and what you hope to learn</span>
                </div>

                <button type="submit" className="btn-join-primary join-submit-btn">
                  <span>Submit Application for Review</span>
                  <span className="btn-arrow" aria-hidden="true">→</span>
                </button>
              </form>
            ) : (
              <div id="joinSuccessMsg" className="join-success">
                <div className="success-icon-wrap" aria-hidden="true">✓</div>
                <h3>Application Successfully Recorded!</h3>
                <p className="join-success-lead">
                  Thank you, <strong>{formData.name || 'Applicant'}</strong>! Your candidate profile has been recorded in
                  the official recruitment roster of SAE India BIT Sindri Collegiate Society.
                </p>

                <div className="receipt-card">
                  <span className="receipt-title">// Candidate Registration Receipt</span>
                  <dl className="receipt-grid">
                    <div className="receipt-item">
                      <dt>Candidate Name</dt>
                      <dd>{formData.name}</dd>
                    </div>
                    <div className="receipt-item">
                      <dt>Roll Number</dt>
                      <dd>{formData.roll}</dd>
                    </div>
                    <div className="receipt-item">
                      <dt>Branch &amp; Year</dt>
                      <dd>{formData.branch} · {formData.year}</dd>
                    </div>
                    <div className="receipt-item">
                      <dt>Preferred Crew</dt>
                      <dd>{formData.crew || 'General Society Induction'}</dd>
                    </div>
                    <div className="receipt-item">
                      <dt>Submission Time</dt>
                      <dd>{submissionTime || 'Just now'}</dd>
                    </div>
                    <div className="receipt-item">
                      <dt>Status</dt>
                      <dd style={{ color: '#22c55e' }}>Pending Orientation Review</dd>
                    </div>
                  </dl>

                  <div className="receipt-instructions">
                    <strong>Next Steps:</strong> Check your WhatsApp (<code>{formData.phone}</code>) and Email (
                    <code>{formData.email}</code>) within 48 hours for the on-campus orientation venue and timing details.
                  </div>
                </div>

                <button type="button" className="btn-reset-form" id="resetJoinFormBtn" onClick={handleReset}>
                  <span>Submit Another Response</span>
                  <span aria-hidden="true">↺</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 5: Frequently Asked Questions */}
        <div data-reveal className="reveal-up join-section-head">
          <span className="join-section-tag">// APPLICANT FAQS</span>
          <h2>Frequently Asked Questions</h2>
          <span className="team-blurb">Common queries from aspiring collegiate society members</span>
        </div>

        <div className="faq-grid">
          <div data-reveal className="reveal-up faq-card">
            <h4>
              <span className="faq-q-glyph">Q.</span>
              Do I need prior technical, automotive, or CAD experience?
            </h4>
            <p>
              No prior technical experience is required. What matters most is your curiosity, work ethic, and dedication
              to learn. Senior leads provide structured training covering SolidWorks CAD, vehicle architecture, workshop
              tools, and fabrication safety protocols.
            </p>
          </div>

          <div data-reveal className="reveal-up faq-card">
            <h4>
              <span className="faq-q-glyph">Q.</span>
              Are non-mechanical branches eligible to apply?
            </h4>
            <p>
              Absolutely! Modern race cars and autonomous UAVs rely heavily on electronic DAQ, sensors, battery management
              systems, microcontrollers, engine tuning maps, and telemetry code — plus our society relies on talented
              students for media, sponsorship, web systems, and operations.
            </p>
          </div>

          <div data-reveal className="reveal-up faq-card">
            <h4>
              <span className="faq-q-glyph">Q.</span>
              How will society work affect my academic schedule?
            </h4>
            <p>
              Academics are always the primary priority. Workshop sessions are held during post-class evenings and weekends.
              During semester examinations and mid-terms, society activities are intentionally paused so all members can focus
              on their studies.
            </p>
          </div>

          <div data-reveal className="reveal-up faq-card">
            <h4>
              <span className="faq-q-glyph">Q.</span>
              Where is the SAE BIT Sindri workshop located?
            </h4>
            <p>
              Our dedicated design lab, mechanical fabrication bay, and vehicle testing garage are located within the
              Department of Mechanical Engineering, BIT Sindri campus.
            </p>
          </div>

          <div data-reveal className="reveal-up faq-card">
            <h4>
              <span className="faq-q-glyph">Q.</span>
              Can first-year students represent the college at national competitions?
            </h4>
            <p>
              Yes! Freshers who demonstrate consistency, dedication, and technical competence are actively selected as part
              of the competition traveling contingent to national tracks (BAJA, SUPRA, and EFFICYCLE).
            </p>
          </div>

          <div data-reveal className="reveal-up faq-card">
            <h4>
              <span className="faq-q-glyph">Q.</span>
              What should I prepare for the orientation &amp; aptitude task?
            </h4>
            <p>
              Just bring an inquisitive mindset and passion for problem-solving! The aptitude challenge tests basic logical
              thinking, visualization, and willingness to learn rather than obscure textbook memorization.
            </p>
          </div>
        </div>

        {/* Support & Contact Strip */}
        <div data-reveal className="reveal-up join-contact-box">
          <div className="join-contact-info">
            <h4>Still Have Questions About Inductions?</h4>
            <p>Reach out to our recruitment coordinators or visit us at the Mechanical Engineering Workshop Bay.</p>
          </div>
          <div className="join-contact-actions">
            <a href="mailto:saeindia.bitsindri@gmail.com" className="join-contact-link">
              ✉ Email: saeindia.bitsindri@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
