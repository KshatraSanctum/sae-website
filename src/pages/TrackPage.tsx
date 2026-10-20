import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getActiveCarFollower3D, CarFollower3D } from '../carFollower3D';
import {
  TrackGridLaunchCard,
  TrackLeaderboard,
  TrackMobileCircuitBar,
  TrackMobileHub,
  TrackTelemetryHud,
} from '../components/track';
import { useTrackFullscreen } from '../hooks/useTrackFullscreen';
import {
  getTrackLeaderboardIdentity,
  useTrackLeaderboard,
} from '../hooks/useTrackLeaderboard';
import { TrackAudio } from '../utils/trackAudio';
import {
  TRACK,
  closestTrackPosition,
  screenToTrack,
  trackToScreen,
  type CircuitPoint,
  type TrackDifficulty,
} from '../utils/trackCircuit';
import { readPersonalBest, savePersonalBest } from '../utils/trackRace';
import { getBrowserStorage } from '../utils/storage';
import '../styles/track.css';

const HUD_UPDATE_INTERVAL_MS = 80;
type RaceState = 'STANDBY' | 'STARTING' | 'RACING';
type NextCheckpoint = 's1' | 's2' | 's3' | 'finish';
type TrackTimeout = ReturnType<typeof window.setTimeout>;

const [S1_CHECKPOINT, S2_CHECKPOINT, S3_CHECKPOINT] = TRACK.checkpoints;

interface SamplePoint extends CircuitPoint {
  index: number;
}

export const TrackPage: React.FC = () => {
  const arenaRef = useRef<HTMLDivElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const startZoneRef = useRef<SVGGElement>(null);
  const audioRef = useRef<TrackAudio | null>(null);

  // Gameplay State: 'STANDBY' (on grid waiting for start) | 'STARTING' | 'RACING'
  const [raceState, setRaceState] = useState<RaceState>('STANDBY');
  const raceStateRef = useRef<RaceState>('STANDBY');
  raceStateRef.current = raceState;

  const [isCarParked, setIsCarParked] = useState(false);
  const isCarParkedRef = useRef(false);
  const [isCarAvailable, setIsCarAvailable] = useState(false);
  const isCarAvailableRef = useRef(false);
  const [difficulty, setDifficulty] = useState<TrackDifficulty>('STANDARD');
  const difficultyRef = useRef<TrackDifficulty>(difficulty);
  difficultyRef.current = difficulty;
  const [isMuted, setIsMuted] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [crashMessage, setCrashMessage] = useState('💥 OFF TRACK! RETURNING TO GRID...');

  const {
    session: leaderboardSession,
    entries: leaderboardEntries,
    isConfigured: isLeaderboardConfigured,
    isLoading: isLeaderboardLoading,
    isAuthLoading: isLeaderboardAuthLoading,
    error: leaderboardError,
    authError,
    remoteSubmissionStatus,
    remoteSubmissionMessage,
    signIn: signInToLeaderboard,
    signOut: signOutFromLeaderboard,
    refresh: refreshLeaderboard,
    startRemoteRace,
    submitRemoteScore,
  } = useTrackLeaderboard({ trackId: TRACK.id, difficulty });
  const leaderboardIdentity = getTrackLeaderboardIdentity(leaderboardSession);

  // Telemetry & Timing
  const [lapTimeDisplay, setLapTimeDisplay] = useState('00:00.000');
  const [bestLapTime, setBestLapTime] = useState<number | null>(null);
  const bestLapTimeRef = useRef<number | null>(null);
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
  const nextCheckpointRef = useRef<NextCheckpoint>('s1');
  const lastTrackIndexRef = useRef<number | null>(null);
  const lapProgressRef = useRef(0);
  const reverseTravelRef = useRef(0);
  const lapRouteValidRef = useRef(true);
  const lastCheckpointTimeRef = useRef<number | null>(null);
  const checkpointElapsedRef = useRef<{ s1: number | null; s2: number | null; s3: number | null }>({
    s1: null,
    s2: null,
    s3: null,
  });
  const animFrameRef = useRef<number | null>(null);
  const startTimeoutRef = useRef<TrackTimeout | null>(null);
  const initTimerRef = useRef<TrackTimeout | null>(null);
  const shakeTimeoutRef = useRef<TrackTimeout | null>(null);
  const crashRecoveryTimeoutRef = useRef<TrackTimeout | null>(null);
  const lifecycleTokenRef = useRef(0);
  const isMountedRef = useRef(true);
  const lastHudUpdateRef = useRef(0);
  const fullscreenPendingRef = useRef(false);
  const [isStartHovered, setIsStartHovered] = useState(false);
  const isStartHoveredRef = useRef(false);

  // Mobile / Tablet detection for BETA advisory
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 1024 || window.matchMedia('(pointer: coarse)').matches;
  });
  const [showMobileCircuitMap, setShowMobileCircuitMap] = useState(false);

  useEffect(() => {
    const handleDeviceCheck = () => {
      const isTouchOrSmall =
        window.innerWidth <= 1024 || window.matchMedia('(pointer: coarse)').matches;
      setIsMobileOrTablet(isTouchOrSmall);
    };

    handleDeviceCheck();
    window.addEventListener('resize', handleDeviceCheck);
    window.addEventListener('orientationchange', handleDeviceCheck);

    return () => {
      window.removeEventListener('resize', handleDeviceCheck);
      window.removeEventListener('orientationchange', handleDeviceCheck);
    };
  }, []);

  const setStartZoneHovered = useCallback((hovered: boolean) => {
    if (isStartHoveredRef.current === hovered) return;
    isStartHoveredRef.current = hovered;
    setIsStartHovered(hovered);
  }, []);

  const disarmStartZone = useCallback(() => {
    setStartZoneHovered(false);
  }, [setStartZoneHovered]);

  const handleStartZoneHover = useCallback((event: React.PointerEvent<SVGGElement>) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    if (
      (event.pointerType === 'pen' && (event.buttons !== 0 || event.pressure > 0)) ||
      raceStateRef.current !== 'STANDBY' ||
      fullscreenPendingRef.current ||
      crashRecoveryTimeoutRef.current !== null ||
      document.hidden ||
      !document.hasFocus() ||
      !event.currentTarget.matches(':hover')
    ) {
      disarmStartZone();
      return;
    }

    if (!isStartHoveredRef.current) {
      setStartZoneHovered(true);
      // Moving back onto the circuit releases stale toolbar focus without scrolling.
      arenaRef.current?.focus({ preventScroll: true });
    }
  }, [disarmStartZone, setStartZoneHovered]);

  const handleStartZoneContact = useCallback((event: React.PointerEvent<SVGGElement>) => {
    // Pen contact and touch cannot establish or retain a hover-based start.
    if (event.pointerType !== 'mouse') disarmStartZone();
  }, [disarmStartZone]);

  const clearTrackedTimers = useCallback(() => {
    if (startTimeoutRef.current !== null) {
      window.clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }
    if (initTimerRef.current !== null) {
      window.clearTimeout(initTimerRef.current);
      initTimerRef.current = null;
    }
    if (shakeTimeoutRef.current !== null) {
      window.clearTimeout(shakeTimeoutRef.current);
      shakeTimeoutRef.current = null;
    }
    if (crashRecoveryTimeoutRef.current !== null) {
      window.clearTimeout(crashRecoveryTimeoutRef.current);
      crashRecoveryTimeoutRef.current = null;
    }
  }, []);

  const resetLapTracking = useCallback(() => {
    checkpointsRef.current = { s1: false, s2: false, s3: false };
    nextCheckpointRef.current = 's1';
    lastTrackIndexRef.current = null;
    lapProgressRef.current = 0;
    reverseTravelRef.current = 0;
    lapRouteValidRef.current = true;
    lastCheckpointTimeRef.current = null;
    checkpointElapsedRef.current = { s1: null, s2: null, s3: null };
  }, []);

  const getTrackScreenMatrix = useCallback(() => {
    const path = pathRef.current;
    if (!path) return null;

    const matrix = path.getScreenCTM();
    if (!matrix) return null;

    const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
    if (!Number.isFinite(determinant) || Math.abs(determinant) < 1e-10) return null;

    return matrix;
  }, []);

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
    if (pointsRef.current.length === 0) return null;
    const matrix = getTrackScreenMatrix();
    if (!matrix) return null;

    const startPt = pointsRef.current[0] || TRACK.start;
    const screenPoint = trackToScreen(startPt, matrix);
    if (!Number.isFinite(screenPoint.x) || !Number.isFinite(screenPoint.y)) return null;
    return screenPoint;
  }, [getTrackScreenMatrix]);

  const getStartGridHeading = useCallback(
    (car: CarFollower3D, startScreenPos: { x: number; y: number }) => {
      if (pointsRef.current.length < 2) return TRACK.start.heading;
      const matrix = getTrackScreenMatrix();
      if (!matrix) return TRACK.start.heading;

      const nextScreenPos = trackToScreen(pointsRef.current[1], matrix);
      const startWorld = car.screenToWorld(startScreenPos.x, startScreenPos.y);
      const nextWorld = car.screenToWorld(nextScreenPos.x, nextScreenPos.y);
      if (!startWorld || !nextWorld) return TRACK.start.heading;

      const dx = nextWorld.x - startWorld.x;
      const dz = nextWorld.z - startWorld.z;
      if (!Number.isFinite(dx) || !Number.isFinite(dz) || Math.hypot(dx, dz) < 1e-6) {
        return TRACK.start.heading;
      }
      return Math.atan2(dz, dx);
    },
    [getTrackScreenMatrix]
  );

  // Lock car stationary at the Start Grid Line, facing towards Turn 1.
  const lockCarToGrid = useCallback(
    (carInstance?: CarFollower3D | null) => {
      const car = carInstance || getActiveCarFollower3D();
      if (!car) return;
      const pos = getStartGridScreenPos();
      if (pos) {
        car.lockToGrid(pos.x, pos.y, getStartGridHeading(car, pos));
      }
    },
    [getStartGridHeading, getStartGridScreenPos]
  );

  // Launch and Start the Race
  const startRace = useCallback(() => {
    // Recheck browser hit testing: layout changes can move the zone away from a stationary pointer.
    if (!isStartHoveredRef.current || !startZoneRef.current?.matches(':hover')) {
      disarmStartZone();
      return false;
    }

    const car = getActiveCarFollower3D();
    if (
      !car ||
      !isCarAvailableRef.current ||
      pointsRef.current.length === 0 ||
      getStartGridScreenPos() === null ||
      raceStateRef.current !== 'STANDBY' ||
      startTimeoutRef.current !== null ||
      fullscreenPendingRef.current ||
      crashRecoveryTimeoutRef.current !== null ||
      isCrashedCooldownRef.current ||
      document.hidden ||
      !document.hasFocus()
    ) return false;

    clearTrackedTimers();
    isCrashedCooldownRef.current = false;
    disarmStartZone();
    void startRemoteRace();

    // If car is parked in navbar pit bay, release it first
    if (car.isParked()) {
      car.releaseCar();
    }

    setRaceState('STARTING');
    raceStateRef.current = 'STARTING';
    setLapTimeDisplay('00:00.000');
    setS1Cleared(false);
    setS2Cleared(false);
    setS3Cleared(false);
    setS1Time(null);
    setS2Time(null);
    setS3Time(null);
    setIsCrashed(false);
    setIsShaking(false);
    setShowCelebration(false);

    // Audio rev engine
    audioRef.current?.startEngine();

    // Lock to start grid temporarily so both car and start align
    lockCarToGrid(car);

    // After brief 300ms launch sequence, unlock car so it follows user pointer from the grid
    const startToken = ++lifecycleTokenRef.current;
    startTimeoutRef.current = window.setTimeout(() => {
      startTimeoutRef.current = null;

      const activeCar = getActiveCarFollower3D();
      if (
        !isMountedRef.current ||
        lifecycleTokenRef.current !== startToken ||
        raceStateRef.current !== 'STARTING' ||
        !activeCar ||
        activeCar !== car ||
        activeCar.isParked()
      ) {
        if (isMountedRef.current && raceStateRef.current === 'STARTING') {
          raceStateRef.current = 'STANDBY';
          setRaceState('STANDBY');
        }
        return;
      }

      activeCar.unlockFromGrid();
      lapStartTimeRef.current = performance.now();
      resetLapTracking();
      currentLapElapsedRef.current = 0;
      lastHudUpdateRef.current = 0;
      setS1Cleared(false);
      setS2Cleared(false);
      setS3Cleared(false);
      setS1Time(null);
      setS2Time(null);
      setS3Time(null);
      setRaceState('RACING');
      raceStateRef.current = 'RACING';
    }, 320);
    return true;
  }, [
    clearTrackedTimers,
    disarmStartZone,
    getStartGridScreenPos,
    lockCarToGrid,
    resetLapTracking,
    startRemoteRace,
  ]);

  // Reset to Standby Grid
  const resetToGrid = useCallback(
    (reason?: string, preserveLastLapTimes = false) => {
      clearTrackedTimers();
      ++lifecycleTokenRef.current;
      lapStartTimeRef.current = null;
      currentLapElapsedRef.current = 0;
      if (!preserveLastLapTimes) {
        setLapTimeDisplay('00:00.000');
        setS1Cleared(false);
        setS2Cleared(false);
        setS3Cleared(false);
        setS1Time(null);
        setS2Time(null);
        setS3Time(null);
      }
      setRaceState('STANDBY');
      raceStateRef.current = 'STANDBY';
      resetLapTracking();
      setIsCrashed(false);
      setIsShaking(false);
      setShowCelebration(false);
      setIsNewRecord(false);
      disarmStartZone();
      isCrashedCooldownRef.current = false;
      setSpeedKmh(0);
      setRpmPct(0);
      lastHudUpdateRef.current = 0;

      if (reason) {
        setCrashMessage(reason);
      }

      const car = getActiveCarFollower3D();
      if (car) {
        if (car.isParked()) {
          setIsCarAvailable(true);
          return;
        }
        lockCarToGrid(car);
      }
    },
    [clearTrackedTimers, disarmStartZone, lockCarToGrid, resetLapTracking]
  );

  const handleFullscreenBeforeChange = useCallback(() => {
    resetToGrid('🏁 FULLSCREEN VIEW CHANGED — RACE RESET');
  }, [resetToGrid]);

  const fullscreen = useTrackFullscreen(fullscreenRef, handleFullscreenBeforeChange);
  fullscreenPendingRef.current = fullscreen.pending;

  // Initialize Best Lap from localStorage
  useEffect(() => {
    let savedBest: number | null = null;
    try {
      const saved = readPersonalBest(getBrowserStorage(), difficulty);
      savedBest = saved === null ? null : saved / 1000;
    } catch (_) {
      savedBest = null;
    }

    bestLapTimeRef.current = savedBest;
    setBestLapTime(savedBest);
  }, [difficulty]);

  // Stop lifecycle callbacks from mutating this page after navigation/unmount.
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      ++lifecycleTokenRef.current;
      clearTrackedTimers();
    };
  }, [clearTrackedTimers]);

  // Initialize Track Audio & Mode Setup
  useEffect(() => {
    const audio = new TrackAudio();
    audioRef.current = audio;
    setIsMuted(audio.isAudioMuted);

    // Keyboard shortcuts: a fresh Space press while hovering starts; R resets.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.isComposing) return;
      const target = e.target instanceof Element ? e.target : null;
      const isTextEntry = Boolean(
        target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])') ||
          (target instanceof HTMLElement && target.isContentEditable)
      );

      if (isTextEntry) return;

      if (e.key === 'r' || e.key === 'R') {
        resetToGrid('GRID RESET TRIGGERED');
      } else if (e.key === ' ') {
        if (e.repeat || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
        const nativeControlSelector = 'button, a[href], input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="button"], [role="link"]';
        if (
          target?.closest(nativeControlSelector) ||
          document.activeElement?.closest(nativeControlSelector)
        ) {
          return;
        }

        if (startRace()) e.preventDefault();
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
    let car: CarFollower3D | null = getActiveCarFollower3D();
    let freeDriveCar: CarFollower3D | null = null;

    const updateCarAvailability = (available: boolean) => {
      if (isCarAvailableRef.current === available) return;
      isCarAvailableRef.current = available;
      setIsCarAvailable(available);
    };

    const updateParkedState = (parked: boolean) => {
      if (isCarParkedRef.current === parked) return;
      isCarParkedRef.current = parked;
      setIsCarParked(parked);
    };

    const scheduleResetAlertCleanup = () => {
      shakeTimeoutRef.current = window.setTimeout(() => {
        shakeTimeoutRef.current = null;
        if (isMountedRef.current) {
          setIsShaking(false);
        }
      }, 450);

      crashRecoveryTimeoutRef.current = window.setTimeout(() => {
        crashRecoveryTimeoutRef.current = null;
        if (isMountedRef.current) {
          setIsCrashed(false);
          isCrashedCooldownRef.current = false;
        }
      }, 850);
    };

    const invalidateLap = (reason: string) => {
      if (!lapRouteValidRef.current) return;
      lapRouteValidRef.current = false;
      resetToGrid(reason);
      // resetToGrid prepares the next lap, while this flag prevents another
      // invalidation from the same frame before the state ref is observed.
      lapRouteValidRef.current = false;
      setIsCrashed(true);
      setIsShaking(true);
      scheduleResetAlertCleanup();
    };

    // Enable free drive mode so mouse/touch moves freely on track (even on mobile)
    const enableFreeDrive = () => {
      car = getActiveCarFollower3D();
      if (car) {
        updateCarAvailability(true);
        if (freeDriveCar !== car) {
          car.setForceFreeDrive(true);
          freeDriveCar = car;
        }
        // Put car on the start grid only while the page is not racing.
        if (raceStateRef.current !== 'RACING') {
          lockCarToGrid(car);
        }
      } else {
        updateCarAvailability(false);
      }
    };

    // Retry finding car if instantiated asynchronously
    enableFreeDrive();
    initTimerRef.current = window.setTimeout(() => {
      initTimerRef.current = null;
      enableFreeDrive();
    }, 150);

    // Sample track spline points
    if (pathRef.current) {
      try {
        const totalLen = pathRef.current.getTotalLength();
        const pts: SamplePoint[] = [];
        for (let i = 0; i < TRACK.sampleCount; i++) {
          const pt = pathRef.current.getPointAtLength((i / TRACK.sampleCount) * totalLen);
          pts.push({
            x: pt.x,
            y: pt.y,
            pct: i / TRACK.sampleCount,
            index: i,
          });
        }
        pointsRef.current = pts;
        if (raceStateRef.current !== 'RACING') {
          lockCarToGrid(car);
        }
      } catch (_) {}
    }

    // 60 FPS Animation & Collision Detection Frame Loop
    const tick = () => {
      const currentCar = getActiveCarFollower3D();
      const arena = arenaRef.current;
      const pts = pointsRef.current;

      if (isStartHoveredRef.current && !startZoneRef.current?.matches(':hover')) {
        disarmStartZone();
      }

      if (!currentCar) {
        updateCarAvailability(false);
        updateParkedState(false);
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      updateCarAvailability(true);
      if (freeDriveCar !== currentCar) {
        currentCar.setForceFreeDrive(true);
        freeDriveCar = currentCar;
      }

      if (arena && pts.length > 0) {
        const parked = currentCar.isParked();
        updateParkedState(parked);

        // 1. If car is parked in navbar, pause and disarm collision checks completely!
        if (parked) {
          if (raceStateRef.current !== 'STANDBY') {
            clearTrackedTimers();
            ++lifecycleTokenRef.current;
            lapStartTimeRef.current = null;
            currentLapElapsedRef.current = 0;
            resetLapTracking();
            isCrashedCooldownRef.current = false;
            setRaceState('STANDBY');
            raceStateRef.current = 'STANDBY';
            setLapTimeDisplay('00:00.000');
          }
          animFrameRef.current = requestAnimationFrame(tick);
          return;
        }

        const carScreen = currentCar.getCarScreenPos();

        // Project the shared screen-space car through the rendered SVG matrix.
        // The fullscreen arena preserves the 3:2 viewBox with letterboxing, so
        // wrapper-rectangle ratios would map the car to the wrong track point.
        const matrix = getTrackScreenMatrix();
        const carTrackPoint = matrix ? screenToTrack(carScreen, matrix) : null;
        if (!carTrackPoint || !Number.isFinite(carTrackPoint.x) || !Number.isFinite(carTrackPoint.y)) {
          animFrameRef.current = requestAnimationFrame(tick);
          return;
        }

        // Project against line segments, including the closing segment, so
        // collision and progress do not jump at the start/finish seam.
        const closestPoint = closestTrackPosition(carTrackPoint, pts);
        const minDist = closestPoint.distance;
        const closestIdx = Math.round(closestPoint.pct * TRACK.sampleCount) % TRACK.sampleCount;
        const now = performance.now();

        // Telemetry Speed & Audio modulation
        const rawSpeed = currentCar.getSpeed();
        const kmh = Math.round(rawSpeed * 11.5);
        const shouldUpdateHud = now - lastHudUpdateRef.current >= HUD_UPDATE_INTERVAL_MS;
        if (shouldUpdateHud) {
          lastHudUpdateRef.current = now;
          setSpeedKmh(kmh);
          setRpmPct(Math.min((kmh / 150) * 100, 100));
        }
        audioRef.current?.updateEnginePitch(rawSpeed);

        // 2. If game is in STANDBY or STARTING, dynamically maintain grid lock with live scroll position!
        if (raceStateRef.current !== 'RACING') {
          const livePos = getStartGridScreenPos();
          if (livePos) {
            lockCarToGrid(currentCar);
          }
          animFrameRef.current = requestAnimationFrame(tick);
          return;
        }

        // 3. RACING STATE: Check Track Boundaries
        // Track stroke is 64px, half-width is 32px.
        // Standard allows riding the kerbs (40px); Pro requires staying inside white line (32px).
        const maxAllowedDist = TRACK.tolerance[difficultyRef.current];

        // ================= OFF-TRACK COLLISION DETECTION =================
        if (minDist > maxAllowedDist) {
          if (!isCrashedCooldownRef.current) {
            isCrashedCooldownRef.current = true;

            audioRef.current?.playCrash();
            currentCar.triggerCrashBurst();

            // Return to STANDBY and lock car back at start grid
            resetToGrid('💥 OFF TRACK! HOVER START ZONE AND PRESS SPACE');
            setIsCrashed(true);
            setIsShaking(true);
            scheduleResetAlertCleanup();
            animFrameRef.current = requestAnimationFrame(tick);
            return;
          }
        } else {
          // ================= ON-TRACK PROGRESSION & TIMING =================
          if (lapStartTimeRef.current !== null && lapRouteValidRef.current) {
            const elapsed = now - lapStartTimeRef.current;
            currentLapElapsedRef.current = elapsed;
            if (shouldUpdateHud) {
              setLapTimeDisplay(formatTime(elapsed));
            }

            // Track progress must move forward in the sampled path. Small
            // reverse jitter is tolerated, but sustained reverse travel or a
            // large jump invalidates the lap before any checkpoint can count.
            const previousIndex = lastTrackIndexRef.current;
            if (previousIndex === null) {
              lastTrackIndexRef.current = closestIdx;
            } else {
              let progressDelta = closestIdx - previousIndex;
              if (progressDelta < -TRACK.sampleCount / 2) {
                progressDelta += TRACK.sampleCount;
              } else if (progressDelta > TRACK.sampleCount / 2) {
                progressDelta -= TRACK.sampleCount;
              }

              lastTrackIndexRef.current = closestIdx;

              if (progressDelta > TRACK.sampleCount * TRACK.maxForwardStepPct) {
                invalidateLap('⚠️ LAP INVALID! ROUTE SKIPPED — RETURNING TO GRID...');
                animFrameRef.current = requestAnimationFrame(tick);
                return;
              }

              if (progressDelta < -TRACK.sampleCount * TRACK.maxReverseStepPct) {
                invalidateLap('⚠️ LAP INVALID! REVERSED ROUTE — RETURNING TO GRID...');
                animFrameRef.current = requestAnimationFrame(tick);
                return;
              }

              if (progressDelta < 0) {
                reverseTravelRef.current += Math.abs(progressDelta);
                if (reverseTravelRef.current > TRACK.sampleCount * TRACK.maxReverseProgress) {
                  invalidateLap('⚠️ LAP INVALID! REVERSED ROUTE — RETURNING TO GRID...');
                  animFrameRef.current = requestAnimationFrame(tick);
                  return;
                }
              } else if (progressDelta > 0) {
                reverseTravelRef.current = Math.max(0, reverseTravelRef.current - progressDelta * 0.5);
                lapProgressRef.current += progressDelta / TRACK.sampleCount;
              }
            }

            const progress = lapProgressRef.current;

            // Checkpoints are consumed in order and only by forward crossing.
            // Passing beyond a gate without crossing it invalidates the lap.
            if (nextCheckpointRef.current === S1_CHECKPOINT.id) {
              if (progress > S1_CHECKPOINT.endPct) {
                invalidateLap('⚠️ LAP INVALID! CHECKPOINT 1 SKIPPED — RETURNING TO GRID...');
                animFrameRef.current = requestAnimationFrame(tick);
                return;
              }
              if (
                progress >= S1_CHECKPOINT.startPct &&
                elapsed >= TRACK.minCheckpointMs &&
                (lastCheckpointTimeRef.current === null || elapsed - lastCheckpointTimeRef.current >= TRACK.minCheckpointMs)
              ) {
                nextCheckpointRef.current = S2_CHECKPOINT.id;
                checkpointsRef.current.s1 = true;
                checkpointElapsedRef.current.s1 = elapsed;
                lastCheckpointTimeRef.current = elapsed;
                setS1Cleared(true);
                setS1Time(formatTime(elapsed));
                audioRef.current?.playCheckpoint();
              }
            }

            if (nextCheckpointRef.current === S2_CHECKPOINT.id) {
              if (progress > S2_CHECKPOINT.endPct) {
                invalidateLap('⚠️ LAP INVALID! CHECKPOINT 2 SKIPPED — RETURNING TO GRID...');
                animFrameRef.current = requestAnimationFrame(tick);
                return;
              }
              if (
                progress >= S2_CHECKPOINT.startPct &&
                lastCheckpointTimeRef.current !== null &&
                elapsed - lastCheckpointTimeRef.current >= TRACK.minCheckpointMs
              ) {
                nextCheckpointRef.current = S3_CHECKPOINT.id;
                checkpointsRef.current.s2 = true;
                checkpointElapsedRef.current.s2 = elapsed;
                lastCheckpointTimeRef.current = elapsed;
                setS2Cleared(true);
                setS2Time(formatTime(elapsed));
                audioRef.current?.playCheckpoint();
              }
            }

            if (nextCheckpointRef.current === S3_CHECKPOINT.id) {
              if (progress > S3_CHECKPOINT.endPct) {
                invalidateLap('⚠️ LAP INVALID! CHECKPOINT 3 SKIPPED — RETURNING TO GRID...');
                animFrameRef.current = requestAnimationFrame(tick);
                return;
              }
              if (
                progress >= S3_CHECKPOINT.startPct &&
                lastCheckpointTimeRef.current !== null &&
                elapsed - lastCheckpointTimeRef.current >= TRACK.minCheckpointMs
              ) {
                nextCheckpointRef.current = 'finish';
                checkpointsRef.current.s3 = true;
                checkpointElapsedRef.current.s3 = elapsed;
                lastCheckpointTimeRef.current = elapsed;
                setS3Cleared(true);
                setS3Time(formatTime(elapsed));
                audioRef.current?.playCheckpoint();
              }
            }

            if (nextCheckpointRef.current === 'finish') {
              if (progress > 1.04) {
                invalidateLap('⚠️ LAP INVALID! FINISH LINE SKIPPED — RETURNING TO GRID...');
                animFrameRef.current = requestAnimationFrame(tick);
                return;
              }

              if (progress >= 1) {
                if (elapsed < TRACK.minLapMs) {
                  invalidateLap('⏱️ LAP INVALID! COMPLETE A FULL-LENGTH LAP — RETURNING TO GRID...');
                  animFrameRef.current = requestAnimationFrame(tick);
                  return;
                }

                // CLEAN VALID LAP COMPLETED!
                const lapTimeSec = elapsed / 1000;
                const completedLapMs = Math.round(lapTimeSec * 1000);
                const checkpointTimes = { ...checkpointElapsedRef.current };
                setLastFinishedTime(formatTime(elapsed));
                audioRef.current?.playLapComplete();

                const validCheckpoints =
                  checkpointTimes.s1 !== null &&
                  checkpointTimes.s2 !== null &&
                  checkpointTimes.s3 !== null
                    ? [
                        Math.round(checkpointTimes.s1),
                        Math.round(checkpointTimes.s2),
                        Math.round(checkpointTimes.s3),
                      ]
                    : undefined;

                void submitRemoteScore(completedLapMs, validCheckpoints);

                // Check the locally scoped personal best for this mode.
                const currentBest = bestLapTimeRef.current;
                const isPersonalBest = !currentBest || lapTimeSec < currentBest;
                if (isPersonalBest) {
                  bestLapTimeRef.current = lapTimeSec;
                  setBestLapTime(lapTimeSec);
                  savePersonalBest(
                    getBrowserStorage(),
                    difficultyRef.current,
                    completedLapMs,
                    currentBest === null ? null : Math.round(currentBest * 1000),
                  );
                }

                // Finish the attempt at the grid. A new lap requires the existing
                // hover + Space start flow, while the completed-lap result remains visible.
                resetToGrid(undefined, true);
                setIsNewRecord(isPersonalBest);
                setShowCelebration(true);
              }
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    // Keep car glued to start grid during scroll or resize while on standby
    const handleScrollOrResize = () => {
      disarmStartZone();
      if (raceStateRef.current !== 'STANDBY') {
        resetToGrid('🏁 RACE PAUSED — RESET AFTER VIEWPORT CHANGE');
        return;
      }

      const liveCar = getActiveCarFollower3D();
      const livePos = getStartGridScreenPos();
      if (liveCar && livePos) {
        lockCarToGrid(liveCar);
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        disarmStartZone();
        if (raceStateRef.current !== 'STANDBY') {
          resetToGrid('🏁 RACE PAUSED — RESET AFTER TAB SWITCH');
        }
      }
    };
    const handleWindowBlur = () => {
      disarmStartZone();
      if (raceStateRef.current === 'STARTING') {
        resetToGrid('🏁 START CANCELLED — HOVER START ZONE AND PRESS SPACE');
      }
    };
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (initTimerRef.current !== null) {
        window.clearTimeout(initTimerRef.current);
        initTimerRef.current = null;
      }
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      const activeCar = getActiveCarFollower3D();
      if (activeCar) {
        activeCar.setForceFreeDrive(false);
      }
    };
  }, [
    clearTrackedTimers,
    disarmStartZone,
    getStartGridScreenPos,
    getTrackScreenMatrix,
    lockCarToGrid,
    resetLapTracking,
    resetToGrid,
    submitRemoteScore,
  ]);

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
        <div ref={fullscreenRef} className="track-race-view" id="trackRaceView">
        {/* Circuit Session Header */}
        <header className="track-header">
          <div className="track-title-group">
            <div className="track-badge-row">
              {isMobileOrTablet ? (
                <>
                  <span className="track-badge track-badge-beta">
                    🧪 BETA • DESKTOP ONLY
                  </span>
                  <span className="track-badge">INTERLAGOS GP</span>
                </>
              ) : (
                <>
                  <span className="track-badge">{TRACK.title}</span>
                  {!isCarAvailable ? (
                    <span className="track-badge track-badge-unavailable">
                      ⚠️ 3D CAR UNAVAILABLE
                    </span>
                  ) : isCarParked ? (
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
                  {fullscreen.active && (
                    <span
                      className="track-badge track-badge-fullscreen"
                      aria-label={`Fullscreen race view active (${fullscreen.mode === 'native' ? 'native' : 'expanded'} mode)`}
                    >
                      ⛶ {fullscreen.mode === 'native' ? 'FULLSCREEN' : 'EXPANDED'}
                    </span>
                  )}
                </>
              )}
            </div>
            <h1 className="track-title">{isMobileOrTablet ? 'Race Track Simulator' : TRACK.title}</h1>
            <p className="track-subtitle">
              {isMobileOrTablet
                ? 'Autódromo José Carlos Pace (Interlagos) · 3D Formula Student simulation built by SAE BIT Sindri.'
                : `${TRACK.subtitle}. Drive the 3D Formula Student car with your pointer. Stay inside the track boundaries or respawn!`}
            </p>
          </div>

          <div className="track-header-actions">
            {isMobileOrTablet ? (
              <>
                <a
                  href="https://github.com/saeindiabit-sindri/sae-website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="track-ctrl-btn track-ctrl-btn-contribute"
                  title="Contribute to mobile development on GitHub"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  <span>Contribute 🐙</span>
                </a>
                <Link
                  to="/competitions"
                  className="track-ctrl-btn"
                  title="Return to Competitions page"
                >
                  <span>Exit Circuit ✕</span>
                </Link>
              </>
            ) : (
              <>
                {/* Difficulty Toggle */}
                <button
                  type="button"
                  className={`track-ctrl-btn ${difficulty === 'PRO' ? 'active' : ''}`}
                  onClick={() => setDifficulty((d) => (d === 'STANDARD' ? 'PRO' : 'STANDARD'))}
                  disabled={raceState !== 'STANDBY'}
                  title={raceState === 'STANDBY' ? 'Toggle Track Boundary Tolerance' : 'Reset before changing tolerance'}
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

                {/* Fullscreen / expanded race view */}
                <button
                  type="button"
                  className={`track-ctrl-btn track-ctrl-btn-fullscreen ${fullscreen.active ? 'active' : ''}`}
                  onClick={fullscreen.toggle}
                  disabled={fullscreen.pending}
                  aria-pressed={fullscreen.active}
                  aria-label={fullscreen.active ? 'Exit fullscreen race view' : 'Enter fullscreen race view'}
                  title="Changing fullscreen view resets the current race attempt"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    {fullscreen.active ? (
                      <>
                        <path d="M9 3v6H3" />
                        <path d="M15 21v-6h6" />
                        <path d="M3 9l6-6" />
                        <path d="M21 15l-6 6" />
                      </>
                    ) : (
                      <>
                        <path d="M15 3h6v6" />
                        <path d="M9 21H3v-6" />
                        <path d="M21 3l-6 6" />
                        <path d="M3 21l6-6" />
                      </>
                    )}
                  </svg>
                  <span>{fullscreen.active ? 'Collapse' : 'Expand'}</span>
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
              </>
            )}
          </div>
        </header>

        {(fullscreen.active || fullscreen.message) && (
          <div className="track-fullscreen-status" role="status" aria-live="polite" aria-atomic="true">
            {fullscreen.message && <span className="track-fullscreen-message">{fullscreen.message}</span>}
            {fullscreen.mode === 'expanded' && !fullscreen.message && (
              <span className="track-fullscreen-message">Browser fullscreen unavailable; using expanded race view.</span>
            )}
            {fullscreen.active && (
              <span className="track-fullscreen-escape-hint">
                Press <kbd>Esc</kbd> to exit fullscreen.
              </span>
            )}
          </div>
        )}

        {/* If Mobile / Tablet and not viewing circuit map, show the clean unclipped Mobile Hub */}
        {isMobileOrTablet && !showMobileCircuitMap ? (
          <TrackMobileHub onViewCircuitMap={() => setShowMobileCircuitMap(true)} />
        ) : (
          <>
            {isMobileOrTablet && showMobileCircuitMap && (
              <TrackMobileCircuitBar onBackToDetails={() => setShowMobileCircuitMap(false)} />
            )}

            {!isMobileOrTablet && (
              <div
                id="trackStartHelp"
                className={`track-start-help ${isStartHovered ? 'is-armed' : ''} ${raceState !== 'STANDBY' || isCrashed ? 'is-hidden' : ''}`}
                role="status"
                aria-live="polite"
                aria-hidden={raceState !== 'STANDBY' || isCrashed}
              >
                <span className="track-start-help-icon" aria-hidden="true">💡</span>
                <span>
                  Hover over the highlighted <strong>START ZONE</strong> and keep your pointer there. Press <kbd>Space</kbd> to start. Mouse/trackpad and keyboard required.
                </span>
              </div>
            )}

            {/* ===================== MAIN RACE ARENA ===================== */}
            <div
              ref={arenaRef}
              className={`track-arena-wrapper ${isShaking ? 'is-shaking' : ''} ${isMobileOrTablet ? 'is-mobile-preview' : ''}`}
              id="trackArena"
              tabIndex={-1}
              role="region"
              aria-label="Race circuit"
              aria-describedby={!isMobileOrTablet ? 'trackStartHelp' : undefined}
            >
              {!isMobileOrTablet && (
                <>
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

                  <TrackTelemetryHud
                    raceState={raceState}
                    lapTimeDisplay={lapTimeDisplay}
                    bestLapTime={bestLapTime}
                    formatTime={formatTime}
                    s1Cleared={s1Cleared}
                    s2Cleared={s2Cleared}
                    s3Cleared={s3Cleared}
                    s1Time={s1Time}
                    s2Time={s2Time}
                    s3Time={s3Time}
                    speedKmh={speedKmh}
                    rpmPct={rpmPct}
                    isCrashed={isCrashed}
                    isCarParked={isCarParked}
                  />

                  {!isCarAvailable && (
                    <div className="track-no-car-state" role="status">
                      <strong>3D CAR UNAVAILABLE</strong>
                      <span>WebGL is unavailable. The circuit view remains available.</span>
                    </div>
                  )}

                  {/* Start guidance only; the SVG zone and Space are the start controls. */}
                  {raceState !== 'RACING' && !isCrashed && (
                    <TrackGridLaunchCard
                      isCarAvailable={isCarAvailable}
                      raceState={raceState}
                      isStartHovered={isStartHovered}
                      isCarParked={isCarParked}
                    />
                  )}
                </>
              )}

          {/* Crash Alert Banner */}
          {isCrashed && (
            <div className="track-crash-banner" role="alert">
              <div className="track-crash-title">{crashMessage}</div>
              <p className="track-crash-sub">Track boundary or lap route violation detected. The car is back on the grid.</p>
              <p className="track-crash-instructions">
                Hover over the highlighted <strong>START ZONE</strong> and keep your pointer there. Press <kbd>Space</kbd> to try again after recovery.
              </p>
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
            viewBox={`0 0 ${TRACK.width} ${TRACK.height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Circuit Grass Infield Gradient */}
              <radialGradient id="grassGrad" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="#0b1712" />
                <stop offset="60%" stopColor="#07100c" />
                <stop offset="100%" stopColor="#040907" />
              </radialGradient>

              {/* Checkered Start/Finish Pattern */}
              <pattern id="checkeredPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill="#ffffff" />
                <rect x="10" y="0" width="10" height="10" fill="#111827" />
                <rect x="0" y="10" width="10" height="10" fill="#111827" />
                <rect x="10" y="10" width="10" height="10" fill="#ffffff" />
              </pattern>
            </defs>

            {/* Infield Grass Background */}
            <rect width={TRACK.width} height={TRACK.height} fill="url(#grassGrad)" />

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

            {/* 1. ELEVATION SILHOUETTE (Under-track 3D drop offset shadow) */}
            <path
              d={TRACK.path}
              fill="none"
              stroke="#ffffff"
              strokeWidth={TRACK.kerbWidth - 6}
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
              d={TRACK.path}
              fill="none"
              stroke="#ef4444"
              strokeWidth={TRACK.kerbWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d={TRACK.path}
              fill="none"
              stroke="#ffffff"
              strokeWidth={TRACK.kerbWidth}
              strokeDasharray="16 16"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* 3. LAYER 2: DARK ASPHALT TARMAC */}
            <path
              ref={pathRef}
              id="circuitAsphalt"
              d={TRACK.path}
              fill="none"
              stroke="#111622"
              strokeWidth={TRACK.asphaltWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* 4. LAYER 3: INNER ASPHALT CORE */}
            <path
              d={TRACK.path}
              fill="none"
              stroke="#1a2234"
              strokeWidth={TRACK.asphaltWidth - 8}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* 5. DYNAMIC SECTOR RACING GLOW LINE (Matching image cyan/blue/navy flow) */}
            <path
              d={TRACK.path}
              fill="none"
              stroke="#0284c7"
              strokeWidth="10"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity="0.65"
            />

            {/* 6. WHITE TRACK BOUNDARY EDGE LINES */}
            <path
              d={TRACK.path}
              fill="none"
              stroke="#f8fafc"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Centerline Racing Guideline (Apex Hints) */}
            <path
              d={TRACK.path}
              fill="none"
              stroke="rgba(246, 183, 25, 0.28)"
              strokeWidth="1.5"
              strokeDasharray="10 16"
              strokeLinejoin="round"
            />

            {/* Checkered Start / Finish Line Banner & Grid (T15 Main Straight) */}
            <g
              id="startFinishLine"
              transform={`translate(${TRACK.start.x}, ${TRACK.start.y}) rotate(${TRACK.start.rotation})`}
            >
              <rect x="-14" y="-32" width="28" height="64" fill="url(#checkeredPattern)" rx="2" />
              <line x1="-14" y1="-32" x2="-14" y2="32" stroke="#ffffff" strokeWidth="3" />
              <line x1="14" y1="-32" x2="14" y2="32" stroke="#ffffff" strokeWidth="3" />
              <text x="0" y="-38" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle" letterSpacing="1">
                START / FINISH 🏁
              </text>
            </g>

            {/* Starting Grid Boxes on Main Straight (P1, P2, P3) */}
            {TRACK.grid.map((gridPosition) => (
              <g
                key={gridPosition.label}
                transform={`translate(${gridPosition.x}, ${gridPosition.y}) rotate(${TRACK.start.rotation})`}
              >
                <rect x="-12" y="-12" width="24" height="16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                <text x="0" y="0" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="800" textAnchor="middle">
                  {gridPosition.label}
                </text>
              </g>
            ))}

            {/* Live start-zone hover target. It follows the first track
                segment instead of relying on a viewport-relative div. */}
            <g
              ref={startZoneRef}
              className={`track-start-arm-zone ${isStartHovered ? 'is-armed is-hovered' : ''}`}
              transform={`translate(${TRACK.start.x}, ${TRACK.start.y}) rotate(${(TRACK.start.heading * 180) / Math.PI})`}
              onPointerEnter={handleStartZoneHover}
              onPointerMove={handleStartZoneHover}
              onPointerLeave={disarmStartZone}
              onPointerCancel={disarmStartZone}
              onPointerDown={handleStartZoneContact}
              role="group"
              aria-label="START ZONE: keep hovering here and press Space to start"
              aria-describedby="trackStartHelp"
            >
              <rect className="track-start-arm-zone-hit" x="46" y="-42" width="112" height="84" rx="12" />
              <rect className="track-start-arm-zone-outline" x="52" y="-34" width="86" height="68" rx="10" />
              <text className="track-start-arm-zone-label" x="101" y="-49" textAnchor="middle">
                {isStartHovered ? 'KEEP HOVERING + SPACE' : 'HOVER + SPACE TO START'}
              </text>
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

            {/* Sector gates use the same geometry source as lap validation. */}
            {TRACK.checkpoints.map((checkpoint) => (
              <g
                key={checkpoint.id}
                transform={`translate(${checkpoint.x}, ${checkpoint.y}) rotate(${checkpoint.rotation})`}
              >
                <line x1="0" y1="-32" x2="0" y2="32" stroke={checkpoint.color} strokeWidth="3.5" strokeDasharray="6 4" />
                <circle cx="0" cy="0" r="13" fill="#0f172a" stroke={checkpoint.color} strokeWidth="2" />
                <text x="0" y="4" fill={checkpoint.color} fontSize="10" fontWeight="900" textAnchor="middle">
                  {checkpoint.label}
                </text>
              </g>
            ))}

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
      </>
        )}
        </div>

        <TrackLeaderboard
          session={
            leaderboardSession
              ? {
                  displayName: leaderboardIdentity.displayName,
                  email: leaderboardIdentity.email,
                }
              : null
          }
          entries={leaderboardEntries}
          isLoading={isLeaderboardLoading}
          error={leaderboardError}
          authError={authError}
          isAuthLoading={isLeaderboardAuthLoading}
          remoteSubmissionStatus={remoteSubmissionStatus}
          remoteSubmissionMessage={remoteSubmissionMessage}
          difficulty={difficulty}
          trackName={TRACK.title}
          isConfigured={isLeaderboardConfigured}
          configurationMessage="Add the Supabase public project values and deploy the race functions to enable global scores."
          formatLapTime={(score) => formatTime(score)}
          onSignIn={signInToLeaderboard}
          onSignOut={signOutFromLeaderboard}
          onRefresh={refreshLeaderboard}
        />

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
            <div className="track-spec-title">Personal Best</div>
            <div className="track-spec-value">
              {bestLapTime ? formatTime(bestLapTime * 1000) : '--:--.---'}
            </div>
            <div className="track-spec-sub">Saved locally for {difficulty} mode</div>
          </div>

          <div className="track-spec-card">
            <div className="track-spec-title">Formula Car Telemetry</div>
            <div className="track-spec-value">Time-Based 3D Physics</div>
            <div className="track-spec-sub">Double wishbones • Drift tire smoke</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TrackPage;
