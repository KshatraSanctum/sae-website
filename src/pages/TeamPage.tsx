import React from 'react';
import { CORE_TEAM_MEMBERS } from '../data';

interface TeamPageProps {
  isActive: boolean;
  onNavigate: (page: string) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ isActive, onNavigate }) => {
  return (
    <section className={`page ref-team-page ${isActive ? 'active' : ''}`} id="page-team">
      <div className="tech-grid team-bg-grid"></div>
      <div className="ref-container" style={{ position: 'relative' }}>
        {/* Header */}
        <div data-reveal className="reveal-up team-header-row">
          <div>
            <div className="team-eyebrow-row">
              <span className="team-eyebrow-line"></span>
              <p className="ref-eyebrow text-signal">Office bearers</p>
            </div>
            <h1 className="ref-team-heading">
              The people behind
              <span className="text-signal" style={{ display: 'block' }}>the machine.</span>
            </h1>
          </div>
          <p className="team-subtext">
            Meet the student leaders turning ambitious ideas into engineered outcomes, one project at a time.
          </p>
        </div>

        {/* Grid of Core Team Cards */}
        <div className="team-grid" id="coreTeamGrid">
          {CORE_TEAM_MEMBERS.map((member, index) => {
            const numBadge = String(index + 1).padStart(2, '0');
            return (
              <article
                key={`member-${member.name}-${index}`}
                data-reveal
                className="team-card reveal-up group"
              >
                <div className="team-card-media">
                  <img
                    src={member.image}
                    alt={`${member.name}, ${member.post}${member.subPost ? ' - ' + member.subPost : ''}`}
                    className="team-card-img"
                    style={member.objectPosition ? { objectPosition: member.objectPosition } : undefined}
                    loading="lazy"
                  />
                  <div className="team-card-overlay"></div>
                  <div className="team-card-badge-wrap">
                    <span className="team-card-badge">{numBadge}</span>
                  </div>
                  <div className="team-card-socials">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="team-social-btn"
                        aria-label={`${member.name} on LinkedIn`}
                        title="LinkedIn"
                      >
                        <svg
                          width="15"
                          height="15"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                          <path d="M8 10v7M8 7v.01M12 17v-4a3 3 0 0 1 6 0v4M12 10v7" />
                        </svg>
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="team-social-btn"
                        aria-label={`Email ${member.name}`}
                        title={member.email}
                      >
                        <svg
                          width="15"
                          height="15"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
                <div className="team-card-info">
                  <h3 className="team-card-name">{member.name}</h3>
                  <div className="team-card-footer">
                    <div className="team-card-roles">
                      <p className="team-card-post">{member.post}</p>
                      {member.subPost && (
                        <p className="team-card-subpost">{member.subPost}</p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Join Callout Banner */}
        <div data-reveal className="reveal-up team-join-banner">
          <div>
            <p className="ref-eyebrow text-signal">Your name could be here</p>
            <h3 className="team-join-heading">Join the team. Build the legacy.</h3>
          </div>
          <a
            href="#join"
            className="ref-btn ref-btn-primary effect-shine"
            data-page="join"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('join');
            }}
          >
            Find your team
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
