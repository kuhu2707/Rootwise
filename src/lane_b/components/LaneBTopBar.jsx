import React from 'react';
import { Bell } from 'lucide-react';

/**
 * LaneBTopBar Component
 * Header navigation bar with sync status, analyst switch, and profile
 */
export function LaneBTopBar({
  baseline = 'GCC April 2027',
  comparison = 'GCC May 2027',
  activeAngle = 'Cost Analyst',
  onAngleChange,
}) {
  const formatCycleText = () => {
    // Exact format from reference: "GCC April → May 2027"
    return "GCC April → May 2027";
  };

  return (
    <header className="lane-b-topbar">
      {/* Breadcrumb Trail */}
      <nav className="lane-b-breadcrumbs" aria-label="Breadcrumb">
        <span className="lane-b-breadcrumb-item">Comparisons</span>
        <span className="lane-b-breadcrumb-sep">/</span>
        <span className="lane-b-breadcrumb-item">{formatCycleText()}</span>
        <span className="lane-b-breadcrumb-sep">/</span>
        <span className="lane-b-breadcrumb-current">Results</span>
      </nav>

      {/* Right Controls */}
      <div className="lane-b-topbar-right">
        {/* Sync Pill */}
        <div className="lane-b-sync-pill">
          <span className="lane-b-sync-dot" />
          <span>SAP BDC · GVC outputs synced 09:12</span>
        </div>

        {/* Viewing as selector */}
        <div className="lane-b-analyst-switch" role="radiogroup" aria-label="Analyst perspective">
          <span className="lane-b-analyst-label">Viewing as</span>
          <button
            type="button"
            className={`lane-b-analyst-btn ${activeAngle === 'GVC Analyst' ? 'active' : ''}`}
            onClick={() => onAngleChange && onAngleChange('GVC Analyst')}
          >
            <span className="lane-b-analyst-dot" />
            <span>GVC Analyst</span>
          </button>
          <button
            type="button"
            className={`lane-b-analyst-btn ${activeAngle === 'Cost Analyst' ? 'active' : ''}`}
            onClick={() => onAngleChange && onAngleChange('Cost Analyst')}
          >
            <span className="lane-b-analyst-dot lane-b-analyst-dot-blue" />
            <span>Cost Analyst</span>
          </button>
        </div>

        {/* Bell Button */}
        <button type="button" className="lane-b-icon-btn" aria-label="Notifications">
          <Bell size={16} />
        </button>

        {/* Profile Avatar (CA = Cost Analyst) */}
        <div className="lane-b-user-avatar" title="Signed in as Cost Analyst (CA)">
          CA
        </div>
      </div>
    </header>
  );
}
