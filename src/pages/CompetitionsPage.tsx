import React from 'react';
import { COMPETITIONS } from '../data';

interface CompetitionsPageProps {
  isActive: boolean;
}

export const CompetitionsPage: React.FC<CompetitionsPageProps> = ({ isActive }) => {
  return (
    <section className={`page ${isActive ? 'active' : ''}`} id="page-competitions">
      <div className="page-head">
        <span className="eyebrow">// what we build for</span>
        <h1>Competitions</h1>
        <p className="sub">
          Where blueprints meet the track — and, with Vayu, the sky. Each crew owns its build end-to-end:
          design, fabrication, testing and race day.
        </p>
      </div>

      <div className="comp-grid" id="compGrid">
        {COMPETITIONS.map((c, idx) => (
          <div className="comp-card" key={`comp-${idx}`}>
            <a href="#" className="comp-gallery-link" title="Gallery" onClick={(e) => e.preventDefault()}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </a>
            <span
              className="ic"
              dangerouslySetInnerHTML={{
                __html: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${c.icon}</svg>`,
              }}
            />
            <span className="team-of mono">{c.team}</span>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
            <div className="badge mono">+ Add latest result</div>
          </div>
        ))}
      </div>

      <div className="hof">
        <h3 className="mono">// HALL OF FAME</h3>
        <p>
          Over the chapter's history, teams have placed in inter-collegiate technical challenges beyond SAE's own
          events — including a first-place design win for a student-built submarine at IIT Kharagpur and a podium finish
          at a cliff-rescue challenge at IIT(ISM) Dhanbad. Add your latest results here as they come in.
        </p>
      </div>
    </section>
  );
};
