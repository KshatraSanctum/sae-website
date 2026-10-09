import React, { useState, useEffect } from 'react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, page: string) => {
    e.preventDefault();
    setMobileOpen(false);
    onNavigate(page);
  };

  return (
    <header className="ref-header" id="top">
      <div className="ref-container ref-header-inner">
        <a
          className="ref-brand"
          href="#home"
          data-page="home"
          aria-label="SAE BIT Sindri home"
          onClick={(e) => handleLinkClick(e, 'home')}
        >
          <span className="ref-brand-logo-ring nav-logo-hidden" id="navBrandLogoRing">
            <img src="/bit-sindri-sae-logo.png" alt="SAE BIT Sindri Club Logo" />
          </span>
          <span className="ref-brand-text">
            <span className="ref-brand-title">SAE BIT Sindri</span>
            <span className="ref-brand-sub">Collegiate Club</span>
          </span>
        </a>

        {/* Center navigation links */}
        <nav className="ref-nav ref-nav-center" aria-label="Primary navigation">
          {(['about', 'competitions', 'events', 'team', 'sponsors'] as const).map((page) => (
            <a
              key={page}
              href={`#${page}`}
              className={`ref-nav-link ${currentPage === page ? 'active' : ''}`}
              data-page={page}
              onClick={(e) => handleLinkClick(e, page)}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </a>
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

          <a
            href="#join"
            className="ref-btn ref-btn-primary effect-shine nav-desktop-only"
            data-page="join"
            onClick={(e) => handleLinkClick(e, 'join')}
          >
            Join the club
          </a>

          <button
            className={`ref-mobile-btn ${mobileOpen ? 'is-open' : ''}`}
            id="refMobileToggle"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileOpen(!mobileOpen)}
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
          {(['about', 'competitions', 'events', 'team', 'sponsors'] as const).map((page) => (
            <a
              key={page}
              href={`#${page}`}
              data-page={page}
              onClick={(e) => handleLinkClick(e, page)}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </a>
          ))}
          <div className="ref-mobile-nav-cta">
            <a
              href="#join"
              className="ref-btn ref-btn-primary effect-shine"
              data-page="join"
              onClick={(e) => handleLinkClick(e, 'join')}
            >
              <span>Join the club</span>
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
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};
