import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMobileNavigation } from '../../hooks/useMobileNavigation';
import { shouldShowIntro } from '../../intro';

interface NavItem {
  path: string;
  label: string;
  altPaths?: string[];
}

interface NavbarProps {
  readonly loadingPath?: string | null;
  readonly loadingProgress?: number;
  readonly onNavigationStart?: (path: string) => void;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/about', label: 'About' },
  { path: '/achievements', label: 'Achievements', altPaths: ['/competitions'] },
  { path: '/events', label: 'Events' },
  { path: '/team', label: 'Team', altPaths: ['/bearers'] },
  { path: '/sponsors', label: 'Sponsors' },
];

export const Navbar: React.FC<NavbarProps> = ({
  loadingPath = null,
  loadingProgress = 0,
  onNavigationStart,
}) => {
  const location = useLocation();
  const { isOpen: mobileOpen, toggle: toggleMobileMenu, close: closeMobileMenu } = useMobileNavigation(location.pathname);
  const [scrolled, setScrolled] = useState(false);
  const [isIntroRunning] = useState(() => shouldShowIntro());

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLinkActive = (item: NavItem) => {
    if (location.pathname === item.path) return true;
    if (item.altPaths && item.altPaths.includes(location.pathname)) return true;
    return false;
  };

  const handleNavigationStart = (event: React.MouseEvent<HTMLAnchorElement>, path: string): void => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      location.pathname === path
    ) {
      return;
    }

    onNavigationStart?.(path);
  };

  const renderLoadingProgress = (path: string): React.ReactNode => {
    if (loadingPath !== path) return null;

    const progress = Math.max(0, Math.min(100, Math.round(loadingProgress)));
    return (
      <span className="ref-nav-loading-track" aria-hidden="true">
        <span className="ref-nav-loading-bar" style={{ width: `${progress}%` }} />
      </span>
    );
  };

  return (
    <header
      className={`ref-header ${isHome ? 'ref-header-home' : ''} ${scrolled ? 'is-scrolled' : ''} ${mobileOpen ? 'menu-open' : ''}`}
      id="top"
    >
      <div className="ref-container ref-header-inner">
        <Link
          className="ref-brand"
          to="/"
          aria-label="SAE BIT Sindri home"
        >
          <span className={`ref-brand-logo-ring ${isIntroRunning ? 'nav-logo-hidden' : ''}`} id="navBrandLogoRing">
            <img src="/bit-sindri-sae-logo.png" alt="SAE BIT Sindri Society Logo" width="36" height="36" decoding="async" />
          </span>
          <span className="ref-brand-text">
            <span className="ref-brand-title">SAE BIT Sindri</span>
            <span className="ref-brand-sub">Collegiate Society</span>
          </span>
        </Link>

        {/* Center navigation links */}
        <nav className="ref-nav ref-nav-center" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`ref-nav-link ${isLinkActive(item) ? 'active' : ''} ${loadingPath === item.path ? 'is-loading' : ''}`}
              aria-busy={loadingPath === item.path}
              aria-label={loadingPath === item.path ? `${item.label}, loading` : item.label}
              onClick={(event) => handleNavigationStart(event, item.path)}
            >
              {item.label}
              {renderLoadingProgress(item.path)}
            </Link>
          ))}
        </nav>

        {/* Right corner actions: Pit Stop & Join CTA */}
        <div className="ref-header-actions">
          {/* Compact Pit Stop Button (Clean & Integrated for 3D Car Follower) */}
          <button
            type="button"
            className="nav-pit-btn"
            id="navPitBtn"
            aria-label="Park 3D Formula car in Pit Stop"
          >
            <span className="nav-pit-dot" id="navPitDot"></span>
            <span className="nav-pit-text" id="navPitLabel">PARK CAR</span>
            <span className="nav-pit-dock" id="navPitSlot" aria-hidden="true"></span>
          </button>

          <Link
            to="/join"
            className={`ref-btn ref-btn-primary effect-shine nav-desktop-only ${loadingPath === '/join' ? 'nav-cta-loading' : ''}`}
            aria-busy={loadingPath === '/join'}
            onClick={(event) => handleNavigationStart(event, '/join')}
          >
            Join the Society
            {renderLoadingProgress('/join')}
          </Link>

          <button
            className={`ref-mobile-btn ${mobileOpen ? 'is-open' : ''}`}
            id="refMobileToggle"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={toggleMobileMenu}
          >
            <span className="ref-burger-icon" aria-hidden="true">
              <span className="ref-burger-line line-1"></span>
              <span className="ref-burger-line line-2"></span>
              <span className="ref-burger-line line-3"></span>
            </span>
          </button>
        </div>
      </div>

      <div
        id="refMobileMenu"
        className={`ref-mobile-menu ${mobileOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <nav className="ref-mobile-nav-list" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={`mobile-${item.path}`}
              to={item.path}
              className={`${isLinkActive(item) ? 'active' : ''} ${loadingPath === item.path ? 'is-loading' : ''}`}
              aria-busy={loadingPath === item.path}
              aria-label={loadingPath === item.path ? `${item.label}, loading` : item.label}
              onClick={(event) => {
                handleNavigationStart(event, item.path);
                closeMobileMenu();
              }}
            >
              <span>{item.label}</span>
              {renderLoadingProgress(item.path)}
            </Link>
          ))}
          <div className="ref-mobile-nav-cta">
            <Link
              to="/join"
              className={`ref-btn ref-btn-primary effect-shine ${loadingPath === '/join' ? 'nav-cta-loading' : ''}`}
              aria-busy={loadingPath === '/join'}
              onClick={(event) => {
                handleNavigationStart(event, '/join');
                closeMobileMenu();
              }}
            >
              <span>Join the Society</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
