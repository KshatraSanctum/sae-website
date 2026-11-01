import React, { useEffect, useRef } from 'react';

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  baseVy: number;
  vy: number;
  vx: number;
  opacity: number;
  swaySpeed: number;
  swayOffset: number;
  swayAmp: number;
  windSensitivity: number;
}

interface WindWisp {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  maxOpacity: number;
  waveAmp: number;
  waveFreq: number;
  phase: number;
  life: number;
  maxLife: number;
}

export const WinterCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = false;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const flakes: Snowflake[] = [];
    const wisps: WindWisp[] = [];

    // Wind dynamics
    let baseWind = 0.55;
    let currentWind = baseWind;
    let gustPhase = 0;
    let gustProgress = 0;
    let gustDuration = 180;
    let nextGustCountdown = prefersReducedMotion ? 999999 : 240 + Math.random() * 200;

    const getOptimalFlakeCount = (w: number) => {
      if (prefersReducedMotion) return 14;
      if (w < 380) return 20; // Small phones (iPhone SE, Fold cover)
      if (w < 480) return 26; // Standard mobile (iPhone 13-16, Pixel, Galaxy)
      if (w < 768) return 36; // Large mobile / small tablets
      return 52;              // Desktop
    };

    const initFlakes = () => {
      flakes.length = 0;
      const targetCount = getOptimalFlakeCount(width || window.innerWidth || 390);
      const isMobile = (width || window.innerWidth) < 640;

      for (let i = 0; i < targetCount; i++) {
        // Slightly smaller flake radii on mobile to keep proportions natural
        const maxRadius = isMobile ? 3.0 : 4.0;
        const radius = Math.random() < 0.7
          ? 0.9 + Math.random() * (isMobile ? 1.2 : 1.5)
          : 2.2 + Math.random() * (maxRadius - 2.2);

        const baseVy = 0.4 + (radius / 4.0) * 1.2;

        flakes.push({
          x: Math.random() * (width || 400),
          y: Math.random() * (height || 500),
          radius,
          baseVy,
          vy: baseVy,
          vx: 0,
          opacity: 0.3 + Math.random() * 0.55,
          swaySpeed: 0.015 + Math.random() * 0.025,
          swayOffset: Math.random() * Math.PI * 2,
          swayAmp: isMobile ? 0.3 + Math.random() * 0.8 : 0.5 + Math.random() * 1.2,
          windSensitivity: 0.6 + Math.random() * 0.8,
        });
      }
    };

    const spawnWisp = () => {
      const isMobile = width < 640;
      const maxConcurrent = isMobile ? 2 : 4;
      if (wisps.length >= maxConcurrent || prefersReducedMotion) return;

      const length = isMobile
        ? 50 + Math.random() * 60
        : 90 + Math.random() * 150;

      const speed = isMobile ? 2.8 + Math.random() * 2.2 : 3.5 + Math.random() * 3.5;
      const maxLife = (width + length) / speed;

      wisps.push({
        x: -length - Math.random() * 30,
        y: 15 + Math.random() * Math.max(height - 30, 80),
        length,
        speed,
        opacity: 0,
        maxOpacity: isMobile ? 0.22 : 0.28,
        waveAmp: isMobile ? 2 + Math.random() * 4 : 3 + Math.random() * 6,
        waveFreq: 0.02 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
        life: 0,
        maxLife,
      });
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const newWidth = Math.floor(rect.width);
      const newHeight = Math.floor(rect.height);

      if (newWidth <= 0 || newHeight <= 0) return;

      const isMobile = newWidth < 640;
      // Cap DPR on mobile at 1.5 to protect battery and GPU memory on 3x Retina displays
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

      width = newWidth;
      height = newHeight;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Rebalance flakes if count changed due to screen resize / orientation
      const targetCount = getOptimalFlakeCount(width);
      if (flakes.length !== targetCount) {
        initFlakes();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    resizeCanvas();
    initFlakes();

    // IntersectionObserver to pause loop when footer is offscreen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry ? entry.isIntersecting : false;
        if (isVisible) {
          lastTimestamp = performance.now();
          startAnimation();
        }
      },
      { threshold: 0.01 }
    );

    intersectionObserver.observe(canvas);

    let lastTimestamp = performance.now();

    const render = (now: number) => {
      if (!isVisible) return;

      const dt = Math.min((now - lastTimestamp) / 16.667, 2.0);
      lastTimestamp = now;

      // Update wind gust cycle
      if (!prefersReducedMotion) {
        if (gustPhase === 0) {
          nextGustCountdown -= dt;
          if (nextGustCountdown <= 0) {
            gustPhase = 1;
            gustProgress = 0;
            gustDuration = 130 + Math.random() * 90;
            spawnWisp();
            if (width >= 640 && Math.random() > 0.4) {
              setTimeout(spawnWisp, 320);
            }
          }
        } else {
          gustProgress += dt;
          const norm = gustProgress / gustDuration;
          if (norm >= 1) {
            gustPhase = 0;
            currentWind = baseWind;
            nextGustCountdown = 260 + Math.random() * 240;
          } else {
            const gustCurve = Math.sin(norm * Math.PI);
            currentWind = baseWind + gustCurve * (width < 640 ? 2.0 : 2.8);
          }
        }
      } else {
        currentWind = 0.2;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw wind wisps (breeze streams)
      if (wisps.length > 0) {
        for (let i = wisps.length - 1; i >= 0; i--) {
          const w = wisps[i];
          w.life += dt;
          w.x += w.speed * dt;

          const lifeProgress = w.life / w.maxLife;
          if (lifeProgress < 0.25) {
            w.opacity = (lifeProgress / 0.25) * w.maxOpacity;
          } else if (lifeProgress > 0.75) {
            w.opacity = ((1 - lifeProgress) / 0.25) * w.maxOpacity;
          } else {
            w.opacity = w.maxOpacity;
          }

          if (w.life >= w.maxLife || w.x - w.length > width) {
            wisps.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          const segments = width < 640 ? 8 : 12;
          const step = w.length / segments;

          for (let s = 0; s <= segments; s++) {
            const px = w.x + s * step;
            const py = w.y + Math.sin(px * w.waveFreq + w.phase) * w.waveAmp;
            if (s === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }

          const grad = ctx.createLinearGradient(w.x, w.y, w.x + w.length, w.y);
          grad.addColorStop(0, 'rgba(210, 235, 255, 0)');
          grad.addColorStop(0.35, `rgba(225, 243, 255, ${w.opacity})`);
          grad.addColorStop(0.7, `rgba(186, 230, 253, ${w.opacity * 0.9})`);
          grad.addColorStop(1, 'rgba(210, 235, 255, 0)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = width < 640 ? 1.1 : 1.35;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.restore();
        }
      }

      // 2. Draw & update snowflakes
      for (let i = 0; i < flakes.length; i++) {
        const flake = flakes[i];
        flake.swayOffset += flake.swaySpeed * dt;

        const sway = Math.sin(flake.swayOffset) * flake.swayAmp;
        const windDrift = currentWind * flake.windSensitivity;
        flake.x += (windDrift + sway) * dt;
        flake.y += flake.vy * dt;

        if (flake.y > height + flake.radius) {
          flake.y = -flake.radius * 2;
          flake.x = Math.random() * (width + 80) - 40;
        }
        if (flake.x > width + 20) {
          flake.x = -15;
        } else if (flake.x < -20) {
          flake.x = width + 15;
        }

        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 248, 255, ${flake.opacity})`;
        ctx.fill();

        // Extra sparkle on foreground flakes
        if (flake.radius > 2.5) {
          ctx.beginPath();
          ctx.arc(flake.x - flake.radius * 0.25, flake.y - flake.radius * 0.25, flake.radius * 0.38, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity * 0.85})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const startAnimation = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(render);
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="winter-footer-canvas"
      aria-hidden="true"
    />
  );
};
