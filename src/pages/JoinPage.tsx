import React, { useState } from 'react';

interface JoinPageProps {
  isActive: boolean;
}

export const JoinPage: React.FC<JoinPageProps> = ({ isActive }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <section className={`page ${isActive ? 'active' : ''}`} id="page-join">
      <div className="page-head">
        <span className="eyebrow">// RECRUITMENT &amp; INDUCTIONS</span>
        <h1>Join Our Crew</h1>
        <p className="sub">
          Step onto the build floor. Whether you want to engineer race cars, fabricate off-road buggies,
          develop hybrid powertrains, fly UAVs, or drive sponsorship and digital media — SAE India BIT Sindri is where
          theory meets the track.
        </p>
      </div>

      {/* Hero Callout Banner */}
      <div className="join-banner">
        <div className="join-banner-content">
          <span className="badge mono">SEASON RECRUITMENT OPEN</span>
          <h2>Ready to Build Something Extraordinary?</h2>
          <p>
            We welcome freshers and second-year students from all engineering branches. No prior experience required —
            bring curiosity, grit, and passion for motorsports and aerospace.
          </p>
        </div>
        <div className="join-banner-action">
          <a href="#join-application" className="btn btn-primary" id="scrollApplyBtn" onClick={scrollToApply}>
            Apply Now
          </a>
        </div>
      </div>

      {/* Why Join Us Cards */}
      <div className="join-section-head">
        <h2>Why Join SAE BIT Sindri?</h2>
        <span className="team-blurb">What awaits you on the build floor</span>
      </div>
      <div className="join-grid">
        <div className="join-card">
          <div className="join-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <h3>Real-World Engineering</h3>
          <p>
            Go beyond textbooks. Work with CAD/CAE tools (SolidWorks, ANSYS), machine components in the workshop, weld
            chassis frames, and test vehicle dynamics.
          </p>
        </div>
        <div className="join-card">
          <div className="join-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h3>National Competitions</h3>
          <p>
            Represent BIT Sindri at India's highest-tier collegiate motorsports challenges — BAJA SAE India, SUPRA
            Formula Student, EFFICYCLE, and Aerothon.
          </p>
        </div>
        <div className="join-card">
          <div className="join-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3>Cross-Discipline Brotherhood</h3>
          <p>
            Join an active fraternity of mechanical, electrical, electronics, computer science, and core branch
            engineers collaborating day and night.
          </p>
        </div>
        <div className="join-card">
          <div className="join-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h3>Alumni &amp; Industry Network</h3>
          <p>
            Direct mentorship from chapter alumni working across top global automotive, aerospace, EV and robotics
            firms (Tata Motors, Mahindra, Maruti, Boeing, ISRO).
          </p>
        </div>
      </div>

      {/* Four Crews & Open Domains */}
      <div className="join-section-head" style={{ marginTop: '56px' }}>
        <h2>Explore Our Teams &amp; Domains</h2>
        <span className="team-blurb">Choose the discipline where you want to make an impact</span>
      </div>
      <div className="crews-grid">
        <div className="crew-card">
          <div className="crew-header">
            <span className="crew-tag mono">OFF-ROAD &amp; HYBRID</span>
            <h3>Team Wonders</h3>
          </div>
          <p className="crew-desc">
            Constructs rugged all-terrain vehicles for BAJA SAE India and eco-hybrid vehicles for EFFICYCLE.
          </p>
          <div className="crew-subdomains">
            <span className="domain-pill">Roll Cage &amp; Chassis</span>
            <span className="domain-pill">Suspension &amp; Steering</span>
            <span className="domain-pill">Powertrain &amp; Brakes</span>
            <span className="domain-pill">Hybrid Drive</span>
          </div>
        </div>
        <div className="crew-card">
          <div className="crew-header">
            <span className="crew-tag mono">FORMULA STUDENT</span>
            <h3>Team Spitfire</h3>
          </div>
          <p className="crew-desc">
            Engineers high-speed, Formula-style race cars built for track cornering, acceleration, and aerodynamic grip.
          </p>
          <div className="crew-subdomains">
            <span className="domain-pill">Aerodynamics &amp; CFD</span>
            <span className="domain-pill">Drivetrain &amp; Engine Tuning</span>
            <span className="domain-pill">Telemetry &amp; DAQ</span>
            <span className="domain-pill">Composite Materials</span>
          </div>
        </div>
        <div className="crew-card">
          <div className="crew-header">
            <span className="crew-tag mono">AEROSPACE &amp; UAV</span>
            <h3>Vayu Wing</h3>
          </div>
          <p className="crew-desc">
            Designs fixed-wing RC planes and autonomous multirotor UAVs for national flight and payload competitions.
          </p>
          <div className="crew-subdomains">
            <span className="domain-pill">Airframe Design</span>
            <span className="domain-pill">Avionics &amp; Flight Controllers</span>
            <span className="domain-pill">Autonomous Navigation</span>
            <span className="domain-pill">Payload Systems</span>
          </div>
        </div>
        <div className="crew-card">
          <div className="crew-header">
            <span className="crew-tag mono">OPERATIONS &amp; CREATIVE</span>
            <h3>Management &amp; Media</h3>
          </div>
          <p className="crew-desc">
            The backbone of chapter operations — securing industry sponsors, orchestrating logistics, and crafting visual media.
          </p>
          <div className="crew-subdomains">
            <span className="domain-pill">Corporate Sponsorship</span>
            <span className="domain-pill">Social Media &amp; PR</span>
            <span className="domain-pill">Web &amp; Graphics</span>
            <span className="domain-pill">Event Management</span>
          </div>
        </div>
      </div>

      {/* Induction Process Timeline */}
      <div className="join-section-head" style={{ marginTop: '56px' }}>
        <h2>The Induction Process</h2>
        <span className="team-blurb">Five simple steps to earn your spot on the team</span>
      </div>
      <div className="induction-steps">
        <div className="step-card">
          <div className="step-num mono">01</div>
          <div className="step-info">
            <h4>Online Registration</h4>
            <p>Fill out the application form below with your branch, batch, and crew preferences.</p>
          </div>
        </div>
        <div className="step-card">
          <div className="step-num mono">02</div>
          <div className="step-info">
            <h4>Orientation Session</h4>
            <p>Attend our interactive walkthrough covering vehicle architecture, rulebooks, and season roadmaps.</p>
          </div>
        </div>
        <div className="step-card">
          <div className="step-num mono">03</div>
          <div className="step-info">
            <h4>Aptitude &amp; Task</h4>
            <p>A hands-on, domain-specific challenge testing foundational thinking, creativity, and problem-solving.</p>
          </div>
        </div>
        <div className="step-card">
          <div className="step-num mono">04</div>
          <div className="step-info">
            <h4>Personal Interview</h4>
            <p>One-on-one conversation with chapter leads to understand your passion, availability, and drive.</p>
          </div>
        </div>
        <div className="step-card">
          <div className="step-num mono">05</div>
          <div className="step-info">
            <h4>Workshop Onboarding</h4>
            <p>Join your assigned crew, receive safety gear training, and start building for the competition!</p>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="join-form-wrapper" id="join-application">
        <div className="join-form-card">
          <div className="form-header">
            <span className="eyebrow mono">// APPLICATION FORM</span>
            <h2>Apply to Join SAE India BIT Sindri</h2>
            <p>
              Fill out this form to register your interest for the upcoming build season. Our recruitment team will get
              in touch with you.
            </p>
          </div>

          {!submitted ? (
            <form id="joinForm" className="join-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="applicantName">Full Name *</label>
                  <input
                    type="text"
                    id="applicantName"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="applicantRoll">Roll Number / Reg. No *</label>
                  <input
                    type="text"
                    id="applicantRoll"
                    required
                    placeholder="e.g. 23/ME/045"
                    value={formData.roll}
                    onChange={(e) => setFormData({ ...formData, roll: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="applicantBranch">Engineering Branch *</label>
                  <select
                    id="applicantBranch"
                    required
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  >
                    <option value="" disabled>Select your branch</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Electrical">Electrical Engineering</option>
                    <option value="ECE">Electronics &amp; Communication (ECE)</option>
                    <option value="Production">Production &amp; Industrial</option>
                    <option value="Civil">Civil Engineering</option>
                    <option value="Computer Science">Computer Science &amp; Engineering</option>
                    <option value="IT">Information Technology</option>
                    <option value="Chemical">Chemical Engineering</option>
                    <option value="Metallurgy">Metallurgical Engineering</option>
                    <option value="Mining">Mining Engineering</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="applicantYear">Current Year *</label>
                  <select
                    id="applicantYear"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  >
                    <option value="" disabled>Select your year</option>
                    <option value="1st Year (Fresher)">1st Year (Freshers)</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="applicantEmail">Email Address *</label>
                  <input
                    type="email"
                    id="applicantEmail"
                    required
                    placeholder="name@bitsindri.ac.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="applicantPhone">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    id="applicantPhone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="applicantCrew">Preferred Crew / Wing *</label>
                  <select
                    id="applicantCrew"
                    required
                    value={formData.crew}
                    onChange={(e) => setFormData({ ...formData, crew: e.target.value })}
                  >
                    <option value="" disabled>Select primary preference</option>
                    <option value="Team Wonders (BAJA / EFFICYCLE)">Team Wonders (BAJA / EFFICYCLE - Off-road)</option>
                    <option value="Team Spitfire (SUPRA)">Team Spitfire (SUPRA - Formula Student)</option>
                    <option value="Vayu (Aero &amp; UAV)">Vayu Wing (Drones &amp; RC Aircraft)</option>
                    <option value="Robotics Wing">Robotics Wing (Autonomous &amp; Embedded)</option>
                    <option value="Operations &amp; Sponsorship">Operations, Sponsorship &amp; PR</option>
                    <option value="Media &amp; Web Design">Media, Graphic Design &amp; Web</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="applicantSubdomain">Primary Sub-domain of Interest</label>
                  <select
                    id="applicantSubdomain"
                    value={formData.subdomain}
                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                  >
                    <option value="">No preference / Open to all</option>
                    <option value="Chassis &amp; Roll Cage">Chassis &amp; Frame Fabrication</option>
                    <option value="Suspension &amp; Steering">Suspension &amp; Steering Dynamics</option>
                    <option value="Powertrain &amp; Drivetrain">Powertrain &amp; Engine Tuning</option>
                    <option value="Braking Systems">Braking Systems</option>
                    <option value="Electronics &amp; DAQ">Electronics, Sensors &amp; DAQ</option>
                    <option value="Aerodynamics &amp; CFD">Aerodynamics &amp; CFD</option>
                    <option value="Avionics &amp; Drone Control">Avionics &amp; Drone Controls</option>
                    <option value="Sponsorship &amp; Finance">Sponsorship &amp; Finance</option>
                    <option value="Media &amp; Documentation">Media, Video &amp; Documentation</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="applicantMotivation">Why do you want to join SAE BIT Sindri? *</label>
                <textarea
                  id="applicantMotivation"
                  rows={4}
                  required
                  placeholder="Tell us about your interests, past projects or hobbies (if any), and what drives you to join our collegiate club..."
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary join-submit-btn">
                Submit Application
              </button>
            </form>
          ) : (
            <div id="joinSuccessMsg" className="join-success">
              <div className="success-icon">✓</div>
              <h3>Application Received!</h3>
              <p id="successDetailsText">
                Thank you, {formData.name || 'Applicant'}! Your application for {formData.crew || 'our crew'}{' '}
                ({formData.branch || 'BIT Sindri'}) has been recorded. Our recruitment coordinators will review
                your submission and contact you via email and WhatsApp for the orientation session.
              </p>
              <button type="button" className="btn btn-ghost" id="resetJoinFormBtn" onClick={handleReset}>
                Submit Another Response
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="join-section-head" style={{ marginTop: '56px' }}>
        <h2>Frequently Asked Questions</h2>
        <span className="team-blurb">Common queries from aspiring applicants</span>
      </div>
      <div className="faq-grid">
        <div className="faq-card">
          <h4>Do I need prior technical or automotive experience to join?</h4>
          <p>
            No prior experience is necessary. What matters most is your dedication, willingness to learn, and readiness
            to invest time on the build floor. Seniors provide comprehensive training and mentorship.
          </p>
        </div>
        <div className="faq-card">
          <h4>Are non-mechanical branches eligible to apply?</h4>
          <p>
            Absolutely! Modern vehicles and drones require electrical systems, battery management, sensors,
            microcontrollers, embedded code, telemetry, and software — plus our club needs dedicated operations,
            sponsorship, and media leads.
          </p>
        </div>
        <div className="faq-card">
          <h4>How much time commitment is expected?</h4>
          <p>
            During regular academic weeks, members typically dedicate a few hours in the evenings or weekends. Closer
            to national competition deadlines, work ramps up during build sessions.
          </p>
        </div>
        <div className="faq-card">
          <h4>Where is the SAE Club workshop located?</h4>
          <p>
            Our workshop and fabrication bay are situated in the Department of Mechanical Engineering, BIT Sindri
            campus. You can visit us anytime during club working hours.
          </p>
        </div>
      </div>
    </section>
  );
};
