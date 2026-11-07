import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/swarm-build-overlay.css';

interface TargetItem {
  id: string;
  element: HTMLElement;
  isHeading: boolean;
  status: 'building' | 'done';
  cursorIndex: number;
  buildStartTime: number;
  dragDuration: number;
}

interface CursorState {
  name: string;
  color: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  opacity: number;
  busy: boolean;
}

interface ActiveWireframe {
  id: string;
  color: string;
  left: number;
  top: number;
  width: number;
  height: number;
  isHeading: boolean;
}

const FIGMA_CURSORS = [
  { name: 'Isihin', color: '#0d99ff' },   // Figma Blue
  { name: 'Priya', color: '#9747ff' },    // Figma Purple
  { name: 'Saurav', color: '#14ae5c' },   // Figma Green
  { name: 'UI_Bot', color: '#f24e1e' },   // Figma Red-Orange
  { name: 'Elena', color: '#ff7262' },    // Coral
  { name: 'Marcus', color: '#00c48c' },   // Teal
  { name: 'Kiran', color: '#f6b719' },    // Gold
  { name: 'Liam', color: '#e056fd' },     // Magenta
];

// Universal structural selectors matching Home, About, Team, Events, Achievements, Sponsors, Track, Join
const STRUCTURAL_SELECTORS = [
  // 1. Navigation & Brand
  '.ref-brand',
  '.ref-nav-center .ref-nav-link',
  '#navPitBtn',
  '.ref-header-actions .ref-btn',

  // 2. Global Headings & Typography
  'h1',
  'h2',
  'h3',
  'h4',
  '.hero-tag-row',
  '.slogan-word',
  '.hero-subtext',
  '.ref-eyebrow',
  '.section-title',
  '.team-eyebrow-row',
  '.team-subtext',

  // 3. Homepage Hero & Teaser Sections
  '.hero-visual-box-desktop',
  '.hero-logo-telemetry',
  '.hero-cta-row',

  // 3a. Homepage Vehicle Architecture & Subsystems
  '.subsystem-header',
  '.subsystem-heading',
  '.subsystem-lead',
  '.subsystem-tabs-bar',
  '.subsystem-tab-btn',
  '.subsystem-visual-panel',
  '.subsystem-telemetry-hud',
  '.subsystem-detail-card',

  // 3b. Homepage About Proving Ground
  '.ref-about-left',
  '.ref-about-heading',
  '.ref-stats-grid',
  '.ref-stat-box',

  // 3c. Homepage Events Highlights
  '.ref-events-head',
  '.ref-events-heading',
  '.ref-event-item',

  // 3d. Homepage Industry Sponsors
  '.ref-sponsors-left',
  '.ref-sponsors-heading',
  '.sponsors-marquee-container',

  // 3e. Homepage Life at SAE Glimpses
  '.ref-glimpses-header-wrap',
  '.ref-glimpses-heading',
  '.glimpses-marquee-container',
  '.glimpse-card',

  // 3f. Homepage Team Teaser
  '.image-frame',
  '.ref-team-heading',
  '.ref-team-copy',
  '.ref-skills-row',

  // 3g. Homepage Join CTA Banner
  '.ref-join-cta-inner',
  '.ref-join-cta-heading',
  '.ref-join-cta-btn',

  // 4. About Page (including Faculty Advisors & Numbers)
  '.about-header-row',
  '.ref-about-page-heading',
  '.about-lead-copy',
  '.about-story-text',
  '.about-principle-item',
  '.about-prof-card',
  '.about-visual-card',
  '.about-card-badge',
  '.about-numbers-stack',
  '.about-num-row',
  '.ref-what-header',
  '.pillar-card',
  '.about-affiliation-card',
  '.team-join-banner',

  // 5. Sponsors Page
  '.ref-team-heading',
  '.filters',
  '.filters .chip',
  '.sponsor-card',
  '.sponsor-logo-box',
  '.sponsor-cta-banner',
  '.sponsor-cta-content',
  '.sponsor-cta-action',

  // 6. Join the Society Page
  '.join-hero-wrap',
  '.join-header-row',
  '.ref-join-page-heading',
  '.join-lead-copy',
  '.join-banner',
  '.join-banner-content',
  '.btn-join-primary',
  '.join-sections-toolbar',
  '.join-card',
  '.crew-card',
  '.step-card',
  '.join-form-wrapper',
  '.join-form-card',
  '.faq-card',
  '.join-contact-box',

  // 7. Race Track Page
  '.track-header',
  '.track-title-group',
  '.track-badge-row',
  '.track-title',
  '.track-subtitle',
  '.track-header-actions',
  '.track-ctrl-btn',
  '.track-arena-wrapper',
  '.track-specs-grid',
  '.track-spec-card',
  '.track-leaderboard',
  '.track-leaderboard-card',
  '.track-mobile-card',

  // 8. Team Page
  '.team-header-row',
  '.team-card',
  '.team-member-card',
  '.team-card-media',
  '.department-card',
  '.subsystem-hero-panel',

  // 9. Events Page Cards
  '.events-page-header',
  '.events-title',
  '.events-lead-text',
  '.events-header-eyebrow',
  '.events-controls-section',
  '.events-controls-bar',
  '.events-filter-group',
  '.events-filter-btn',
  '.events-ticker-wrapper',
  '.featured-event-card',
  '.featured-card-visual',
  '.event-roster-card',
  '.roster-card-body',
  '.timeline-milestone-item',
  '.timeline-milestone-card',
  '.events-bottom-cta',

  // 10. Achievements & Competitions Page Cards
  '.comp-hero-header-row',
  '.comp-hero-title',
  '.comp-hero-desc',
  '.comp-hero-stats-badge',
  '.comp-filter-section',
  '.comp-filter-container',
  '.comp-filter-btn',
  '.comp-milestone-card',
  '.comp-card-content',
  '.comp-photo-media',
  '.comp-sidebar-sticky',
  '.comp-sidebar-header',
  '.comp-sidebar-footer',
  '.comp-timeline-track',

  // 11. Buttons, Filters, Badges & Visuals
  '.ref-btn-primary',
  '.ref-btn-light',
  '.ref-skill-pill',
  '.div-pill',
  '.chapter-pill-tag',
  '.badge',
  '.event-tag',
  '.events-view-switcher',
  '.events-filter-group button',
  '.comp-filter-pills button',
  '.comp-filter-pill',
  '.comp-timeline-nav-btn',
  '.glimpse-card',
  '.ref-card',
  '.stat-item',
  '.about-metric-card',
  '.footer-contact-card',
  '.footer-divisions-strip',
];

// Smooth Apple-style ease-out curve (cubic-bezier(0.16, 1, 0.3, 1))
const easeOutSmooth = (t: number): number => {
  const p = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - p, 3.2);
};

export const SwarmBuildOverlay: React.FC = () => {
  const location = useLocation();
  const [wireframes, setWireframes] = useState<ActiveWireframe[]>([]);

  const activeTargetsRef = useRef<Map<string, TargetItem>>(new Map());
  const builtElementsSetRef = useRef<WeakSet<HTMLElement>>(new WeakSet());
  const cursorsRef = useRef<CursorState[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const isEnabledRef = useRef<boolean>(true);
  const [, setTick] = useState(0);

  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize or reset cursors
  const initCursors = useCallback(() => {
    if (typeof window === 'undefined') return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    cursorsRef.current = FIGMA_CURSORS.map((c, i) => {
      const angle = (i / FIGMA_CURSORS.length) * Math.PI * 2;
      const startX = vw / 2 + Math.cos(angle) * (vw * 0.45);
      const startY = vh / 2 + Math.sin(angle) * (vh * 0.45);
      return {
        ...c,
        x: startX,
        y: startY,
        targetX: startX,
        targetY: startY,
        opacity: 0,
        busy: false,
      };
    });
  }, []);

  // Safe reveal for an element (removes hidden state, adds swarm-built, & ensures visibility)
  const revealElementSafely = useCallback((el: HTMLElement) => {
    el.classList.remove('swarm-build-hidden');
    el.classList.add('swarm-built');

    // Also trigger scroll-reveal visibility if data-reveal attribute is present
    if (
      el.hasAttribute('data-reveal') ||
      el.classList.contains('reveal-up') ||
      el.classList.contains('reveal-side')
    ) {
      el.classList.add('is-visible');
    }

    // Ensure parent container with data-reveal is also revealed so child is never trapped
    const parentReveal = el.closest<HTMLElement>('[data-reveal], .reveal-up, .reveal-side');
    if (parentReveal) {
      parentReveal.classList.add('is-visible');
    }

    // Ensure all descendant articles, prof-items, images and data-reveal children are unhidden
    el.querySelectorAll<HTMLElement>(
      '[data-reveal], .reveal-up, .reveal-side, article, .prof-item, .about-prof-card, .about-visual-card, .ref-stat-box, .ref-event-item, .glimpse-card, .image-frame, img'
    ).forEach((child) => {
      child.classList.add('is-visible');
      child.classList.add('swarm-built');
      child.classList.remove('swarm-build-hidden');
    });
  }, []);

  // Complete cleanup & full reveal
  const cleanupAndRevealAll = useCallback(() => {
    isEnabledRef.current = false;
    document.documentElement.classList.remove('swarm-initial-blank');
    document.documentElement.classList.remove('swarm-page-blank');

    // Immediately remove hidden class from every element on page
    document.querySelectorAll('.swarm-build-hidden').forEach((el) => {
      revealElementSafely(el as HTMLElement);
    });

    if (observerRef.current) observerRef.current.disconnect();
    if (mutationObserverRef.current) mutationObserverRef.current.disconnect();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    setWireframes([]);
  }, [revealElementSafely]);

  // Build a specific element with an assigned Figma cursor (slower, smoother, deliberate)
  const buildSingleElement = useCallback((el: HTMLElement, id: string) => {
    if (!isEnabledRef.current || builtElementsSetRef.current.has(el)) return;

    const rect = el.getBoundingClientRect();
    if (rect.width <= 10 || rect.height <= 8) return;

    builtElementsSetRef.current.add(el);

    // Pick first available cursor or cycle through
    const cursors = cursorsRef.current;
    if (cursors.length === 0) return;

    let chosenIdx = cursors.findIndex((c) => !c.busy);
    if (chosenIdx === -1) {
      chosenIdx = Math.floor(Math.random() * cursors.length);
    }

    const isHeading = el.tagName.startsWith('H') || el.classList.contains('slogan-word');

    // Hide element temporarily while cursor draws it
    el.classList.add('swarm-build-hidden');

    // Fail-safe: Under NO circumstances can any element stay hidden past 1200ms
    setTimeout(() => {
      revealElementSafely(el);
    }, 1200);

    // Slower, smoother drag durations for graceful visibility
    const dragDuration = isHeading ? 580 : 480;

    const targetItem: TargetItem = {
      id,
      element: el,
      isHeading,
      status: 'building',
      cursorIndex: chosenIdx,
      buildStartTime: performance.now(),
      dragDuration,
    };

    cursors[chosenIdx].busy = true;
    cursors[chosenIdx].opacity = 1;
    activeTargetsRef.current.set(id, targetItem);
  }, [revealElementSafely]);

  // Scan current page and assemble visible elements
  const scanPageElements = useCallback(() => {
    if (!isEnabledRef.current || isReducedMotion || typeof window === 'undefined') return;

    const vh = window.innerHeight;
    const currentPath = location.pathname;
    const query = STRUCTURAL_SELECTORS.join(', ');
    const elements = document.querySelectorAll<HTMLElement>(query);

    let viewportCount = 0;

    elements.forEach((el, idx) => {
      if (builtElementsSetRef.current.has(el) || el.closest('.swarm-build-overlay')) return;

      const rect = el.getBoundingClientRect();
      if (rect.width <= 10 || rect.height <= 8) return;

      const uniqueId = `build-${currentPath.replace(/[^a-zA-Z0-9]/g, '_')}-${idx}`;

      // 1. If currently in the viewport: assemble in a smooth, rhythmic wave!
      if (rect.top >= -50 && rect.top < vh + 50) {
        // Slower, pleasant 110ms stagger cadence
        const stagger = Math.min(viewportCount * 110, 1600);
        viewportCount++;
        setTimeout(() => {
          if (isEnabledRef.current) {
            buildSingleElement(el, uniqueId);
          }
        }, stagger);
      } else {
        // 2. If below the fold: observe it so it builds ONLY when scrolled into view!
        // We do NOT pre-hide it, preventing any black gaps!
        observerRef.current?.observe(el);
      }
    });
  }, [location.pathname, isReducedMotion, buildSingleElement]);

  // Main 60fps render loop with smoother physics and inertia
  useEffect(() => {
    if (!isEnabledRef.current) return;

    let animId: number;

    const renderLoop = () => {
      const now = performance.now();
      const currentWireframes: ActiveWireframe[] = [];
      const cursors = cursorsRef.current;

      activeTargetsRef.current.forEach((item, id) => {
        if (item.status === 'building') {
          const { element, isHeading, cursorIndex, buildStartTime, dragDuration } = item;
          const cursor = cursors[cursorIndex];
          const rect = element.getBoundingClientRect();

          const elapsed = now - buildStartTime;
          const dragProgress = easeOutSmooth(elapsed / dragDuration);

          const currentW = Math.max(14, rect.width * dragProgress);
          const currentH = Math.max(14, rect.height * dragProgress);

          // Cursor glides along the drag edge
          if (cursor) {
            cursor.targetX = rect.left + currentW;
            cursor.targetY = rect.top + currentH;
            cursor.opacity = 1;
          }

          currentWireframes.push({
            id,
            color: cursor ? cursor.color : '#0d99ff',
            left: rect.left,
            top: rect.top,
            width: currentW,
            height: currentH,
            isHeading,
          });

          // Finished drag: reveal element smoothly and free cursor
          if (elapsed >= dragDuration) {
            item.status = 'done';
            revealElementSafely(element);
            activeTargetsRef.current.delete(id);
            if (cursor) cursor.busy = false;
          }
        }
      });

      // Update cursor physics with natural smoothing & inertia (0.15 factor)
      cursors.forEach((cursor) => {
        cursor.x += (cursor.targetX - cursor.x) * 0.15;
        cursor.y += (cursor.targetY - cursor.y) * 0.15;

        // Graceful fade out when idle
        if (!cursor.busy && cursor.opacity > 0) {
          cursor.opacity = Math.max(0, cursor.opacity - 0.018);
        }
      });

      setWireframes(currentWireframes);
      setTick((prev) => prev + 1);

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    animFrameRef.current = animId;

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [revealElementSafely]);

  // Handle route change and lazy page mounting
  useEffect(() => {
    isEnabledRef.current = true;
    initCursors();

    // Start with blank slate on route change so page never flashes before agents build it
    document.documentElement.classList.add('swarm-page-blank');

    // Reset built elements set for the newly mounted route
    builtElementsSetRef.current = new WeakSet();

    const releaseTimer = setTimeout(() => {
      document.documentElement.classList.remove('swarm-initial-blank');
      document.documentElement.classList.remove('swarm-page-blank');
    }, 2200);

    // Scroll-driven IntersectionObserver (builds incoming cards as user scrolls)
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            observerRef.current?.unobserve(el);
            if (!builtElementsSetRef.current.has(el)) {
              buildSingleElement(el, `scroll-${Math.random().toString(36).slice(2, 7)}`);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '120px 0px 50px 0px',
        threshold: 0.02,
      }
    );

    // Initial scan of page
    scanPageElements();

    // Repeated scans to catch React.lazy() chunk mounts
    const t1 = setTimeout(scanPageElements, 70);
    const t2 = setTimeout(scanPageElements, 220);
    const t3 = setTimeout(scanPageElements, 500);

    // Watch for dynamic DOM additions in #mainContent
    const mainEl = document.getElementById('mainContent') || document.body;
    if (mutationObserverRef.current) mutationObserverRef.current.disconnect();

    mutationObserverRef.current = new MutationObserver(() => {
      scanPageElements();
    });

    mutationObserverRef.current.observe(mainEl, { childList: true, subtree: true });

    return () => {
      clearTimeout(releaseTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (mutationObserverRef.current) mutationObserverRef.current.disconnect();
    };
  }, [location.pathname, initCursors, scanPageElements, buildSingleElement]);

  // Keyboard shortcut (ESC) & Footer Replay
  useEffect(() => {
    const handleReplayEvent = () => {
      isEnabledRef.current = true;
      builtElementsSetRef.current = new WeakSet();
      document.documentElement.classList.add('swarm-initial-blank');
      document.querySelectorAll('.swarm-built').forEach((el) => {
        el.classList.remove('swarm-built');
      });
      initCursors();
      scanPageElements();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cleanupAndRevealAll();
      }
    };

    window.addEventListener('sae:replay-swarm-build', handleReplayEvent);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('sae:replay-swarm-build', handleReplayEvent);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [initCursors, scanPageElements, cleanupAndRevealAll]);

  const hasVisibleCursors = cursorsRef.current.some((c) => c.opacity > 0.02);

  if (wireframes.length === 0 && !hasVisibleCursors) {
    return null;
  }

  return (
    <div
      className="swarm-build-overlay"
      aria-hidden="true"
      role="presentation"
    >
      {/* 1. Temporary 1.5px Dashed Bounding Boxes with W × H badges */}
      {wireframes.map((box) => (
        <div
          key={box.id}
          className="swarm-wireframe-box"
          style={{
            borderColor: box.color,
            backgroundColor: `${box.color}14`,
            left: `${box.left}px`,
            top: `${box.top}px`,
            width: `${box.width}px`,
            height: `${box.height}px`,
          }}
        >
          <span className="swarm-corner-handle tl" />
          <span className="swarm-corner-handle tr" />
          <span className="swarm-corner-handle bl" />
          <span className="swarm-corner-handle br" />

          <span
            className="swarm-dim-badge"
            style={{ backgroundColor: box.color }}
          >
            {Math.round(box.width)} × {Math.round(box.height)}
          </span>

          {box.isHeading && (
            <span
              className="swarm-typewriter-caret"
              style={{
                left: `${Math.min(box.width - 4, 28)}px`,
                top: `${box.height / 2 - 8}px`,
              }}
            />
          )}
        </div>
      ))}

      {/* 2. 8 Figma Multiplayer SVG Cursors & Name Tags */}
      {cursorsRef.current.map((cursor) => (
        <div
          key={cursor.name}
          className="swarm-figma-cursor"
          style={{
            transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`,
            opacity: cursor.opacity,
          }}
        >
          <svg
            className="swarm-figma-cursor-svg"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M5.65 2.16a1 1 0 0 0-1.44 1.11l3.6 15.53a1 1 0 0 0 1.83.21l3.68-7.36 7.36-3.68a1 1 0 0 0 .21-1.83L5.65 2.16z"
              fill={cursor.color}
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>

          <div
            className="swarm-figma-name-tag"
            style={{ backgroundColor: cursor.color }}
          >
            <span>{cursor.name}</span>
          </div>
        </div>
      ))}

      {/* 3. Subtle Floating Skip Button */}
      <button
        type="button"
        className="swarm-skip-btn"
        onClick={cleanupAndRevealAll}
        aria-label="Skip live build animation"
      >
        <span>Skip</span>
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  );
};

export default SwarmBuildOverlay;
