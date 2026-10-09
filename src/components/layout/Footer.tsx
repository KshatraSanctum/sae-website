import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="ref-footer">
      <div className="ref-container ref-footer-inner">
        <div>
          <a
            className="ref-brand"
            href="#home"
            data-page="home"
            aria-label="SAE BIT Sindri home"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
          >
            <span
              className="ref-brand-logo-ring"
              style={{
                boxShadow:
                  '0 0 0 2px var(--color-ink), 0 0 0 4px rgba(255, 255, 255, 0.3)',
              }}
            >
              <img src="/bit-sindri-sae-logo.png" alt="SAE BIT Sindri Club Logo" />
            </span>
            <span className="ref-brand-text">
              <span className="ref-brand-title">SAE BIT Sindri</span>
              <span className="ref-brand-sub">Collegiate Club</span>
            </span>
          </a>
          <p className="ref-footer-desc">
            The SAE collegiate club of BIT Sindri, built by students who believe the
            best way to learn engineering is to engineer.
          </p>
        </div>
        <div className="ref-footer-right">
          <a href="mailto:saeclub@college.edu" className="ref-footer-email">
            saeclub@college.edu
          </a>
          <p className="ref-footer-copy">
            © {new Date().getFullYear()} SAE BIT Sindri · Made to move forward
          </p>
        </div>
      </div>
    </footer>
  );
};
