import React, { useState } from 'react';
import '../../styles/subsystem-explorer.css';

interface TelemetrySpec {
  label: string;
  value: string;
}

interface SubsystemData {
  id: string;
  number: string;
  name: string;
  shortName: string;
  icon: string;
  tagline: string;
  description: string;
  hotspot: { x: number; y: number; label: string };
  telemetrySpecs: TelemetrySpec[];
  pillars: string[];
  skillsLearned: string[];
  roles: string[];
  engineeringInsight: string;
}

const SUBSYSTEMS: SubsystemData[] = [
  {
    id: 'chassis',
    number: '01',
    name: 'Chassis & Spaceframe',
    shortName: 'Chassis',
    icon: '🛡️',
    tagline: 'The Structural Backbone & Driver Safety Cell',
    description: 'The tubular spaceframe must withstand brutal dynamic impacts while providing an ultra-rigid platform for suspension kinematics. Student engineers design the triangulated frame in CAD, validate impact zones with FEA stress analysis, and notch and TIG-weld every joint by hand in the BIT Sindri fabrication bay.',
    hotspot: { x: 61.3, y: 27.4, label: 'CHASSIS ROLL CAGE' },
    telemetrySpecs: [
      { label: 'MATERIAL', value: 'AISI 4130 CHROMOLY' },
      { label: 'TORSIONAL RIGIDITY', value: '1,850 Nm/°' },
      { label: 'FEA SAFETY FACTOR', value: '2.4x LOAD' },
    ],
    pillars: [
      'Triangulated Spaceframe',
      'In-House TIG Welding',
      'AISI 4130 Seamless Tube',
      '15G Rollover Rule Compliance',
    ],
    skillsLearned: [
      '3D CAD Modeling',
      'ANSYS FEA Stress Testing',
      'Tube Notching & Bending',
      'Welding Jig Calibration',
    ],
    roles: ['Chassis Lead', 'Roll Cage Fabricator', 'Ergonomics & Seat Designer'],
    engineeringInsight: 'Every tube junction is triangulated so structural loads transfer in pure tension or compression rather than bending moments, achieving maximum torsional stiffness at minimum weight.',
  },
  {
    id: 'suspension',
    number: '02',
    name: 'Suspension & Dynamics',
    shortName: 'Suspension',
    icon: '⚙️',
    tagline: 'Translating Rubber to Track Grip & Terrain Absorption',
    description: 'Connecting the machine to the ground. Suspension engineers calculate roll centers, camber gain, caster angles, and Ackermann steering geometry to maximize tire contact patch during high-G cornering and extreme off-road terrain landings.',
    hotspot: { x: 21.8, y: 67.7, label: 'DOUBLE WISHBONE' },
    telemetrySpecs: [
      { label: 'SUSPENSION TRAVEL', value: '180mm F / 210mm R' },
      { label: 'GEOMETRY DESIGN', value: 'ACKERMANN STEER' },
      { label: 'DAMPER SYSTEM', value: 'COILOVER REBOUND' },
    ],
    pillars: [
      'Double Unequal A-Arms',
      'Custom CNC Uprights',
      'Adjustable Coilovers',
      'Anti-Roll Bar Kinematics',
    ],
    skillsLearned: [
      'Suspension Kinematics',
      'CNC Lathe Machining',
      'Damper & Spring Tuning',
      'Wheel Alignment Calibration',
    ],
    roles: ['Suspension Lead', 'Upright & Hub Designer', 'Damper Specialist'],
    engineeringInsight: 'Camber recovery under body roll is mathematically tuned to keep the outside tire flat against the tarmac, generating peak lateral grip during high-speed cornering.',
  },
  {
    id: 'powertrain',
    number: '03',
    name: 'Powertrain & Drivetrain',
    shortName: 'Powertrain',
    icon: '⚡',
    tagline: 'Raw Power, Torque Multiplication & Thermal Management',
    description: 'Responsible for the heart of the vehicle. Whether tuning an internal combustion powerplant with custom intake and exhaust tracts or packaging an electric motor with high-discharge battery packs, powertrain engineers optimize torque delivery, transmission ratios, and cooling.',
    hotspot: { x: 75.8, y: 70.0, label: 'POWERTRAIN BAY' },
    telemetrySpecs: [
      { label: 'REDUCTION RATIO', value: '4.8 : 1 TUNED' },
      { label: 'TRANSMISSION', value: 'VARIABLE CVT' },
      { label: 'TORQUE MULTIPLIER', value: '38 Nm @ 3,800 RPM' },
    ],
    pillars: [
      'Intake & Exhaust Tuning',
      'CVT & Chain Reduction',
      'Differential Tuning',
      'Thermal Radiator Ducts',
    ],
    skillsLearned: [
      'Engine Tuning & Dyno Runs',
      'Cooling CFD Analysis',
      'Gear Ratio Optimization',
      'Drivetrain Packaging',
    ],
    roles: ['Powertrain Lead', 'Engine Specialist', 'Transmission & CVT Lead'],
    engineeringInsight: 'Gear reduction ratios are calculated to match the peak engine torque curve with the critical corner-exit speeds of competition tracks like NATRAX and Kari Speedway.',
  },
  {
    id: 'braking',
    number: '04',
    name: 'Braking & Hydraulics',
    shortName: 'Braking',
    icon: '🛑',
    tagline: 'Deceleration G-Forces & Front-to-Rear Bias Control',
    description: 'Winning races requires braking later and harder than the competition. The braking team designs the ergonomic pedal box with dual master cylinders, calculates hydraulic line pressures, and machines custom lightweight drilled rotors for maximum heat dissipation.',
    hotspot: { x: 31.5, y: 71.0, label: 'PEDAL BOX & HYDRAULICS' },
    telemetrySpecs: [
      { label: 'DECEL FORCE', value: '1.45G PEAK' },
      { label: 'HYDRAULIC BIAS', value: '60:40 F/R DYNAMIC' },
      { label: 'ROTOR WEIGHT', value: '380g DRILLED' },
    ],
    pillars: [
      'Dual-Circuit Split Hydraulics',
      'Custom Drilled Rotors',
      'Adjustable Brake Bias Bar',
      'Ergonomic Pedal Assembly',
    ],
    skillsLearned: [
      'Hydraulic Circuit Design',
      'Thermal Rotor Simulation',
      'Brake Bias Calculation',
      'Caliper Mounting Machining',
    ],
    roles: ['Braking Lead', 'Rotor & Caliper Designer', 'Pedal Box Specialist'],
    engineeringInsight: 'A mechanical balance bar allows the driver to adjust front-to-rear brake bias dynamically as fuel burns off or track traction conditions evolve.',
  },
  {
    id: 'electronics',
    number: '05',
    name: 'Electronics & Telemetry',
    shortName: 'Electronics',
    icon: '📡',
    tagline: 'The Nervous System: Wiring, Sensors & Real-Time Data',
    description: 'The vehicle nervous system. The team designs a motorsport-grade wiring harness, integrates kill-switch safety circuits, and streams live sensor telemetry (RPM, wheel speeds, battery voltage, temperature) wirelessly back to the pit wall.',
    hotspot: { x: 46.8, y: 46.8, label: 'DASHBOARD & DAQ' },
    telemetrySpecs: [
      { label: 'CAN PROTOCOL', value: 'CAN 2.0B 500k' },
      { label: 'DAQ SAMPLING', value: '100 Hz WIRELESS' },
      { label: 'HARNESS SPEC', value: 'MIL-SPEC 5015' },
    ],
    pillars: [
      'Motorsport Wiring Loom',
      'Kill Switch & Brake Relays',
      'CAN Bus Sensor Network',
      'Wireless Pit Telemetry DAQ',
    ],
    skillsLearned: [
      'Circuit Schematic Design',
      'Harness Fabrication',
      'Embedded C / Microcontrollers',
      'Data Acquisition & Telemetry',
    ],
    roles: ['Electronics Lead', 'Wiring Harness Engineer', 'Telemetry & DAQ Specialist'],
    engineeringInsight: 'Every wire is color-coded, heat-shrinked, and vibration-isolated to survive the brutal vibration and mud of 4-hour endurance challenges.',
  },
];

export const SubsystemExplorer: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const active = SUBSYSTEMS[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % SUBSYSTEMS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + SUBSYSTEMS.length) % SUBSYSTEMS.length);
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'Home' && event.key !== 'End') {
      return;
    }

    event.preventDefault();
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? SUBSYSTEMS.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + SUBSYSTEMS.length) % SUBSYSTEMS.length;

    setActiveIndex(nextIndex);
    window.requestAnimationFrame(() => {
      document.getElementById(`subsystem-tab-${SUBSYSTEMS[nextIndex].id}`)?.focus();
    });
  };

  return (
    <section className="subsystem-section" id="subsystemExplorer">
      <div className="subsystem-bg-grid" />
      <div className="subsystem-glow" />

      <div className="ref-container subsystem-container">
        {/* Section Header */}
        <div className="subsystem-header">
          <div className="subsystem-eyebrow-row">
            <span className="subsystem-eyebrow-line" />
            <p className="subsystem-eyebrow">// VEHICLE ARCHITECTURE &amp; SUBSYSTEMS</p>
          </div>
          <h2 className="subsystem-heading">
            How We <span className="text-signal">Engineer Machines.</span>
          </h2>
          <p className="subsystem-lead">
            Every vehicle created at SAE BIT Sindri is the convergence of 5 specialized engineering subsystems. Select a subsystem or click the hotspots on the vehicle anatomy to explore the craftsmanship, materials, and student skills.
          </p>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="subsystem-tabs-bar" role="tablist" aria-label="Vehicle Subsystems">
          {SUBSYSTEMS.map((sub, idx) => (
            <button
              key={sub.id}
              type="button"
              className={`subsystem-tab-btn ${idx === activeIndex ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              onKeyDown={(event) => handleTabKeyDown(event, idx)}
              role="tab"
              id={`subsystem-tab-${sub.id}`}
              aria-selected={idx === activeIndex}
              aria-controls="subsystem-panel"
              tabIndex={idx === activeIndex ? 0 : -1}
            >
              <span className="subsystem-tab-num">{sub.number}</span>
              <span>{sub.name}</span>
            </button>
          ))}
        </div>

        {/* Main Grid: Left Vehicle Anatomy Stage, Right Detail Inspector Card */}
        <div
          className="subsystem-main-grid"
          id="subsystem-panel"
          role="tabpanel"
          aria-labelledby={`subsystem-tab-${active.id}`}
          tabIndex={0}
        >
          {/* Left: Interactive Vehicle Anatomy Stage */}
          <div className="subsystem-visual-panel">
            <div className="subsystem-panel-bar">
              <span className="subsystem-panel-status">
                <span className="subsystem-beacon-dot" />
                <span>ACTIVE SUBSYSTEM: {active.name.toUpperCase()}</span>
              </span>
              <span>INSPECTION VIEW // 3D SCHEMATIC</span>
            </div>

            <div className="subsystem-blueprint-stage">
              <div className="subsystem-stage-canvas">
                {/* Technical Vector Car Silhouette */}
                <svg
                  className="subsystem-car-svg"
                  viewBox="80 120 620 310"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                <defs>
                  {/* Glowing line gradients */}
                  <linearGradient id="activeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f6b719" />
                    <stop offset="100%" stopColor="#00f0ff" />
                  </linearGradient>
                </defs>

                {/* Ground Reference Plane */}
                <line x1="30" y1="410" x2="770" y2="410" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />

                {/* --- 1. WHEELS & TIRES --- */}
                <g className="subsystem-wheels">
                  {/* Front Wheel */}
                  <circle cx="180" cy="360" r="50" stroke={active.id === 'suspension' || active.id === 'braking' ? '#f6b719' : '#00f0ff'} strokeWidth="2.5" opacity={active.id === 'suspension' || active.id === 'braking' ? '1' : '0.5'} />
                  <circle cx="180" cy="360" r="30" stroke={active.id === 'braking' ? '#f6b719' : '#00f0ff'} strokeWidth="2" opacity="0.8" />
                  {/* Front Brake Rotor & Caliper */}
                  <circle cx="180" cy="360" r="20" stroke={active.id === 'braking' ? '#ff3b30' : '#4b5563'} strokeWidth="4" strokeDasharray="6 3" />

                  {/* Rear Wheel */}
                  <circle cx="610" cy="360" r="54" stroke={active.id === 'suspension' || active.id === 'braking' ? '#f6b719' : '#00f0ff'} strokeWidth="2.5" opacity={active.id === 'suspension' || active.id === 'braking' ? '1' : '0.5'} />
                  <circle cx="610" cy="360" r="32" stroke={active.id === 'braking' ? '#f6b719' : '#00f0ff'} strokeWidth="2" opacity="0.8" />
                  <circle cx="610" cy="360" r="22" stroke={active.id === 'braking' ? '#ff3b30' : '#4b5563'} strokeWidth="4" strokeDasharray="6 3" />
                </g>

                {/* --- 2. CHASSIS & SPACEFRAME TUBES --- */}
                <g className="subsystem-chassis-group">
                  {/* Main Spaceframe Perimeter */}
                  <polygon
                    points="110,370 150,330 310,320 370,230 460,230 490,320 660,320 680,370"
                    stroke={active.id === 'chassis' ? '#f6b719' : '#00f0ff'}
                    strokeWidth={active.id === 'chassis' ? '4' : '2'}
                    fill={active.id === 'chassis' ? 'rgba(246, 183, 25, 0.08)' : 'rgba(0, 240, 255, 0.02)'}
                  />

                  {/* Main Roll Hoop */}
                  <path
                    d="M440 320 L440 180 C440 170, 480 170, 480 180 L480 320"
                    stroke={active.id === 'chassis' ? '#f6b719' : '#00f0ff'}
                    strokeWidth={active.id === 'chassis' ? '4.5' : '2.5'}
                  />
                  <line x1="440" y1="210" x2="480" y2="210" stroke={active.id === 'chassis' ? '#f6b719' : '#00f0ff'} strokeWidth="2" />

                  {/* Front Roll Hoop */}
                  <path
                    d="M330 320 L340 240 C340 235, 360 235, 360 240 L370 320"
                    stroke={active.id === 'chassis' ? '#f6b719' : '#00f0ff'}
                    strokeWidth={active.id === 'chassis' ? '3.5' : '1.8'}
                  />

                  {/* Triangulation Structural Bracing */}
                  <line x1="150" y1="330" x2="330" y2="320" stroke={active.id === 'chassis' ? '#f6b719' : '#00f0ff'} strokeWidth={active.id === 'chassis' ? '2.5' : '1.2'} opacity="0.8" />
                  <line x1="330" y1="320" x2="440" y2="180" stroke={active.id === 'chassis' ? '#f6b719' : '#00f0ff'} strokeWidth={active.id === 'chassis' ? '3' : '1.5'} />
                  <line x1="370" y1="230" x2="440" y2="320" stroke={active.id === 'chassis' ? '#f6b719' : '#00f0ff'} strokeWidth={active.id === 'chassis' ? '2.5' : '1.2'} />
                  <line x1="480" y1="180" x2="620" y2="320" stroke={active.id === 'chassis' ? '#f6b719' : '#00f0ff'} strokeWidth={active.id === 'chassis' ? '3' : '1.5'} />
                  <line x1="490" y1="320" x2="660" y2="320" stroke={active.id === 'chassis' ? '#f6b719' : '#00f0ff'} strokeWidth={active.id === 'chassis' ? '2.5' : '1.2'} />
                </g>

                {/* --- 3. SUSPENSION & STEERING --- */}
                <g className="subsystem-suspension-group">
                  {/* Front Upper and Lower A-Arms */}
                  <line x1="180" y1="360" x2="250" y2="330" stroke={active.id === 'suspension' ? '#f6b719' : '#00f0ff'} strokeWidth={active.id === 'suspension' ? '4' : '2'} />
                  <line x1="180" y1="360" x2="250" y2="365" stroke={active.id === 'suspension' ? '#f6b719' : '#00f0ff'} strokeWidth={active.id === 'suspension' ? '4' : '2'} />
                  {/* Front Coilover Damper */}
                  <line x1="180" y1="360" x2="230" y2="290" stroke={active.id === 'suspension' ? '#f6b719' : '#00f0ff'} strokeWidth={active.id === 'suspension' ? '4' : '2'} strokeDasharray="6 3" />

                  {/* Rear Upper and Lower A-Arms */}
                  <line x1="610" y1="360" x2="540" y2="330" stroke={active.id === 'suspension' ? '#f6b719' : '#00f0ff'} strokeWidth={active.id === 'suspension' ? '4' : '2'} />
                  <line x1="610" y1="360" x2="540" y2="365" stroke={active.id === 'suspension' ? '#f6b719' : '#00f0ff'} strokeWidth={active.id === 'suspension' ? '4' : '2'} />
                  <line x1="610" y1="360" x2="560" y2="290" stroke={active.id === 'suspension' ? '#f6b719' : '#00f0ff'} strokeWidth={active.id === 'suspension' ? '4' : '2'} strokeDasharray="6 3" />
                </g>

                {/* --- 4. POWERTRAIN & DRIVETRAIN --- */}
                <g className="subsystem-powertrain-group">
                  {/* Engine & Transmission Block (Mid-Rear) */}
                  <rect
                    x="500"
                    y="310"
                    width="100"
                    height="55"
                    rx="6"
                    fill={active.id === 'powertrain' ? 'rgba(246, 183, 25, 0.25)' : 'rgba(15, 23, 42, 0.6)'}
                    stroke={active.id === 'powertrain' ? '#f6b719' : '#475569'}
                    strokeWidth={active.id === 'powertrain' ? '3' : '1.5'}
                  />
                  {/* Cylinder Head / Spark Plug representation */}
                  <rect x="520" y="290" width="35" height="20" rx="3" stroke={active.id === 'powertrain' ? '#f6b719' : '#475569'} strokeWidth="1.5" />
                  {/* Exhaust Pipe & Header */}
                  <path d="M555 300 Q620 290 670 300" stroke={active.id === 'powertrain' ? '#f6b719' : '#475569'} strokeWidth={active.id === 'powertrain' ? '3' : '1.5'} fill="none" />
                  {/* Drive Sprocket / Chain */}
                  <circle cx="585" cy="340" r="14" stroke={active.id === 'powertrain' ? '#f6b719' : '#475569'} strokeWidth="2" strokeDasharray="4 2" />
                  <line x1="585" y1="340" x2="610" y2="360" stroke={active.id === 'powertrain' ? '#f6b719' : '#475569'} strokeWidth="2.5" />
                </g>

                {/* --- 5. BRAKING & PEDAL BOX --- */}
                <g className="subsystem-braking-group">
                  {/* Driver Footwell Pedal Box */}
                  <path
                    d="M260 365 L275 330 M275 330 L285 330 M265 365 L280 330"
                    stroke={active.id === 'braking' ? '#f6b719' : '#475569'}
                    strokeWidth={active.id === 'braking' ? '3.5' : '1.5'}
                  />
                  {/* Hydraulic Lines */}
                  <path
                    d="M275 340 C340 345, 480 345, 590 355"
                    stroke={active.id === 'braking' ? '#ff3b30' : '#334155'}
                    strokeWidth={active.id === 'braking' ? '2' : '1'}
                    strokeDasharray="4 3"
                  />
                  <path
                    d="M275 340 L195 355"
                    stroke={active.id === 'braking' ? '#ff3b30' : '#334155'}
                    strokeWidth={active.id === 'braking' ? '2' : '1'}
                    strokeDasharray="4 3"
                  />
                </g>

                {/* --- 6. ELECTRONICS & TELEMETRY --- */}
                <g className="subsystem-electronics-group">
                  {/* Dashboard Display & Steering Wheel */}
                  <circle cx="370" cy="275" r="15" stroke={active.id === 'electronics' ? '#f6b719' : '#475569'} strokeWidth={active.id === 'electronics' ? '3' : '1.5'} />
                  <rect x="360" y="255" width="20" height="12" rx="2" fill={active.id === 'electronics' ? '#00f0ff' : 'transparent'} stroke={active.id === 'electronics' ? '#f6b719' : '#475569'} strokeWidth="1.5" />
                  {/* Telemetry Antenna / DAQ Box */}
                  <line x1="460" y1="180" x2="460" y2="150" stroke={active.id === 'electronics' ? '#00f0ff' : '#475569'} strokeWidth={active.id === 'electronics' ? '2.5' : '1.2'} />
                  <circle cx="460" cy="148" r="3" fill={active.id === 'electronics' ? '#00f0ff' : '#475569'} />
                  {/* Signal Waves */}
                  {active.id === 'electronics' && (
                    <path d="M452 144 C456 138, 464 138, 468 144 M448 140 C454 132, 466 132, 472 140" stroke="#00f0ff" strokeWidth="1.5" fill="none" />
                  )}
                  {/* Wiring Loom Harness Path */}
                  <path
                    d="M370 270 Q430 310 500 320"
                    stroke={active.id === 'electronics' ? '#00f0ff' : '#334155'}
                    strokeWidth={active.id === 'electronics' ? '2.5' : '1'}
                    strokeDasharray="3 3"
                  />
                </g>
              </svg>

              {/* Interactive Hotspot Buttons directly overlaid on the car */}
              {SUBSYSTEMS.map((sub, idx) => (
                <button
                  key={sub.id}
                  type="button"
                  className={`subsystem-hotspot ${idx === activeIndex ? 'is-active' : ''}`}
                  style={{ left: `${sub.hotspot.x}%`, top: `${sub.hotspot.y}%` }}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Inspect ${sub.name}`}
                >
                  <div className="subsystem-hotspot-inner">
                    <span className="subsystem-hotspot-ping" />
                    <span className="subsystem-hotspot-dot" />
                  </div>
                  <span className="subsystem-hotspot-label">{sub.hotspot.label}</span>
                </button>
              ))}
              </div>
            </div>

            {/* Live Subsystem Telemetry HUD Strip */}
            <div className="subsystem-telemetry-hud" role="region" aria-label="Subsystem Live Specifications">
              {active.telemetrySpecs.map((spec, sIdx) => (
                <div key={sIdx} className="telemetry-hud-item">
                  <span className="hud-label">{spec.label}</span>
                  <span className="hud-value">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Subsystem Detail Inspector Card */}
          <div className="subsystem-detail-card is-active">
            <div className="subsystem-detail-header">
              <div className="subsystem-detail-badge-row">
                <span className="subsystem-detail-badge">// SUBSYSTEM {active.number}</span>
                <span className="subsystem-detail-icon">{active.icon}</span>
              </div>
              <h3 className="subsystem-detail-title">{active.name}</h3>
              <p className="subsystem-detail-tagline">{active.tagline}</p>
            </div>

            <p className="subsystem-detail-desc">{active.description}</p>

            {/* Core Engineering Pillars */}
            <div className="subsystem-section-block">
              <span className="subsystem-block-title">Key Engineering Pillars</span>
              <div className="subsystem-tags-row">
                {active.pillars.map((pillar) => (
                  <span key={pillar} className="subsystem-tag-pill">
                    {pillar}
                  </span>
                ))}
              </div>
            </div>

            {/* Practical Student Skills Learned */}
            <div className="subsystem-section-block">
              <span className="subsystem-block-title">Student Skills &amp; Software Mastered</span>
              <div className="subsystem-tags-row">
                {active.skillsLearned.map((skill) => (
                  <span key={skill} className="subsystem-tag-pill skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Insight Quote */}
            <div className="subsystem-insight-box">
              <span className="subsystem-insight-icon">💡</span>
              <p className="subsystem-insight-text">"{active.engineeringInsight}"</p>
            </div>

            {/* Subsystem Card Navigation Controls */}
            <div className="subsystem-card-nav">
              <button
                type="button"
                className="subsystem-nav-btn"
                onClick={handlePrev}
                aria-label="Previous Subsystem"
              >
                <span>←</span>
                <span>PREV</span>
              </button>

              <span className="subsystem-step-indicator">
                {activeIndex + 1} OF {SUBSYSTEMS.length}
              </span>

              <button
                type="button"
                className="subsystem-nav-btn"
                onClick={handleNext}
                aria-label="Next Subsystem"
              >
                <span>NEXT</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
