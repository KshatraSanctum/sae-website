import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="ref-footer">
      <div className="ref-container ref-footer-inner">
        <div>
          <Link
            className="ref-brand"
            to="/"
            aria-label="SAE BIT Sindri home"
          >
            <span
              className="ref-brand-logo-ring"
              style={{
                boxShadow:
                  '0 0 0 2px var(--color-ink), 0 0 0 4px rgba(255, 255, 255, 0.3)',
              }}
            >
              <img src="/bit-sindri-sae-logo.png" alt="SAE BIT Sindri Society Logo" />
            </span>
            <span className="ref-brand-text">
              <span className="ref-brand-title">SAE BIT Sindri</span>
              <span className="ref-brand-sub">Collegiate Society</span>
            </span>
          </Link>
          <p className="ref-footer-desc">
            The SAE collegiate society of BIT Sindri, built by students who believe the
            best way to learn engineering is to engineer.
          </p>
        </div>
        <div className="ref-footer-right">
          <a href="mailto:saeindiabitsindri@gmail.com" className="ref-footer-email">
            saeindiabitsindri@gmail.com
          </a>
          <p className="ref-footer-copy">
            © {new Date().getFullYear()} SAE BIT Sindri · Made to move forward
          </p>
        </div>
      </div>
    </footer>
  );
};
