import React from 'react';
import { Bell } from 'lucide-react';

export function LaneATopBar({ angle = 'GVC Analyst', onAngleChange }) {
  return (
    <header className="lane-a-topbar">
      <div className="lane-a-breadcrumbs">
        <span className="crumb-muted">Comparisons</span>
        <span className="crumb-muted">/</span>
        <span className="crumb-muted">GCC April → May 2027</span>
        <span className="crumb-muted">/</span>
        <span className="crumb-active">Results</span>
      </div>

      <div className="lane-a-topbar-right">
        {/* Sync Status Badge */}
        <div className="lane-a-sync-pill">
          <span className="lane-a-sync-dot" />
          <span>SAP BDC · GVC outputs synced 09:12</span>
        </div>

        {/* Viewing as Angle Switcher */}
        <div className="lane-a-angle-switcher">
          <span className="lane-a-angle-label">Viewing as</span>
          <div className="lane-a-angle-pill">
            <button
              className={`lane-a-angle-btn ${angle === 'GVC Analyst' ? 'active' : ''}`}
              onClick={() => onAngleChange && onAngleChange('GVC Analyst')}
            >
              {angle === 'GVC Analyst' && <span className="lane-a-angle-dot" />}
              GVC Analyst
            </button>
            <button
              className={`lane-a-angle-btn ${angle === 'Cost Analyst' ? 'active' : ''}`}
              onClick={() => onAngleChange && onAngleChange('Cost Analyst')}
            >
              {angle === 'Cost Analyst' && <span className="lane-a-angle-dot" />}
              Cost Analyst
            </button>
          </div>
        </div>

        {/* Notifications */}
        <button className="lane-a-icon-btn" title="Notifications" aria-label="Notifications">
          <Bell size={16} />
        </button>

        {/* Profile Avatar */}
        <div className="lane-a-profile-badge" title="GVC Analyst (GA)">
          GA
        </div>
      </div>
    </header>
  );
}
