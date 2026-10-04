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
  const logoContainer = document.getElementById('introLogoContainer');
  const subtitle = document.getElementById('introSubtitle');
  const skipBtn = document.getElementById('introSkipBtn');
  const navRing = document.getElementById('navBrandLogoRing');

  if (!overlay || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Initially hide the navbar logo so the animated logo is the only one visible
  if (navRing) {
    navRing.classList.add('nav-logo-hidden');
  }

  let animId = 0;
  let done = false;
  let hasShrunk = false;
  let particles: AsciiParticle[] = [];
  let startTime = 0;
  let activeFontSize = 12;

  function revealNavLogo(): void {
    if (navRing) {
      navRing.classList.remove('nav-logo-hidden');
      navRing.classList.add('nav-logo-docked');
    }
  }

  function endIntro(immediate = false): void {
    if (done) return;
    done = true;
    cancelAnimationFrame(animId);
    revealNavLogo();
    if (immediate) {
      overlay?.classList.add('done');
    } else {
      overlay?.classList.add('fading');
      setTimeout(() => {
        overlay?.classList.add('done');
      }, 300);
    }
  }

  // Expose global skip function
  (window as any).skipIntro = () => endIntro(true);

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      endIntro(true);
    });
  }

  // Keyboard shortcut (Escape or Space)
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === ' ') {
      window.removeEventListener('keydown', onKeyDown);
      endIntro(true);
    }
  };
  window.addEventListener('keydown', onKeyDown);

  // Click anywhere to skip
  overlay.addEventListener('click', () => {
    endIntro(true);
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

    const logoSize = Math.min(totalW, totalH);
    const radius = logoSize / 2;

    if (logoContainer && !hasShrunk) {
      logoContainer.style.width = `${logoSize}px`;
      logoContainer.style.height = `${logoSize}px`;
      logoContainer.style.left = `${startLeft + (totalW - logoSize) / 2}px`;
      logoContainer.style.top = `${startTop + (totalH - logoSize) / 2}px`;
    }

    activeFontSize = Math.max(9, Math.round(charWidth * 1.5));

    particles = [];

    for (let r = 0; r < LOGO_ROWS; r++) {
      const asciiRow = ASCII_LOGO[r] || '';
      const colorRow = ASCII_COLORS[r] || '';

      for (let c = 0; c < LOGO_COLS; c++) {
        const ch = asciiRow[c] || ' ';
        if (ch === ' ') continue;

        const tx = startLeft + c * charWidth + charWidth / 2;
        const ty = startTop + r * charHeight + charHeight / 2;

        // Ensure particles stay within circular emblem area
        const distFromCenter = Math.hypot(tx - centerX, ty - centerY);
        if (distFromCenter > radius * 0.985) continue;

        const colorCode = colorRow[c] || 'M';
        let color = '#f6b719';
        let glowColor = 'rgba(246, 183, 25, 0.4)';

        if (colorCode === 'G') {
          color = '#f6b719';
          glowColor = 'rgba(246, 183, 25, 0.85)';
        } else if (colorCode === 'W') {
          color = '#ffffff';
          glowColor = 'rgba(255, 255, 255, 0.7)';
        } else if (colorCode === 'S') {
          color = '#fde68a';
          glowColor = 'rgba(253, 230, 138, 0.5)';
        } else if (colorCode === 'M') {
          color = '#f59e0b';
          glowColor = 'rgba(245, 158, 11, 0.4)';
        } else {
          color = '#d97706';
          glowColor = 'transparent';
        }

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

        // Staggered flight timing (fast, high-velocity stream)
        const delay = Math.random() * 380;
        const duration = 600 + Math.random() * 220;

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
          arrivedTime: 0
        });
      }
    }
  }

  setupParticles();
  window.addEventListener('resize', () => {
    if (!done && !hasShrunk) setupParticles();
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

    // Animation phases:
    // Phase 1: Inflow & ASCII Assembly in YELLOW (0 - 1050ms)
    // Phase 2: Formed & Real SAE Logo Appears in Center (1050ms - 1350ms)
    // Phase 3: SAE Logo Shrinks into Navbar & Website Appears (1350ms - 2150ms)
    const isLogoFormed = elapsed >= 1050;
    const isShrinkPhase = elapsed >= 1350;

    // Show real logo and subtitle when ASCII logo is formed
    if (isLogoFormed && logoContainer && !logoContainer.classList.contains('visible')) {
      logoContainer.classList.add('visible');
    }
    if (isLogoFormed && subtitle && !subtitle.classList.contains('visible')) {
      subtitle.classList.add('visible');
    }

    // Rapid cross-fade out of ASCII canvas as real logo takes over
    if (isLogoFormed) {
      const fadeProgress = Math.min(1, (elapsed - 1050) / 200);
      canvas!.style.opacity = String(Math.max(0, 1 - fadeProgress));

      if (fadeProgress >= 1) {
        canvas!.style.display = 'none';
        ctx!.clearRect(0, 0, width, height);
      }
    } else {
      canvas!.style.display = 'block';
      canvas!.style.opacity = '1';
    }

    // Shrink & glide directly into the navbar brand logo ring
    if (isShrinkPhase && !hasShrunk) {
      hasShrunk = true;

      const targetRect = navRing
        ? navRing.getBoundingClientRect()
        : { top: 16, left: 24, width: 48, height: 48 };

      // Reveal the website by fading the dark overlay backdrop to transparent
      overlay!.classList.add('revealing');
      if (subtitle) subtitle.classList.add('fading');

      // Animate the logo container into the exact navbar ring slot
      if (logoContainer) {
        logoContainer.classList.add('flying-to-nav');
        logoContainer.style.top = `${targetRect.top}px`;
        logoContainer.style.left = `${targetRect.left}px`;
        logoContainer.style.width = `${targetRect.width}px`;
        logoContainer.style.height = `${targetRect.height}px`;
      }

      // Complete docking exactly when flight finishes (750ms later)
      setTimeout(() => {
        revealNavLogo();
        endIntro(true);
      }, 750);
    }

    // If canvas is hidden, stop drawing particles
    if (elapsed >= 1250) {
      if (!done) animId = requestAnimationFrame(render);
      return;
    }

    const len = particles.length;
    for (let i = 0; i < len; i++) {
      const p = particles[i];
      let currentX = p.tx;
      let currentY = p.ty;
      let currentChar = p.char;
      let currentColor = p.color;
      let currentAlpha = 1;

      // Particle flight timing
      const flightTime = elapsed - p.delay;
      if (flightTime <= 0) {
        continue;
      }

      const progress = Math.min(1, flightTime / p.duration);

      if (progress < 1) {
        // In flight: interpolate position, scramble character, glowing yellow
        const ease = easeOutQuart(progress);
        currentX = p.sx + (p.tx - p.sx) * ease;
        currentY = p.sy + (p.ty - p.sy) * ease;
        currentAlpha = Math.min(1, progress * 3);

        const scrambleIndex = (Math.floor(now / 35) + i * 3) % SCRAMBLE_GLYPHS.length;
        currentChar = SCRAMBLE_GLYPHS[scrambleIndex];
        currentColor = '#f6b719'; // Yellow letters flying from outside the screen
      } else {
        // Arrived and locked in target slot
        if (!p.arrivedTime) p.arrivedTime = elapsed;
        const timeSinceArrival = elapsed - p.arrivedTime;

        // Brief flash upon lock-in
        if (timeSinceArrival < 120) {
          currentColor = '#ffffff';
        }
      }

      // Cross-fade out as real logo appears
      if (isLogoFormed) {
        const fadeProgress = Math.min(1, (elapsed - 1050) / 200);
        currentAlpha *= Math.max(0, 1 - fadeProgress);
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
