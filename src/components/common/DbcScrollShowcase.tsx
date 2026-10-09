import React, { useEffect, useRef } from 'react';

export const DbcScrollShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dbcSection = sectionRef.current;
    if (!dbcSection) return;

    const steps = Array.from(dbcSection.querySelectorAll<HTMLElement>('.dbc-pipeline-step'));
    const pills = Array.from(dbcSection.querySelectorAll<HTMLElement>('.dbc-pill'));
    if (!steps.length) return;

    let currentActiveIndex = 0;

    function setActiveStep(activeIndex: number): void {
      if (activeIndex === currentActiveIndex) return;
      currentActiveIndex = activeIndex;

      steps.forEach((step, idx) => {
        const isActive = idx === activeIndex;
        step.classList.toggle('is-active', isActive);
        const card = step.querySelector<HTMLElement>('.dbc-card');
        if (card) card.classList.toggle('is-active', isActive);
      });

      pills.forEach((pill, idx) => {
        pill.classList.toggle('is-active', idx === activeIndex);
      });
    }

    function getStickyTop(): number {
      const header = document.querySelector('.ref-header') as HTMLElement | null;
      const headerHeight = header ? header.offsetHeight : (window.innerWidth <= 640 ? 60 : 70);
      if (window.innerWidth <= 380) return headerHeight + 2;
      if (window.innerWidth <= 640) return headerHeight + 8;
      if (window.innerWidth <= 1023) return headerHeight + 12;
      return headerHeight + 25;
    }

    function scrollToPhase(stepIndex: number): void {
      if (window.innerWidth < 1024) {
        const targetStep = steps[stepIndex];
        if (targetStep) {
          const header = document.querySelector('.ref-header') as HTMLElement | null;
          const headerHeight = header ? header.offsetHeight : 64;
          const pillsElem = dbcSection?.querySelector('.dbc-nav-pills') as HTMLElement | null;
          const pillsHeight = pillsElem ? pillsElem.offsetHeight : 45;
          const offset = headerHeight + pillsHeight + 16;
          const targetY = targetStep.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({
            top: targetY,
            behavior: 'smooth',
          });
          setActiveStep(stepIndex);
        }
        return;
      }

      if (!dbcSection) return;
      const stickyTop = getStickyTop();
      const totalScroll = dbcSection.offsetHeight - window.innerHeight;
      const sectionDocTop = window.scrollY + dbcSection.getBoundingClientRect().top;

      let targetProgress = 0.05;
      if (stepIndex === 1) targetProgress = 0.50;
      else if (stepIndex === 2) targetProgress = 0.88;

      const targetScrollY = sectionDocTop - stickyTop + totalScroll * targetProgress;
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });
      setActiveStep(stepIndex);
    }

    const pillListeners: Array<() => void> = [];
    pills.forEach((pill, idx) => {
      const handler = (e: Event) => {
        e.preventDefault();
        scrollToPhase(idx);
      };
      pill.addEventListener('click', handler);
      pillListeners.push(() => pill.removeEventListener('click', handler));
    });

    const stepListeners: Array<() => void> = [];
    steps.forEach((step, idx) => {
      const handler = () => {
        scrollToPhase(idx);
      };
      step.addEventListener('click', handler);
      stepListeners.push(() => step.removeEventListener('click', handler));
    });

    let ticking = false;
    function updateDeckOnScroll(): void {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!dbcSection) return;

          if (window.innerWidth < 1024) {
            steps.forEach((step) => {
              step.style.transform = '';
              step.style.opacity = '';
            });

            const viewportTrigger = window.innerHeight * 0.45;
            let bestIdx = 0;
            let minDistance = Infinity;

            steps.forEach((step, idx) => {
              const rect = step.getBoundingClientRect();
              const stepCenter = rect.top + rect.height / 2;
              const dist = Math.abs(stepCenter - viewportTrigger);
              if (dist < minDistance) {
                minDistance = dist;
                bestIdx = idx;
              }
            });

            setActiveStep(bestIdx);
            ticking = false;
            return;
          }

          const rect = dbcSection.getBoundingClientRect();
          const stickyTop = getStickyTop();
          const totalScroll = dbcSection.offsetHeight - window.innerHeight;

          if (totalScroll <= 0) {
            ticking = false;
            return;
          }

          const scrolled = Math.max(0, Math.min(totalScroll, -rect.top + stickyTop));
          const progress = scrolled / totalScroll; // 0.0 to 1.0

          // Step 0: Always in base position
          steps[0].style.transform = 'translateY(0%)';
          steps[0].style.opacity = '1';

          // Step 1: Slides up between 0.18 and 0.45
          const s1Start = 0.18;
          const s1End = 0.45;
          if (progress < s1Start) {
            steps[1].style.transform = 'translateY(105%)';
            steps[1].style.opacity = '0';
          } else if (progress <= s1End) {
            const t = (progress - s1Start) / (s1End - s1Start);
            steps[1].style.transform = `translateY(${(1 - t) * 105}%)`;
            steps[1].style.opacity = '1';
          } else {
            steps[1].style.transform = 'translateY(0%)';
            steps[1].style.opacity = '1';
          }

          // Step 2: Slides up between 0.55 and 0.82
          const s2Start = 0.55;
          const s2End = 0.82;
          if (progress < s2Start) {
            steps[2].style.transform = 'translateY(105%)';
            steps[2].style.opacity = '0';
          } else if (progress <= s2End) {
            const t = (progress - s2Start) / (s2End - s2Start);
            steps[2].style.transform = `translateY(${(1 - t) * 105}%)`;
            steps[2].style.opacity = '1';
          } else {
            steps[2].style.transform = 'translateY(0%)';
            steps[2].style.opacity = '1';
          }

          // Active phase pill and node highlight
          let activeIdx = 0;
          if (progress >= 0.68) {
            activeIdx = 2;
          } else if (progress >= 0.32) {
            activeIdx = 1;
          } else {
            activeIdx = 0;
          }

          setActiveStep(activeIdx);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', updateDeckOnScroll, { passive: true });
    window.addEventListener('resize', updateDeckOnScroll, { passive: true });
    updateDeckOnScroll();

    return () => {
      window.removeEventListener('scroll', updateDeckOnScroll);
      window.removeEventListener('resize', updateDeckOnScroll);
      pillListeners.forEach((cleanup) => cleanup());
      stepListeners.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <section className="dbc-pipeline-section" id="dbcShowcase" ref={sectionRef}>
      <div className="tech-grid dbc-bg-grid"></div>
      <div className="ref-container dbc-pipeline-container">
        {/* Split Layout: Left Sticky Header / Narrative & Right Vertical Pipeline */}
        <div className="dbc-pipeline-layout">
          {/* Left Side: Sticky Engineering Overview (Desktop) */}
          <div className="dbc-sticky-sidebar">
            <div className="dbc-sidebar-inner">
              <div className="team-eyebrow-row">
                <span className="team-eyebrow-line"></span>
                <p className="ref-eyebrow text-signal">// THE VELOCITY CYCLE</p>
              </div>
              <h2 className="dbc-heading">
                From Concept <span className="text-signal">to the Track.</span>
              </h2>
              <p className="dbc-sidebar-desc">
                Every racecar is an engineering masterclass. From computational simulation to precision workshop fabrication and national track warfare, here is our full lifecycle.
              </p>

              {/* Navigation Phase Pills */}
              <div className="dbc-nav-pills" role="tablist" aria-label="Velocity Cycle Phases">
                <button type="button" className="dbc-pill is-active" data-dbc-step="0" aria-label="Phase 01: Design">
                  <span className="dbc-pill-num">01</span>
                  <span className="dbc-pill-label">DESIGN</span>
                  <span className="dbc-pill-bar"></span>
                </button>
                <button type="button" className="dbc-pill" data-dbc-step="1" aria-label="Phase 02: Build">
                  <span className="dbc-pill-num">02</span>
                  <span className="dbc-pill-label">BUILD</span>
                  <span className="dbc-pill-bar"></span>
                </button>
                <button type="button" className="dbc-pill" data-dbc-step="2" aria-label="Phase 03: Compete">
                  <span className="dbc-pill-num">03</span>
                  <span className="dbc-pill-label">COMPETE</span>
                  <span className="dbc-pill-bar"></span>
                </button>
              </div>

              {/* Quick Telemetry Stats Widget */}
              <div className="dbc-sidebar-metrics">
                <div className="dbc-sidebar-metric-item">
                  <span className="mono text-signal">100%</span>
                  <span className="dbc-metric-caption">CAD Validation</span>
                </div>
                <div className="dbc-sidebar-metric-item">
                  <span className="mono text-white">4130</span>
                  <span className="dbc-metric-caption">Chassis Grade</span>
                </div>
                <div className="dbc-sidebar-metric-item">
                  <span className="mono text-signal">Podium</span>
                  <span className="dbc-metric-caption">National Track</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: The Vertical Pipeline Flow */}
          <div className="dbc-pipeline-feed">
            <div className="dbc-pipeline-track">
              {/* Glowing circuit spine */}
              <div className="dbc-pipeline-spine" aria-hidden="true"></div>

              {/* Phase 01: Design */}
              <div className="dbc-pipeline-step is-active" data-index="0">
                <div className="dbc-pipeline-node" aria-hidden="true">
                  <span className="dbc-node-pulse"></span>
                  <span className="dbc-node-num mono">01</span>
                </div>
                <article className="dbc-card is-active" data-index="0">
                  <div className="dbc-card-top-bar">
                    <span className="badge mono">// 01 · SIMULATION &amp; CAD</span>
                    <span className="dbc-card-num-watermark">01</span>
                  </div>
                  <h3 className="dbc-card-title">
                    Design<span className="text-signal">.</span>
                  </h3>
                  <p className="dbc-card-subtitle">Virtual Kinematics &amp; High-Downforce Aerodynamics</p>
                  <p className="dbc-card-desc">
                    Every championship machine begins in the digital wind tunnel. Our student engineering cohort uses SolidWorks, CATIA, and ANSYS to run structural FEA, calculate suspension kinematics, optimize spaceframe torsional rigidity, and simulate multi-element aerodynamic downforce before a single tube is cut.
                  </p>
                  <div className="dbc-card-tags">
                    <span className="ref-skill-pill">SolidWorks CAD</span>
                    <span className="ref-skill-pill">ANSYS Structural FEA</span>
                    <span className="ref-skill-pill">CFD Aerodynamics</span>
                    <span className="ref-skill-pill">Suspension Geometry</span>
                    <span className="ref-skill-pill">Weight Optimization</span>
                  </div>
                  <div className="dbc-card-footer">
                    <div className="dbc-metric">
                      <span className="dbc-metric-val mono text-signal">100%</span>
                      <span className="dbc-metric-label">Digital Validation</span>
                    </div>
                    <div className="dbc-metric">
                      <span className="dbc-metric-val mono text-white">&lt;0.05mm</span>
                      <span className="dbc-metric-label">CAD Tolerancing</span>
                    </div>
                    <div className="dbc-metric">
                      <span className="dbc-metric-val mono text-signal">3.2x</span>
                      <span className="dbc-metric-label">Torsional Rigidity</span>
                    </div>
                  </div>
                </article>
              </div>

              {/* Phase 02: Build */}
              <div className="dbc-pipeline-step" data-index="1">
                <div className="dbc-pipeline-node" aria-hidden="true">
                  <span className="dbc-node-pulse"></span>
                  <span className="dbc-node-num mono">02</span>
                </div>
                <article className="dbc-card" data-index="1">
                  <div className="dbc-card-top-bar">
                    <span className="badge mono">// 02 · FABRICATION &amp; POWER</span>
                    <span className="dbc-card-num-watermark">02</span>
                  </div>
                  <h3 className="dbc-card-title">
                    Build<span className="text-signal">.</span>
                  </h3>
                  <p className="dbc-card-subtitle">Precision Machining, 4130 TIG Welding &amp; EV Integration</p>
                  <p className="dbc-card-desc">
                    On the workshop floor of BIT Sindri, blueprints become roaring machines. Our student engineers execute in-house CNC lathe turning, precision 4130 chromoly spaceframe TIG welding, custom carbon fiber composite molding, custom wiring harnesses, and high-voltage lithium battery pack integration.
                  </p>
                  <div className="dbc-card-tags">
                    <span className="ref-skill-pill">Chromoly TIG Welding</span>
                    <span className="ref-skill-pill">In-House CNC Machining</span>
                    <span className="ref-skill-pill">Carbon Fiber Layup</span>
                    <span className="ref-skill-pill">HV Battery Packaging</span>
                    <span className="ref-skill-pill">CAN Bus Telemetry</span>
                  </div>
                  <div className="dbc-card-footer">
                    <div className="dbc-metric">
                      <span className="dbc-metric-val mono text-signal">4130</span>
                      <span className="dbc-metric-label">Aircraft Chromoly</span>
                    </div>
                    <div className="dbc-metric">
                      <span className="dbc-metric-val mono text-white">In-House</span>
                      <span className="dbc-metric-label">Precision Machined</span>
                    </div>
                    <div className="dbc-metric">
                      <span className="dbc-metric-val mono text-signal">Smart BMS</span>
                      <span className="dbc-metric-label">EV Battery Safety</span>
                    </div>
                  </div>
                </article>
              </div>

              {/* Phase 03: Compete */}
              <div className="dbc-pipeline-step" data-index="2">
                <div className="dbc-pipeline-node" aria-hidden="true">
                  <span className="dbc-node-pulse"></span>
                  <span className="dbc-node-num mono">03</span>
                </div>
                <article className="dbc-card" data-index="2">
                  <div className="dbc-card-top-bar">
                    <span className="badge mono">// 03 · THE PROVING GROUND</span>
                    <span className="dbc-card-num-watermark">03</span>
                  </div>
                  <h3 className="dbc-card-title">
                    Compete<span className="text-signal">.</span>
                  </h3>
                  <p className="dbc-card-subtitle">National Championships, Acceleration &amp; 4-Hour Endurance</p>
                  <p className="dbc-card-desc">
                    The ultimate proving ground where machines and student grit are tested under maximum pressure. We campaign our student-engineered vehicles against 100+ universities across India at BAJA SAEINDIA, Formula Bharat, and Mega ATV Championship—surviving high-G cornering and grueling 4-hour endurance battles.
                  </p>
                  <div className="dbc-card-tags">
                    <span className="ref-skill-pill">BAJA SAEINDIA</span>
                    <span className="ref-skill-pill">Formula Bharat</span>
                    <span className="ref-skill-pill">Mega ATV Series</span>
                    <span className="ref-skill-pill">4-Hour Endurance</span>
                    <span className="ref-skill-pill">Track Telemetry</span>
                  </div>
                  <div className="dbc-card-footer">
                    <div className="dbc-metric">
                      <span className="dbc-metric-val mono text-signal">Podium</span>
                      <span className="dbc-metric-label">National Contender</span>
                    </div>
                    <div className="dbc-metric">
                      <span className="dbc-metric-val mono text-white">100+</span>
                      <span className="dbc-metric-label">University Grid</span>
                    </div>
                    <div className="dbc-metric">
                      <span className="dbc-metric-val mono text-signal">Live CAN</span>
                      <span className="dbc-metric-label">Pit Diagnostics</span>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
