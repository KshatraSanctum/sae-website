import React from 'react';
import { Link } from 'react-router-dom';

interface FooterNavItem {
  path: string;
  label: string;
  badge?: string;
  highlight?: boolean;
  external?: boolean;
}

const FOOTER_NAV_ITEMS: FooterNavItem[] = [
  { path: '/about', label: 'About Chapter' },
  { path: '/achievements', label: 'Hall of Fame' },
  { path: '/events', label: 'Events Archive' },
  { path: '/team', label: 'Our Crew' },
  { path: '/sponsors', label: 'Sponsors & Partners' },
  { path: '/track', label: 'Race Track 🏎️', badge: 'BETA' },
  { path: 'https://github.com/saeindiabit-sindri/sae-website', label: 'Contribute Code', badge: 'GITHUB', external: true },
  { path: '/join', label: 'Join The Society', highlight: true },
];

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="ref-footer" id="main-footer">
      {/* Top Telemetry & Live Bay Status Strip */}
      <div className="ref-footer-telemetry-bar">
        <div className="ref-container ref-footer-telemetry-inner">
          <div className="footer-telemetry-left">
            <span className="telemetry-beacon-dot" aria-hidden="true" />
            <span className="telemetry-label">WORKSHOP &amp; FABRICATION BAY ACTIVE</span>
          </div>
          <a
            href="https://maps.app.goo.gl/HvS35hDbBtfP6R9b6"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-telemetry-center"
            title="Open in Google Maps: 23.656674° N, 86.474817° E"
            aria-label="Open in Google Maps: 23.656674° N, 86.474817° E"
          >
            <span className="telemetry-coords">23.656674° N, 86.474817° E</span>
            <span className="telemetry-sep">·</span>
            <span>BIT SINDRI, DHANBAD</span>
          </a>
          <button
            type="button"
            className="footer-back-to-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll back to top of page"
          >
            <span>BACK TO TOP</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="ref-footer-main-wrapper">
        {/* Giant Hollow Ambient Watermark */}
        <div className="footer-watermark-text" aria-hidden="true">
          SAE BIT SINDRI
        </div>

        <div className="ref-container ref-footer-inner">
          {/* Column 1: Brand & Identity */}
          <div className="ref-footer-brand-col">
            <Link
              className="ref-brand footer-brand-link"
              to="/"
              aria-label="SAE BIT Sindri home"
            >
              <span className="ref-brand-logo-ring">
                <img src="/bit-sindri-sae-logo.png" alt="SAE BIT Sindri Society Logo" />
              </span>
              <span className="ref-brand-text">
                <span className="ref-brand-title">SAE BIT Sindri</span>
                <span className="ref-brand-sub">Collegiate Society</span>
              </span>
            </Link>

            <div className="footer-chapter-pill">
              <span className="chapter-pill-tag">EST. 2008</span>
              <span>BIT SINDRI COLLEGIATE SOCIETY</span>
            </div>

            <p className="ref-footer-desc">
              The SAE collegiate society of BIT Sindri. Built by student engineers who believe
              the only way to truly master vehicle dynamics, flight, and robotics is to engineer them.
            </p>

            <div className="footer-divisions-strip" aria-label="Society Divisions">
              <span className="div-pill">BAJA BUGGY</span>
              <span className="div-pill">FORMULA</span>
              <span className="div-pill">EFFICYCLE</span>
              <span className="div-pill">AERO DESIGN</span>
            </div>
          </div>

          {/* Column 2: Quick Links / Navbar Options */}
          <nav className="ref-footer-nav-col" aria-label="Footer Quick Links">
            <p className="ref-footer-col-title">
              <span className="col-title-prefix">//</span> EXPLORE CHAPTER
            </p>
            <ul className="ref-footer-nav-list">
              {FOOTER_NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  {item.external ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`ref-footer-nav-link ${item.highlight ? 'is-highlight' : ''}`}
                    >
                      <span className="nav-link-chevron" aria-hidden="true">→</span>
                      <span>{item.label}</span>
                      {item.badge && <span className="footer-beta-box">{item.badge}</span>}
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className={`ref-footer-nav-link ${item.highlight ? 'is-highlight' : ''}`}
                    >
                      <span className="nav-link-chevron" aria-hidden="true">→</span>
                      <span>{item.label}</span>
                      {item.badge && <span className="footer-beta-box">{item.badge}</span>}
                      {item.highlight && <span className="nav-highlight-beacon" aria-hidden="true" />}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Social Hub & Contact */}
          <div className="ref-footer-right">
            <p className="ref-footer-col-title">
              <span className="col-title-prefix">//</span> TRANSMISSIONS &amp; MEDIA
            </p>

            <div className="ref-footer-socials" aria-label="Official Social Channels">
              <a
                href="https://www.instagram.com/sae_bit_sindri/"
                target="_blank"
                rel="noopener noreferrer"
                className="ref-footer-social-icon social-insta"
                title="Instagram @sae_bit_sindri"
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://in.linkedin.com/company/saeindia-bit-sindri"
                target="_blank"
                rel="noopener noreferrer"
                className="ref-footer-social-icon social-linkedin"
                title="LinkedIn SAE India BIT Sindri"
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 1 0 0-3.38 1.69 1.69 0 0 0 0 3.38m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@saeindiabitsindri1180"
                target="_blank"
                rel="noopener noreferrer"
                className="ref-footer-social-icon social-youtube"
                title="YouTube @saeindiabitsindri1180"
                aria-label="YouTube"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/SaeBITSindri/"
                target="_blank"
                rel="noopener noreferrer"
                className="ref-footer-social-icon social-facebook"
                title="Facebook SaeBITSindri"
                aria-label="Facebook"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://github.com/saeindiabit-sindri"
                target="_blank"
                rel="noopener noreferrer"
                className="ref-footer-social-icon social-github"
                title="GitHub saeindiabit-sindri"
                aria-label="GitHub"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>

            <div className="footer-contact-card">
              <span className="contact-card-label">OFFICIAL INQUIRIES</span>
              <a href="mailto:saeindia@bitsindri.ac.in" className="footer-email-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>saeindia@bitsindri.ac.in</span>
              </a>
            </div>
          </div>
        </div>

        {/* Sub-Footer Strip */}
        <div className="ref-footer-bottom">
          <div className="ref-container ref-footer-bottom-inner">
            <p className="ref-footer-copy">
              © {new Date().getFullYear()} SAE INDIA BIT Sindri · Made to Move Forward
            </p>
            <div className="footer-bottom-badge">
              <span className="badge-pulse-dot" aria-hidden="true" />
              <span>MADE WITH LOVE 💛 TEAM SAE BIT</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

