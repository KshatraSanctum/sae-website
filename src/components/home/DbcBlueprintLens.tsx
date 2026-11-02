import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../../styles/dbc-blueprint-lens.css';

type VehicleKey = 'formula' | 'baja';

interface VehicleData {
  name: string;
  divisionTitle: string;
  tagline: string;
  trackImg: string;
  trackTitle: string;
  trackSubtitle: string;
  cadTitle: string;
  cadSubtitle: string;
  metrics: [string, string, string, string, string, string];
  trackStats: [string, string, string];
  cadStats: [string, string, string];
}

const VEHICLES: Record<VehicleKey, VehicleData> = {
  formula: {
    name: 'Formula Bharat Prototype',
    divisionTitle: 'Formula Student Division',
    tagline: 'High-Downforce Electric/Combustion Spaceframe Monocoque',
    trackImg: '/achievements/supra sae india 2019.webp',
    trackTitle: 'Track Reality // Kari Motor Speedway',
    trackSubtitle: 'Proved under competition telemetry at Formula Bharat & SUPRA India',
    cadTitle: 'CAD Wireframe // SolidWorks Simulation V4.2',
    cadSubtitle: 'Double wishbone pull-rod suspension with CFD front/rear aerodynamic wings',
    metrics: ['3,240', 'Nm/deg Torsional', '1.82 G', 'Lateral Cornering', '42 kg', 'Aero Downforce @ 60'],
    trackStats: ['122 km/h', '1.82 G', 'Formula Bharat / SUPRA'],
    cadStats: ['3,240 Nm/deg', 'AISI 4130 + Carbon Fiber', '1.85 Min FOS'],
  },
  baja: {
    name: 'BAJA SAEINDIA All-Terrain Buggy',
    divisionTitle: 'BAJA Off-Road Division',
    tagline: 'Extreme-Travel Rough Terrain Spaceframe Prototype',
    trackImg: '/achievements/baja sae india 2015.webp',
    trackTitle: 'Proving Ground // NATRAX Pithampur',
    trackSubtitle: 'Surviving 4-hour high-impact endurance, rock crawling, and mud trenches',
    cadTitle: 'Roll Cage CAD // ANSYS FEA Stress Analysis',
    cadSubtitle: 'Triangulated Chromoly spaceframe rated for 15G rollover impact safety',
    metrics: ['240 mm', 'Suspension Travel', '4 Hours', 'Endurance Battled', '320 mm', 'Ground Clearance'],
    trackStats: ['64 km/h Rough', '1.35 G Dirt', 'BAJA SAEINDIA NATRAX'],
    cadStats: ['2,890 Nm/deg', 'AISI 4130 Seamless Tube', '2.4 Rollover FOS'],
  },
};

export const DbcBlueprintLens: React.FC = () => {
  const [activeVehicle, setActiveVehicle] = useState<VehicleKey>('formula');
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasAutoDemoed, setHasAutoDemoed] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const vehicle = VEHICLES[activeVehicle];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || hasAutoDemoed) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || hasAutoDemoed) return;
      setHasAutoDemoed(true);
      const start = performance.now();
      const animate = (now: number) => {
        const progress = Math.min(1, (now - start) / 1200);
        setSliderPos(Math.round(50 + Math.sin(progress * Math.PI * 2) * 22));
        if (progress < 1) requestAnimationFrame(animate);
        else setSliderPos(50);
      };
      window.setTimeout(() => requestAnimationFrame(animate), 400);
    }, { threshold: 0.3 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [hasAutoDemoed]);

  const updatePosition = useCallback((clientX: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    setSliderPos(Math.round(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))));
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') setSliderPos((value) => Math.max(0, value - 5));
    if (event.key === 'ArrowRight') setSliderPos((value) => Math.min(100, value + 5));
    if (event.key === 'Home') setSliderPos(0);
    if (event.key === 'End') setSliderPos(100);
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) event.preventDefault();
  };

  return (
    <section className="dbc-lens-section" id="dbcShowcase" ref={sectionRef}>
      <div className="dbc-lens-glow" aria-hidden="true" />
      <div className="ref-container dbc-lens-container">
        <div className="dbc-lens-layout">
          <div className="dbc-lens-narrative">
            <div className="dbc-lens-eyebrow-row"><span className="dbc-lens-eyebrow-line" /><p className="dbc-lens-eyebrow">// THE VELOCITY CYCLE · IDEA 03</p></div>
            <h2 className="dbc-lens-heading">Blueprint <span className="text-signal">to Track.</span></h2>
            <p className="dbc-lens-desc">Every championship vehicle begins as computational simulation, gets machined from raw Chromoly steel, and proves itself on national proving grounds. Drag the <strong>interactive X-Ray lens</strong> to inspect the CAD stress skeleton beneath the race-ready machine.</p>
            <div className="dbc-division-switcher" role="tablist" aria-label="Select division prototype">
              {(Object.keys(VEHICLES) as VehicleKey[]).map((key) => (
                <button key={key} type="button" className={`dbc-division-btn ${activeVehicle === key ? 'is-active' : ''}`} onClick={() => setActiveVehicle(key)} role="tab" aria-selected={activeVehicle === key}>
                  <span>{key === 'formula' ? '🏎️' : '🚜'}</span><span>{key === 'formula' ? 'Formula Bharat' : 'BAJA All-Terrain'}</span>
                </button>
              ))}
            </div>
            <div className="dbc-phase-list" role="tablist" aria-label="Velocity cycle phases">
              {[
                ['01', 'Design & Simulation', 'CAD Modeling, FEA Stress & CFD Aerodynamics', 'CAD 0%', 0],
                ['02', 'Build & Fabrication', 'In-House CNC Machining, TIG Welding & Wiring', '50/50 X-RAY', 50],
                ['03', 'Compete & Proving Ground', 'National Championships, Acceleration & Endurance', 'TRACK 100%', 100],
              ].map(([number, title, subtitle, badge, position]) => (
                <button key={number} type="button" className={`dbc-phase-item ${sliderPos < 33 && position === 0 || sliderPos >= 33 && sliderPos <= 66 && position === 50 || sliderPos > 66 && position === 100 ? 'is-active' : ''}`} onClick={() => setSliderPos(position as number)}>
                  <span className="dbc-phase-left"><span className="dbc-phase-num">{number}</span><span className="dbc-phase-info"><span className="dbc-phase-title">{title}</span><span className="dbc-phase-sub">{subtitle}</span></span></span><span className="dbc-phase-badge">{badge}</span>
                </button>
              ))}
            </div>
            <div className="dbc-metrics-strip">{[0, 2, 4].map((index) => <div className="dbc-metric-box" key={index}><span className="dbc-metric-val">{vehicle.metrics[index]}</span><span className="dbc-metric-label">{vehicle.metrics[index + 1]}</span></div>)}</div>
          </div>

          <div className="dbc-lens-card">
            <div ref={viewportRef} className={`dbc-lens-viewport ${isDragging ? 'is-dragging' : ''}`} style={{ '--lens-pos': `${sliderPos}%` } as React.CSSProperties} onPointerDown={(event) => { setIsDragging(true); event.currentTarget.setPointerCapture(event.pointerId); updatePosition(event.clientX); }} onPointerMove={(event) => { if (isDragging) updatePosition(event.clientX); }} onPointerUp={() => setIsDragging(false)} onPointerCancel={() => setIsDragging(false)} onKeyDown={handleKeyDown} tabIndex={0} role="slider" aria-label="Interactive CAD to track comparison" aria-valuemin={0} aria-valuemax={100} aria-valuenow={sliderPos}>
              <div className="dbc-layer-track"><img src={vehicle.trackImg} alt={`${vehicle.name} photographed during competition`} className="dbc-track-img" loading="lazy" decoding="async" /><div className="dbc-track-vignette" /><div className="dbc-layer-badge dbc-badge-track"><span className="dbc-badge-title">TRACK SPECIFICATIONS</span><span className="dbc-badge-desc">{vehicle.trackStats.join(' · ')}</span></div></div>
              <div className="dbc-layer-cad"><div className="dbc-cad-blueprint-grid" /><svg className="dbc-cad-schematic-svg" viewBox="0 0 800 500" fill="none" aria-hidden="true"><rect x="120" y="170" width="560" height="210" rx="20" stroke="#00f0ff" strokeWidth="4" /><path d="M170 360 L250 250 L400 220 L550 250 L640 360 M250 250 L310 360 M550 250 L490 360 M300 220 L340 150 L460 150 L500 220" stroke="#f6b719" strokeWidth="4" /><circle cx="220" cy="370" r="52" stroke="#00f0ff" strokeWidth="4" /><circle cx="580" cy="370" r="52" stroke="#00f0ff" strokeWidth="4" /><path d="M50 190 C220 120 420 120 750 190 M50 230 C230 180 470 180 750 230" stroke="#00f0ff" strokeWidth="2" strokeDasharray="7 6" opacity=".55" /></svg><div className="dbc-layer-badge dbc-badge-cad"><span className="dbc-badge-title">CAD SIMULATION SPECS</span><span className="dbc-badge-desc">{vehicle.cadStats.join(' · ')}</span></div></div>
              <div className="dbc-lens-divider"><div className="dbc-lens-handle" aria-hidden="true"><span>◀</span><span>CAD | TRACK</span><span>▶</span></div></div>
            </div>
            <div className="dbc-lens-presets-bar"><div className="dbc-presets-group"><button type="button" className={`dbc-preset-btn ${sliderPos === 0 ? 'is-active' : ''}`} onClick={() => setSliderPos(0)}>01 CAD BLUEPRINT</button><button type="button" className={`dbc-preset-btn ${sliderPos === 50 ? 'is-active' : ''}`} onClick={() => setSliderPos(50)}>02 50/50 X-RAY</button><button type="button" className={`dbc-preset-btn ${sliderPos === 100 ? 'is-active' : ''}`} onClick={() => setSliderPos(100)}>03 TRACK REALITY</button></div><span className="dbc-slider-pct">{sliderPos}% TRACK / {100 - sliderPos}% CAD</span></div>
          </div>
        </div>
      </div>
    </section>
  );
};
