import React from 'react';
import { DEPARTMENTS } from '../data';

interface DepartmentsPageProps {
  isActive: boolean;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ isActive }) => {
  return (
    <section className={`page ${isActive ? 'active' : ''}`} id="page-departments">
      <div className="page-head">
        <span className="eyebrow">// chapter domains</span>
        <h1>Departments</h1>
        <p className="sub">
          Explore the administrative, design, manufacturing, and technical departments driving our
          innovation.
        </p>
      </div>

      <div id="departmentSections">
        {DEPARTMENTS.map((sec, idx) => (
          <div className="team-section" key={`dept-${sec.name}-${idx}`}>
            <div className="team-section-head">
              <h2>{sec.name}</h2>
              <span className="team-blurb">{sec.blurb}</span>
            </div>
            <div className="team-divider"></div>
            <div className="member-grid">
              {sec.roles.map((role, rIdx) => (
                <div className="member-card" key={`role-${role}-${rIdx}`}>
                  <div className="avatar">＋</div>
                  <span className="nm">Add Name</span>
                  <span className="role-tag mono">{role}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
