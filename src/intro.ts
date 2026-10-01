import { ASCII_LOGO, ASCII_COLORS, LOGO_COLS, LOGO_ROWS } from './asciiLogoData';

// ===================== ASCII INTRO ANIMATION =====================

interface AsciiParticle {
  char: string;
  color: string;
  glowColor: string;
  tx: number;       // Target X (grid slot)
  ty: number;       // Target Y
  sx: number;       // Start X (outside viewport)
  sy: number;       // Start Y
  delay: number;    // Start delay in ms
  duration: number; // Flight duration in ms
  scatterVx: number;// Outward velocity X for disappear phase
  scatterVy: number;// Outward velocity Y
  arrivedTime: number;
}

const SCRAMBLE_GLYPHS = "0123456789ABCDEF!@#$%&*+-/<>{}[]=";

export function initIntro(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runIntro);
  } else {
    runIntro();
  }
}

function runIntro(): void {
  const overlay = document.getElementById('introOverlay');
  const canvas = document.getElementById('asciiCanvas') as HTMLCanvasElement | null;
  const subtitle = document.getElementById('introSubtitle');
  const skipBtn = document.getElementById('introSkipBtn');

  if (!overlay || !canvas) return;


  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animId = 0;
  let done = false;
  let particles: AsciiParticle[] = [];
  let startTime = 0;
  let activeFontSize = 12;

  function endIntro(immediate = false): void {
    if (done) return;
    if (immediate) {
      done = true;
      cancelAnimationFrame(animId);
      overlay?.classList.add('done');
    } else {
      overlay?.classList.add('fading');
      setTimeout(() => {
        done = true;
        cancelAnimationFrame(animId);
        overlay?.classList.add('done');
      }, 400);
    }
  }

  // Expose global skip function
  (window as any).skipIntro = () => endIntro(false);

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      endIntro(false);
    });
  }

  // Keyboard shortcut (Escape or Space)
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === ' ') {
      window.removeEventListener('keydown', onKeyDown);
      endIntro(false);
    }
  };
  window.addEventListener('keydown', onKeyDown);

  // Click anywhere to skip
  overlay.addEventListener('click', () => {
    endIntro(false);
  });

  // Setup / resize particles grid
  function setupParticles(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas!.width = width * dpr;
    canvas!.height = height * dpr;
    canvas!.style.width = width + 'px';
    canvas!.style.height = height + 'px';

    ctx!.setTransform(1, 0, 0, 1, 0, 0);
    ctx!.scale(dpr, dpr);

    // Compute character size and grid offset
    const maxW = Math.min(width * 0.92, 780);
    const maxH = Math.min(height * 0.72, 580);
    const charWidth = Math.max(3.6, Math.min(maxW / LOGO_COLS, (maxH / LOGO_ROWS) * 0.58));
    const charHeight = charWidth / 0.56;

    const totalW = LOGO_COLS * charWidth;
    const totalH = LOGO_ROWS * charHeight;
    const startLeft = (width - totalW) / 2;
    const startTop = Math.max(20, (height - totalH) / 2 - 35);
    const centerX = width / 2;
    const centerY = startTop + totalH / 2;

    activeFontSize = Math.max(9, Math.round(charWidth * 1.5));

    particles = [];

    for (let r = 0; r < LOGO_ROWS; r++) {
      const asciiRow = ASCII_LOGO[r] || '';
      const colorRow = ASCII_COLORS[r] || '';

      for (let c = 0; c < LOGO_COLS; c++) {
        const ch = asciiRow[c] || ' ';
        if (ch === ' ') continue;

        const colorCode = colorRow[c] || 'M';
        let color = '#94a3b8';
        let glowColor = 'rgba(148, 163, 184, 0.4)';

        if (colorCode === 'G') {
          color = '#f59e0b';
          glowColor = 'rgba(245, 158, 11, 0.8)';
        } else if (colorCode === 'W') {
          color = '#ffffff';
          glowColor = 'rgba(255, 255, 255, 0.7)';
        } else if (colorCode === 'S') {
          color = '#e2e8f0';
          glowColor = 'rgba(226, 232, 240, 0.5)';
        } else if (colorCode === 'M') {
          color = '#94a3b8';
          glowColor = 'rgba(148, 163, 184, 0.3)';
        } else {
          color = '#475569';
          glowColor = 'transparent';
        }

        const tx = startLeft + c * charWidth + charWidth / 2;
        const ty = startTop + r * charHeight + charHeight / 2;

        // Choose random spawn side (0: top, 1: bottom, 2: left, 3: right)
        const side = Math.floor(Math.random() * 4);
        let sx = 0;
        let sy = 0;
        const offsetDist = 80 + Math.random() * 320;

        if (side === 0) {
          sx = Math.random() * width;
          sy = -offsetDist;
        } else if (side === 1) {
          sx = Math.random() * width;
          sy = height + offsetDist;
        } else if (side === 2) {
          sx = -offsetDist;
          sy = Math.random() * height;
        } else {
          sx = width + offsetDist;
          sy = Math.random() * height;
        }

        // Staggered flight timing
        const delay = Math.random() * 950; // 0 to 950ms
        const duration = 1200 + Math.random() * 350; // 1200 to 1550ms

        // Outward disperse vector for disappearance
        const dx = tx - centerX;
        const dy = ty - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const scatterAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.6;
        const scatterSpeed = 5 + Math.random() * 9 + (dist / 80);

        particles.push({
          char: ch,
          color,
          glowColor,
          tx,
          ty,
          sx,
          sy,
          delay,
          duration,
          scatterVx: Math.cos(scatterAngle) * scatterSpeed,
          scatterVy: Math.sin(scatterAngle) * scatterSpeed,
          arrivedTime: 0
        });
      }
    }
  }

  setupParticles();
  window.addEventListener('resize', () => {
    if (!done) setupParticles();
  });

  // Easing function: smooth exponential deceleration into place
  function easeOutQuart(x: number): number {
    return 1 - Math.pow(1 - x, 4);
  }

  // Main render loop
  function render(now: number): void {
    if (done) return;
    if (!startTime) startTime = now;
    const elapsed = now - startTime;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Clear canvas
    ctx!.clearRect(0, 0, width, height);

    // Font setup
    ctx!.font = `bold ${activeFontSize}px "IBM Plex Mono", "Courier New", monospace`;
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';

    // Animation phases
    // Phase 1: Inflow & Assembly (0 - 2400ms)
    // Phase 2: Formed & Hold with Shimmer (2400 - 4500ms)
    // Phase 3: Disperse & Disappear (4500 - 5300ms)
    // Phase 4: Fade to landing page (5100 - 5600ms)

    const isHoldPhase = elapsed >= 2400 && elapsed < 4500;
    const isDispersePhase = elapsed >= 4500;

    // Show subtitle when logo is formed
    if (isHoldPhase && subtitle && !subtitle.classList.contains('visible')) {
      subtitle.classList.add('visible');
    }

    // Hide subtitle during disperse
    if (isDispersePhase && subtitle && subtitle.classList.contains('visible')) {
      subtitle.classList.remove('visible');
    }

    // Auto-advance to landing page after animation finishes
    if (elapsed >= 5100 && !overlay!.classList.contains('fading')) {
      overlay!.classList.add('fading');
    }
    if (elapsed >= 5600) {
      endIntro(true);
      return;
    }

    // Shimmer sweep wave position during hold phase
    const shimmerProgress = isHoldPhase ? (elapsed - 2400) / 2100 : -1;
    const shimmerX = shimmerProgress >= 0 ? width * (shimmerProgress * 1.4 - 0.2) : -9999;

    const len = particles.length;
    for (let i = 0; i < len; i++) {
      const p = particles[i];
      let currentX = p.tx;
      let currentY = p.ty;
      let currentChar = p.char;
      let currentColor = p.color;
      let currentAlpha = 1;

      if (!isDispersePhase) {
        // Still flying in or holding
        const flightTime = elapsed - p.delay;
        if (flightTime <= 0) {
          // Particle hasn't started moving yet
          continue;
        }

        const progress = Math.min(1, flightTime / p.duration);

        if (progress < 1) {
          // In flight: interpolate position and scramble character
          const ease = easeOutQuart(progress);
          currentX = p.sx + (p.tx - p.sx) * ease;
          currentY = p.sy + (p.ty - p.sy) * ease;
          currentAlpha = Math.min(1, progress * 3);

          // Scramble characters while flying
          const scrambleIndex = (Math.floor(now / 45) + i * 3) % SCRAMBLE_GLYPHS.length;
          currentChar = SCRAMBLE_GLYPHS[scrambleIndex];
          currentColor = '#38bdf8'; // Glowing cyan while in flight
        } else {
          // Arrived and locked
          if (!p.arrivedTime) p.arrivedTime = elapsed;
          const timeSinceArrival = elapsed - p.arrivedTime;

          // Brief flash upon lock-in
          if (timeSinceArrival < 180) {
            currentColor = '#ffffff';
          }

          // Shimmer wave effect
          if (isHoldPhase && Math.abs(currentX - shimmerX) < 40) {
            currentColor = '#ffffff';
          }
        }
      } else {
        // Disperse / disappear phase: scatter outward & fade
        const disperseElapsed = elapsed - 4500;
        const disperseProgress = Math.min(1, disperseElapsed / 800);
        const dt = disperseElapsed / 1000;
        const accel = 1 + dt * 3.5;

        currentX = p.tx + p.scatterVx * dt * 45 * accel;
        currentY = p.ty + p.scatterVy * dt * 45 * accel;
        currentAlpha = Math.max(0, 1 - disperseProgress);

        // Subtle scramble as it disintegrates
        if (Math.random() < 0.2) {
          const scrambleIndex = (Math.floor(now / 60) + i) % SCRAMBLE_GLYPHS.length;
          currentChar = SCRAMBLE_GLYPHS[scrambleIndex];
        }
      }

      if (currentAlpha <= 0) continue;

      ctx!.globalAlpha = currentAlpha;
      ctx!.fillStyle = currentColor;
      ctx!.fillText(currentChar, currentX, currentY);
    }

    animId = requestAnimationFrame(render);
  }

  // Start the animation immediately
  animId = requestAnimationFrame(render);
}
