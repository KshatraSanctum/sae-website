import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getActiveCarFollower3D, CarFollower3D } from '../carFollower3D';
import { TrackAudio } from '../utils/trackAudio';
import '../styles/track.css';

// SVG Circuit Dimensions
// SVG Circuit Dimensions
const SVG_WIDTH = 1350;
const SVG_HEIGHT = 900;

// The Circuit Spline: Autódromo José Carlos Pace (Interlagos)
// Start/Finish Straight -> Senna S (T1-T2) -> Curva do Sol (T3) -> Reta Oposta (Bottom Straight) ->
// Descida do Lago (T4-T5) -> Ferradura (T6-T7) -> Pinheirinho (T8) -> Mergulho (T9) ->
// Bico de Pato (T10) -> Junção (T11-T12) -> Subida dos Boxes (T13) -> Arquibancadas (T14-T15) -> Start
const TRACK_PATH_D =
  'M 360 270 L 190 430 C 130 490, 80 500, 80 550 C 80 595, 120 615, 150 625 C 180 635, 150 710, 135 750 C 115 800, 180 815, 260 815 L 800 815 C 860 815, 885 780, 885 710 C 885 645, 855 595, 785 555 L 560 450 C 490 425, 465 365, 480 305 C 495 245, 560 235, 650 240 C 700 245, 720 325, 690 375 C 665 415, 710 430, 765 395 C 820 355, 905 245, 950 225 C 975 210, 985 245, 945 300 C 890 375, 865 440, 875 500 C 885 550, 940 580, 1030 580 C 1120 580, 1215 510, 1250 420 C 1285 330, 1260 205, 1160 155 C 1060 115, 700 125, 540 135 C 480 140, 420 210, 360 270 Z';

interface SamplePoint {
  x: number;
  y: number;
  pct: number;
  index: number;
}

export const TrackPage: React.FC = () => {
  const arenaRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const audioRef = useRef<TrackAudio | null>(null);

  // Gameplay State: 'STANDBY' (on grid waiting for start) | 'STARTING' | 'RACING'
  const [raceState, setRaceState] = useState<'STANDBY' | 'STARTING' | 'RACING'>('STANDBY');
  const raceStateRef = useRef<'STANDBY' | 'STARTING' | 'RACING'>('STANDBY');
  raceStateRef.current = raceState;

  const [isCarParked, setIsCarParked] = useState(false);
  const [difficulty, setDifficulty] = useState<'STANDARD' | 'PRO'>('STANDARD');
  const [isMuted, setIsMuted] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [crashMessage, setCrashMessage] = useState('💥 OFF TRACK! RETURNING TO GRID...');

  // Telemetry & Timing
  const [lapTimeDisplay, setLapTimeDisplay] = useState('00:00.000');
  const [bestLapTime, setBestLapTime] = useState<number | null>(null);
  const [speedKmh, setSpeedKmh] = useState(0);
  const [rpmPct, setRpmPct] = useState(0);

  // Sector Checkpoints
  const [s1Cleared, setS1Cleared] = useState(false);
  const [s2Cleared, setS2Cleared] = useState(false);
  const [s3Cleared, setS3Cleared] = useState(false);
  const [s1Time, setS1Time] = useState<string | null>(null);
  const [s2Time, setS2Time] = useState<string | null>(null);
  const [s3Time, setS3Time] = useState<string | null>(null);

  // Celebration Modal
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastFinishedTime, setLastFinishedTime] = useState<string>('');
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Mutable refs for high-frequency 60 FPS animation loop
  const pointsRef = useRef<SamplePoint[]>([]);
  const lapStartTimeRef = useRef<number | null>(null);
  const currentLapElapsedRef = useRef(0);
  const isCrashedCooldownRef = useRef(false);
  const checkpointsRef = useRef({ s1: false, s2: false, s3: false });
  const animFrameRef = useRef<number | null>(null);

  // Format milliseconds into MM:SS.mmm
  const formatTime = (ms: number): string => {
    const totalSec = ms / 1000;
    const minutes = Math.floor(totalSec / 60);
    const seconds = Math.floor(totalSec % 60);
    const millis = Math.floor(ms % 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
  };

  // Calculate the live screen position of the Start Grid (at T15/Main Straight Start Line)
  const getStartGridScreenPos = useCallback(() => {
    if (!arenaRef.current || pointsRef.current.length === 0) return null;
    const rect = arenaRef.current.getBoundingClientRect();
    const startPt = pointsRef.current[0] || { x: 360, y: 270 };
    return {
      x: rect.left + (startPt.x / SVG_WIDTH) * rect.width,
      y: rect.top + (startPt.y / SVG_HEIGHT) * rect.height,
    };
  }, []);

  // Lock car stationary at the Start Grid Line (facing along main straight towards Turn 1 at 2.386 rad)
  const lockCarToGrid = useCallback(
    (carInstance?: CarFollower3D | null) => {
      const car = carInstance || getActiveCarFollower3D();
      if (!car) return;
      const pos = getStartGridScreenPos();
      if (pos) {
        car.lockToGrid(pos.x, pos.y, 2.386); // Heading 2.386 rad = facing towards Turn 1
      }
    },
    [getStartGridScreenPos]
  );

  // Launch and Start the Race
  const startRace = useCallback(() => {
    const car = getActiveCarFollower3D();
    if (!car) return;

    // If car is parked in navbar pit bay, release it first
    if (car.isParked()) {
      car.releaseCar();
    }

    setRaceState('STARTING');
    raceStateRef.current = 'STARTING';
    setIsCrashed(false);

    // Audio rev engine
    audioRef.current?.startEngine();

    // Lock to start grid temporarily so both car and start align
    lockCarToGrid(car);

    // After brief 300ms launch sequence, unlock car so it follows user pointer from the grid
    setTimeout(() => {
      car.unlockFromGrid();
      lapStartTimeRef.current = performance.now();
      checkpointsRef.current = { s1: false, s2: false, s3: false };
      setS1Cleared(false);
      setS2Cleared(false);
      setS3Cleared(false);
      setS1Time(null);
      setS2Time(null);
      setS3Time(null);
      setRaceState('RACING');
      raceStateRef.current = 'RACING';
    }, 320);
  }, [lockCarToGrid]);

  // Reset to Standby Grid
  const resetToGrid = useCallback(
    (reason?: string) => {
      lapStartTimeRef.current = null;
      currentLapElapsedRef.current = 0;
      setLapTimeDisplay('00:00.000');
      setRaceState('STANDBY');
      raceStateRef.current = 'STANDBY';
      checkpointsRef.current = { s1: false, s2: false, s3: false };
      setS1Cleared(false);
      setS2Cleared(false);
      setS3Cleared(false);
      setS1Time(null);
      setS2Time(null);
      setS3Time(null);

      const car = getActiveCarFollower3D();
      if (car) {
        lockCarToGrid(car);
      }

      if (reason) {
        setCrashMessage(reason);
      }
    },
    [lockCarToGrid]
  );

  // Initialize Best Lap from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sae_track_best_lap');
    if (saved) {
      const val = parseFloat(saved);
      if (!isNaN(val) && val > 0) {
        setBestLapTime(val);
      }
    }
  }, []);

  // Initialize Track Audio & Mode Setup
  useEffect(() => {
    const audio = new TrackAudio();
    audioRef.current = audio;
    setIsMuted(audio.isAudioMuted);

    // Keyboard shortcut: Press Space / Enter to start, R to reset
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        resetToGrid('GRID RESET TRIGGERED');
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (raceStateRef.current === 'STANDBY') {
          e.preventDefault();
          startRace();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      audio.destroy();
    };
  }, [resetToGrid, startRace]);

  // Main Track Physics & Game Loop
  useEffect(() => {
    let car = getActiveCarFollower3D();

    // Enable free drive mode so mouse/touch moves freely on track (even on mobile)
    const enableFreeDrive = () => {
      car = getActiveCarFollower3D();
      if (car) {
        car.setForceFreeDrive(true);
        // Put car on start grid in standby
        lockCarToGrid(car);
      }
    };

    // Retry finding car if instantiated asynchronously
    enableFreeDrive();
    const initTimer = setTimeout(enableFreeDrive, 150);

    // Sample track spline points
    if (pathRef.current) {
      try {
        const totalLen = pathRef.current.getTotalLength();
        const sampleCount = 650;
        const pts: SamplePoint[] = [];
        for (let i = 0; i < sampleCount; i++) {
          const pt = pathRef.current.getPointAtLength((i / sampleCount) * totalLen);
          pts.push({
            x: pt.x,
            y: pt.y,
            pct: i / sampleCount,
            index: i,
          });
        }
        pointsRef.current = pts;
        lockCarToGrid(car);
      } catch (_) {}
    }

    // 60 FPS Animation & Collision Detection Frame Loop
    const tick = () => {
      const currentCar = getActiveCarFollower3D();
      const arena = arenaRef.current;
      const pts = pointsRef.current;

      if (currentCar && arena && pts.length > 0) {
        const parked = currentCar.isParked();
        setIsCarParked(parked);

        // 1. If car is parked in navbar, pause and disarm collision checks completely!
        if (parked) {
          if (raceStateRef.current === 'RACING') {
            setRaceState('STANDBY');
            raceStateRef.current = 'STANDBY';
          }
          animFrameRef.current = requestAnimationFrame(tick);
          return;
        }

        const rect = arena.getBoundingClientRect();
        const carScreen = currentCar.getCarScreenPos();

        // Project car to SVG coordinate space
        const carSvgX = ((carScreen.x - rect.left) / rect.width) * SVG_WIDTH;
        const carSvgY = ((carScreen.y - rect.top) / rect.height) * SVG_HEIGHT;

        // Find closest point on track centerline
        let minDistSq = Infinity;
        let closestIdx = 0;
        for (let i = 0; i < pts.length; i++) {
          const dx = carSvgX - pts[i].x;
          const dy = carSvgY - pts[i].y;
          const dSq = dx * dx + dy * dy;
          if (dSq < minDistSq) {
            minDistSq = dSq;
            closestIdx = i;
          }
        }
        const minDist = Math.sqrt(minDistSq);
        const closestPoint = pts[closestIdx];

        // Telemetry Speed & Audio modulation
        const rawSpeed = currentCar.getSpeed();
        const kmh = Math.round(rawSpeed * 11.5);
        setSpeedKmh(kmh);
        setRpmPct(Math.min((kmh / 150) * 100, 100));
        audioRef.current?.updateEnginePitch(rawSpeed);

        // 2. If game is in STANDBY or STARTING, dynamically maintain grid lock with live scroll position!
        if (raceStateRef.current !== 'RACING') {
          const livePos = getStartGridScreenPos();
          if (livePos) {
            currentCar.lockToGrid(livePos.x, livePos.y, 2.386); // Heading towards Turn 1
          }
          animFrameRef.current = requestAnimationFrame(tick);
          return;
        }

        // 3. RACING STATE: Check Track Boundaries
        // Track stroke is 64px, half-width is 32px.
        // Standard allows riding the kerbs (40px); Pro requires staying inside white line (32px).
        const maxAllowedDist = difficulty === 'PRO' ? 32 : 40;

        // ================= OFF-TRACK COLLISION DETECTION =================
        if (minDist > maxAllowedDist) {
          if (!isCrashedCooldownRef.current) {
            isCrashedCooldownRef.current = true;
            setIsCrashed(true);
            setIsShaking(true);
            setCrashMessage('💥 OFF TRACK! RETURNING TO START GRID...');

            audioRef.current?.playCrash();
            currentCar.triggerCrashBurst();

            // Return to STANDBY and lock car back at start grid
            resetToGrid('💥 OFF TRACK! RE-ARM TO START');

            // Remove shake and crash alert after brief recovery delay
            setTimeout(() => {
              setIsShaking(false);
            }, 450);

            setTimeout(() => {
              setIsCrashed(false);
              isCrashedCooldownRef.current = false;
            }, 850);
          }
        } else {
          // ================= ON-TRACK PROGRESSION & TIMING =================
          const now = performance.now();

          if (lapStartTimeRef.current !== null) {
            const elapsed = now - lapStartTimeRef.current;
            currentLapElapsedRef.current = elapsed;
            setLapTimeDisplay(formatTime(elapsed));

            // Sector 1 Gate (~30% of circuit, Turn 4 Descida do Lago exit into infield)
            if (!checkpointsRef.current.s1 && closestPoint.pct >= 0.28 && closestPoint.pct <= 0.35) {
              checkpointsRef.current.s1 = true;
              setS1Cleared(true);
              setS1Time(formatTime(elapsed));
              audioRef.current?.playCheckpoint();
            }

            // Sector 2 Gate (~69% of circuit, Turn 12 Junção exit into outfield sweep)
            if (
              checkpointsRef.current.s1 &&
              !checkpointsRef.current.s2 &&
              closestPoint.pct >= 0.67 &&
              closestPoint.pct <= 0.74
            ) {
              checkpointsRef.current.s2 = true;
              setS2Cleared(true);
              setS2Time(formatTime(elapsed));
              audioRef.current?.playCheckpoint();
            }

            // Sector 3 Gate (~81% of circuit, Turn 14 Arquibancadas crest onto top straight)
            if (
              checkpointsRef.current.s2 &&
              !checkpointsRef.current.s3 &&
              closestPoint.pct >= 0.79 &&
              closestPoint.pct <= 0.86
            ) {
              checkpointsRef.current.s3 = true;
              setS3Cleared(true);
              setS3Time(formatTime(elapsed));
              audioRef.current?.playCheckpoint();
            }

            // Lap Finish Line (Start/Finish Grid, >= 96% or <= 4%)
            if (
              checkpointsRef.current.s1 &&
              checkpointsRef.current.s2 &&
              checkpointsRef.current.s3 &&
              (closestPoint.pct >= 0.96 || closestPoint.pct <= 0.04)
            ) {
              // CLEAN VALID LAP COMPLETED!
              const lapTimeSec = elapsed / 1000;
              setLastFinishedTime(formatTime(elapsed));
              setShowCelebration(true);
              audioRef.current?.playLapComplete();

              // Check Best Lap record
              const currentBest = bestLapTime;
              if (!currentBest || lapTimeSec < currentBest) {
                setBestLapTime(lapTimeSec);
                setIsNewRecord(true);
                localStorage.setItem('sae_track_best_lap', lapTimeSec.toFixed(3));
              } else {
                setIsNewRecord(false);
              }

              // Reset checkpoints & roll seamlessly into next lap
              checkpointsRef.current = { s1: false, s2: false, s3: false };
              setS1Cleared(false);
              setS2Cleared(false);
              setS3Cleared(false);
              setS1Time(null);
              setS2Time(null);
              setS3Time(null);
              lapStartTimeRef.current = now; // Start next lap immediately!
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    // Keep car glued to start grid during scroll or resize while on standby
    const handleScrollOrResize = () => {
      if (raceStateRef.current !== 'RACING') {
        const liveCar = getActiveCarFollower3D();
        const livePos = getStartGridScreenPos();
        if (liveCar && livePos) {
          liveCar.lockToGrid(livePos.x, livePos.y, 2.386);
        }
      }
    };
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      const activeCar = getActiveCarFollower3D();
      if (activeCar) {
        activeCar.setForceFreeDrive(false);
      }
    };
  }, [difficulty, bestLapTime, lockCarToGrid, resetToGrid, getStartGridScreenPos]);

  // Audio mute toggle
  const handleToggleSound = () => {
    if (audioRef.current) {
      const muted = audioRef.current.toggleMute();
      setIsMuted(muted);
    }
  };

  return (
    <div className="track-page">
      <div className="track-bg-glow" aria-hidden="true" />

      <div className="track-container">
        {/* Circuit Session Header */}
        <header className="track-header">
          <div className="track-title-group">
            <div className="track-badge-row">
              <span className="track-badge">Formula Student Circuit</span>
              {isCarParked ? (
                <span className="track-badge" style={{ borderColor: '#f6b719', color: '#f6b719' }}>
                  🅿️ CAR IN PIT STOP
                </span>
              ) : raceState === 'RACING' ? (
                <span className="track-badge track-badge-live">
                  <span className="track-live-dot" /> RACING ACTIVE
                </span>
              ) : (
                <span className="track-badge" style={{ borderColor: '#10b981', color: '#10b981' }}>
                  🏁 READY ON GRID
                </span>
              )}
            </div>
            <h1 className="track-title">BIT Sindri International Circuit</h1>
            <p className="track-subtitle">
              Drive the 3D Formula Student car with your pointer. Stay inside the track boundaries or respawn!
            </p>
          </div>

          <div className="track-header-actions">
            {/* Dedicated Start Race Button */}
            {raceState !== 'RACING' && (
              <button
                type="button"
                className="track-ctrl-btn track-ctrl-btn-start"
                onClick={startRace}
                title="Start race and unlock car (Hotkey: Space)"
              >
                <span>{isCarParked ? '🏎️ LAUNCH CAR' : '🏁 START RACE'}</span>
              </button>
            )}

            {/* Difficulty Toggle */}
            <button
              type="button"
              className={`track-ctrl-btn ${difficulty === 'PRO' ? 'active' : ''}`}
              onClick={() => setDifficulty((d) => (d === 'STANDARD' ? 'PRO' : 'STANDARD'))}
              title="Toggle Track Boundary Tolerance"
            >
              <span>Tolerance:</span>
              <strong>{difficulty === 'STANDARD' ? 'Standard (Kerbs allowed)' : 'Pro Sim (Strict)'}</strong>
            </button>

            {/* Sound Mute Toggle */}
            <button
              type="button"
              className={`track-ctrl-btn ${isMuted ? '' : 'active'}`}
              onClick={handleToggleSound}
              title="Toggle procedural race audio"
            >
              {isMuted ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                  <span>Muted</span>
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  <span>Audio On</span>
                </>
              )}
            </button>

            {/* Restart Button */}
            <button
              type="button"
              className="track-ctrl-btn track-ctrl-btn-restart"
              onClick={() => resetToGrid('GRID RESTART TRIGGERED')}
              title="Reset car to start grid (Hotkey: R)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>Reset (R)</span>
            </button>

            {/* Exit to Competitions */}
            <Link
              to="/competitions"
              className="track-ctrl-btn"
              title="Return to Competitions page"
            >
              <span>Exit Circuit ✕</span>
            </Link>
          </div>
        </header>

        {/* ===================== MAIN RACE ARENA ===================== */}
        <div
          ref={arenaRef}
          className={`track-arena-wrapper ${isShaking ? 'is-shaking' : ''}`}
          id="trackArena"
        >
          {/* Start Lights Gantry */}
          <div className="track-lights-gantry" aria-hidden="true">
            <span className={`track-light-bulb ${raceState !== 'RACING' ? 'is-red' : 'is-green'}`} />
            <span className={`track-light-bulb ${raceState !== 'RACING' ? 'is-red' : 'is-green'}`} />
            <span className={`track-light-bulb ${raceState !== 'RACING' ? 'is-red' : 'is-green'}`} />
            <span className={`track-light-bulb ${raceState !== 'RACING' ? 'is-red' : 'is-green'}`} />
            <span className={`track-light-bulb ${raceState !== 'RACING' ? 'is-red' : 'is-green'}`} />
            <span className="track-lights-label">
              {raceState === 'RACING' ? 'LIGHTS OUT • GO!' : 'GRID READY'}
            </span>
          </div>

          {/* Telemetry HUD: Top Left Timer & Sectors */}
          <div className="track-hud-top-left">
            <div className="hud-timer-card">
              <div className="hud-timer-label">Lap Time</div>
              <div className={`hud-timer-digits ${raceState === 'RACING' ? 'is-running' : ''}`}>
                {lapTimeDisplay}
              </div>
              <div className="hud-best-row">
                <span className="hud-best-badge">BEST</span>
                <span>{bestLapTime ? formatTime(bestLapTime * 1000) : '--:--.---'}</span>
              </div>
            </div>

            {/* Sector split pills */}
            <div className="hud-sectors-row">
              <div className={`hud-sector-pill ${s1Cleared ? 'is-cleared' : raceState === 'RACING' ? 'is-active' : ''}`}>
                <span>S1</span>
                <strong>{s1Time ? s1Time.slice(3) : '--'}</strong>
              </div>
              <div className={`hud-sector-pill ${s2Cleared ? 'is-cleared' : s1Cleared ? 'is-active' : ''}`}>
                <span>S2</span>
                <strong>{s2Time ? s2Time.slice(3) : '--'}</strong>
              </div>
              <div className={`hud-sector-pill ${s3Cleared ? 'is-cleared' : s2Cleared ? 'is-active' : ''}`}>
                <span>S3</span>
                <strong>{s3Time ? s3Time.slice(3) : '--'}</strong>
              </div>
            </div>
          </div>

          {/* Telemetry HUD: Bottom Right Speedometer */}
          <div className="track-hud-bottom-right">
            <div className="hud-speed-gauge">
              <div className="hud-speed-value">
                <span>{speedKmh}</span>
                <span className="hud-speed-unit">KM/H</span>
              </div>
              <div className="hud-rpm-track">
                <div className="hud-rpm-fill" style={{ width: `${rpmPct}%` }} />
              </div>
              <div className="hud-telemetry-meta">
                <span>GEAR: {speedKmh > 110 ? '4' : speedKmh > 70 ? '3' : speedKmh > 25 ? '2' : '1'}</span>
                <span>STATUS: {isCrashed ? 'CRASH' : isCarParked ? 'PARKED' : raceState === 'RACING' ? 'DRIVING' : 'STANDBY'}</span>
              </div>
            </div>
          </div>

          {/* Bottom Left Driving Instructions */}
          <div className="track-hud-bottom-left">
            💡 <strong>Controls:</strong> Move pointer to the Start Line and click <strong>START RACE</strong> (or press <kbd>Space</kbd>). Stay within white track lines!
          </div>

          {/* START GRID INTERACTIVE LAUNCH CARD (Stationed right at Start Line) */}
          {raceState !== 'RACING' && !isCrashed && (
            <div className="track-grid-launch-card">
              <div className="track-grid-launch-meta">
                <span className="track-grid-launch-badge">
                  {isCarParked ? 'NAV PIT STOP' : 'START GRID • P1'}
                </span>
                <h3 className="track-grid-launch-title">
                  {isCarParked ? 'Car Docked in Pit Bay' : 'Ready to Race'}
                </h3>
                <p className="track-grid-launch-sub">
                  {isCarParked
                    ? 'Click to launch car from pit stop to track'
                    : 'Click button to launch from grid'}
                </p>
              </div>
              <button
                type="button"
                className={`track-launch-action-btn ${isCarParked ? 'is-pit-launch' : ''}`}
                onClick={startRace}
              >
                <span>{isCarParked ? '🏎️ LAUNCH CAR' : 'START RACE 🏁'}</span>
              </button>
            </div>
          )}

          {/* Crash Alert Banner */}
          {isCrashed && (
            <div className="track-crash-banner" role="alert">
              <div className="track-crash-title">{crashMessage}</div>
              <p className="track-crash-sub">Tires left the tarmac boundary. Resetting to Start Grid...</p>
            </div>
          )}

          {/* Lap Finish Celebration Banner */}
          {showCelebration && (
            <div className="track-celebration-banner">
              <div className="celebration-flag">🏁</div>
              <h2 className="celebration-title">CLEAN LAP FINISHED!</h2>
              <div className="celebration-time">{lastFinishedTime}</div>
              {isNewRecord && <div className="celebration-record-tag">⭐ NEW PERSONAL BEST RECORD! ⭐</div>}
              <div>
                <button
                  type="button"
                  className="celebration-btn"
                  onClick={() => setShowCelebration(false)}
                >
                  Continue Racing 🏎️
                </button>
              </div>
            </div>
          )}

          {/* ===================== VECTOR CIRCUIT SVG ===================== */}
          <svg
            className="track-svg-arena"
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Circuit Grass Infield Gradient */}
              <radialGradient id="grassGrad" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="#0b1712" />
                <stop offset="60%" stopColor="#07100c" />
                <stop offset="100%" stopColor="#040907" />
              </radialGradient>

              {/* Sector 1 Gradient: Light Cyan / Emerald */}
              <linearGradient id="s1Grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              {/* Sector 2 Gradient: Vibrant Ocean / Royal Blue */}
              <linearGradient id="s2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>

              {/* Sector 3 Gradient: Deep Electric Navy / Sky Blue */}
              <linearGradient id="s3Grad" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              {/* Checkered Start/Finish Pattern */}
              <pattern id="checkeredPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill="#ffffff" />
                <rect x="10" y="0" width="10" height="10" fill="#111827" />
                <rect x="0" y="10" width="10" height="10" fill="#111827" />
                <rect x="10" y="10" width="10" height="10" fill="#ffffff" />
              </pattern>
            </defs>

            {/* Infield Grass Background */}
            <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#grassGrad)" />

            {/* Subtle SAE BIT Sindri Watermark on Infield */}
            <g opacity="0.07" transform="translate(680, 500) scale(0.65)" textAnchor="middle">
              <circle r="130" fill="none" stroke="#f6b719" strokeWidth="8" strokeDasharray="16 8" />
              <text y="14" fill="#f6b719" fontSize="34" fontWeight="900" letterSpacing="4">
                SAE BIT SINDRI
              </text>
            </g>

            {/* Gravel Run-Off Traps around high-speed braking zones */}
            <ellipse cx="60" cy="540" rx="45" ry="70" fill="#2d2215" opacity="0.35" />
            <ellipse cx="910" cy="740" rx="60" ry="70" fill="#2d2215" opacity="0.35" />
            <ellipse cx="975" cy="210" rx="55" ry="45" fill="#2d2215" opacity="0.35" />
            <ellipse cx="1275" cy="270" rx="50" ry="90" fill="#2d2215" opacity="0.35" />

            {/* 1. ELEVATION SILHOUETTE (Under-track 3D drop offset shadow matching user reference image) */}
            <path
              d={TRACK_PATH_D}
              fill="none"
              stroke="#ffffff"
              strokeWidth="70"
              strokeLinejoin="round"
              strokeLinecap="round"
              transform="translate(-10, 14)"
              opacity="0.08"
            />

            {/* Pit Lane Branch Accent (Running parallel to Turn 15 into main straight) */}
            <path
              d="M 620 145 C 570 155, 520 195, 480 235 L 430 280"
              fill="none"
              stroke="#475569"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.4"
            />

            {/* 2. LAYER 1: OUTER RED & WHITE MOTORSPORT KERBS */}
            <path
              d={TRACK_PATH_D}
              fill="none"
              stroke="#ef4444"
              strokeWidth="76"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d={TRACK_PATH_D}
              fill="none"
              stroke="#ffffff"
              strokeWidth="76"
              strokeDasharray="16 16"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* 3. LAYER 2: DARK ASPHALT TARMAC */}
            <path
              ref={pathRef}
              id="circuitAsphalt"
              d={TRACK_PATH_D}
              fill="none"
              stroke="#111622"
              strokeWidth="64"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* 4. LAYER 3: INNER ASPHALT CORE */}
            <path
              d={TRACK_PATH_D}
              fill="none"
              stroke="#1a2234"
              strokeWidth="56"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* 5. DYNAMIC SECTOR RACING GLOW LINE (Matching image cyan/blue/navy flow) */}
            <path
              d={TRACK_PATH_D}
              fill="none"
              stroke="#0284c7"
              strokeWidth="10"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity="0.65"
            />

            {/* 6. WHITE TRACK BOUNDARY EDGE LINES */}
            <path
              d={TRACK_PATH_D}
              fill="none"
              stroke="#f8fafc"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Centerline Racing Guideline (Apex Hints) */}
            <path
              d={TRACK_PATH_D}
              fill="none"
              stroke="rgba(246, 183, 25, 0.28)"
              strokeWidth="1.5"
              strokeDasharray="10 16"
              strokeLinejoin="round"
            />

            {/* Checkered Start / Finish Line Banner & Grid (T15 Main Straight) */}
            <g id="startFinishLine" transform="translate(360, 270) rotate(-40)">
              <rect x="-14" y="-32" width="28" height="64" fill="url(#checkeredPattern)" rx="2" />
              <line x1="-14" y1="-32" x2="-14" y2="32" stroke="#ffffff" strokeWidth="3" />
              <line x1="14" y1="-32" x2="14" y2="32" stroke="#ffffff" strokeWidth="3" />
              <text x="0" y="-38" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle" letterSpacing="1">
                START / FINISH 🏁
              </text>
            </g>

            {/* Starting Grid Boxes on Main Straight (P1, P2, P3) */}
            <g transform="translate(320, 305) rotate(-40)">
              <rect x="-12" y="-12" width="24" height="16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <text x="0" y="0" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="800" textAnchor="middle">P1</text>
            </g>
            <g transform="translate(280, 340) rotate(-40)">
              <rect x="-12" y="-12" width="24" height="16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <text x="0" y="0" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="800" textAnchor="middle">P2</text>
            </g>
            <g transform="translate(240, 375) rotate(-40)">
              <rect x="-12" y="-12" width="24" height="16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <text x="0" y="0" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="800" textAnchor="middle">P3</text>
            </g>

            {/* SPEED TRAP MARKER (Target rings in red before Turn 1, matching image!) */}
            <g transform="translate(195, 425)">
              <circle cx="0" cy="0" r="18" fill="rgba(239, 68, 68, 0.12)" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
              <circle cx="0" cy="0" r="10" fill="#ffffff" stroke="#ef4444" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="4" fill="#ef4444" />
              <text x="-26" y="-22" fill="#ef4444" fontSize="11" fontWeight="900" letterSpacing="0.5">
                SPEED TRAP
              </text>
            </g>

            {/* SECTOR 1 GATE (Descida do Lago exit, Turn 4) */}
            <g transform="translate(870, 740) rotate(-65)">
              <line x1="0" y1="-32" x2="0" y2="32" stroke="#38bdf8" strokeWidth="3.5" strokeDasharray="6 4" />
              <circle cx="0" cy="0" r="13" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <text x="0" y="4" fill="#38bdf8" fontSize="10" fontWeight="900" textAnchor="middle">S1</text>
            </g>

            {/* SECTOR 2 GATE (Junção exit, Turn 12) */}
            <g transform="translate(995, 580) rotate(10)">
              <line x1="0" y1="-32" x2="0" y2="32" stroke="#a855f7" strokeWidth="3.5" strokeDasharray="6 4" />
              <circle cx="0" cy="0" r="13" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
              <text x="0" y="4" fill="#a855f7" fontSize="10" fontWeight="900" textAnchor="middle">S2</text>
            </g>

            {/* SECTOR 3 GATE (Arquibancadas high-speed sweep, Turn 14) */}
            <g transform="translate(1210, 200) rotate(-60)">
              <line x1="0" y1="-32" x2="0" y2="32" stroke="#f6b719" strokeWidth="3.5" strokeDasharray="6 4" />
              <circle cx="0" cy="0" r="13" fill="#0f172a" stroke="#f6b719" strokeWidth="2" />
              <text x="0" y="4" fill="#f6b719" fontSize="10" fontWeight="900" textAnchor="middle">S3</text>
            </g>

            {/* Sector Infield Annotations (Matching image typography) */}
            <g transform="translate(260, 720)">
              <text x="0" y="0" fill="#64748b" fontSize="20" fontWeight="900">S1</text>
              <text x="0" y="14" fill="#475569" fontSize="10" fontWeight="700">(Sector 1)</text>
            </g>

            <g transform="translate(730, 480)">
              <text x="0" y="0" fill="#64748b" fontSize="20" fontWeight="900">S2</text>
              <text x="0" y="14" fill="#475569" fontSize="10" fontWeight="700">(Sector 2)</text>
            </g>

            <g transform="translate(1180, 220)">
              <text x="0" y="0" fill="#64748b" fontSize="20" fontWeight="900">S3</text>
              <text x="0" y="14" fill="#475569" fontSize="10" fontWeight="700">(Sector 3)</text>
            </g>

            {/* Corner Number Badges (1 through 15) exactly as depicted in the image */}
            {[
              { id: '1', x: 100, y: 515 },
              { id: '2', x: 95, y: 610 },
              { id: '3', x: 110, y: 770 },
              { id: '4', x: 865, y: 835 },
              { id: '5', x: 850, y: 640 },
              { id: '6', x: 505, y: 465 },
              { id: '7', x: 530, y: 330 },
              { id: '8', x: 650, y: 290 },
              { id: '9', x: 690, y: 430 },
              { id: '10', x: 920, y: 270 },
              { id: '11', x: 925, y: 450 },
              { id: '12', x: 995, y: 615 },
              { id: '13', x: 1275, y: 420 },
              { id: '14', x: 1135, y: 120 },
              { id: '15', x: 560, y: 110 },
            ].map((t) => (
              <g key={t.id} transform={`translate(${t.x}, ${t.y})`}>
                <circle cx="0" cy="0" r="11" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                <text x="0" y="4" fill="#94a3b8" fontSize="10" fontWeight="800" textAnchor="middle">
                  {t.id}
                </text>
              </g>
            ))}

            {/* Straight Names & DRS Zones */}
            <text x="490" y="845" fill="#f6b719" fontSize="11" fontWeight="800" textAnchor="middle">
              DRS ZONE 1 • Reta Oposta
            </text>
            <text x="750" y="115" fill="#f6b719" fontSize="11" fontWeight="800" textAnchor="middle">
              DRS ZONE 2 • Arquibancadas Straight
            </text>
          </svg>
        </div>

        {/* ===================== TRACK SPECS & GUIDELINES ===================== */}
        <section className="track-specs-grid">
          <div className="track-spec-card">
            <div className="track-spec-title">Circuit Scale</div>
            <div className="track-spec-value">4.31 KM</div>
            <div className="track-spec-sub">Formula Student GP Layout</div>
          </div>

          <div className="track-spec-card">
            <div className="track-spec-title">Turns & Corners</div>
            <div className="track-spec-value">15 Turns</div>
            <div className="track-spec-sub">9 Left • 6 Right technical turns</div>
          </div>

          <div className="track-spec-card">
            <div className="track-spec-title">All-Time Best Lap</div>
            <div className="track-spec-value">
              {bestLapTime ? formatTime(bestLapTime * 1000) : '31.420s'}
            </div>
            <div className="track-spec-sub">Set by SAE Sindri Pilot</div>
          </div>

          <div className="track-spec-card">
            <div className="track-spec-title">Formula Car Telemetry</div>
            <div className="track-spec-value">60 FPS 3D Physics</div>
            <div className="track-spec-sub">Double wishbones • Drift tire smoke</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TrackPage;
