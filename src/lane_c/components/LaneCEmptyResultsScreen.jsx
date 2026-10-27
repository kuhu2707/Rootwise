import React from 'react';
import { Database, Flag, GitFork, MessageSquare, Edit3, ArrowRight, GitBranch } from 'lucide-react';
import { LaneASidebar } from '../../lane_a/components/LaneASidebar';
import { LaneATopBar } from '../../lane_a/components/LaneATopBar';
import '../../lane_a/laneA.css';

/**
 * LaneCEmptyResultsScreen Component (Matches Image 3 / Nothing moved by 10% or more)
 * Displayed when clicking on threshold editing or when no combinations cross the threshold.
 */
export function LaneCEmptyResultsScreen({
  angle = 'GVC Analyst',
  onAngleChange,
  comparisonText = 'GCC May 2027 Prelim → Final',
  comparisonType = 'Final vs preliminary',
  measure = 'Total group cost',
  threshold = 10,
  largestMovement = { product: 'Product B', rootPlant: 'RP-02', deltaPct: '+8.0%' },
  onReRunAt8,
  onEditThreshold,
  onNavigate,
}) {
  return (
    <div className="lane-a-layout">
      {/* Sidebar with Table icon active */}
      <LaneASidebar onNavigate={onNavigate} />

      <div className="lane-a-main">
        {/* Topbar */}
        <header className="lane-a-topbar">
          <div className="lane-a-breadcrumbs">
            <span className="crumb-muted">Comparisons</span>
            <span className="crumb-muted">/</span>
            <span className="crumb-muted">{comparisonText}</span>
            <span className="crumb-muted">/</span>
            <span className="crumb-active">Results</span>
          </div>

          <div className="lane-a-topbar-right">
            <div className="lane-a-sync-pill">
              <span className="lane-a-sync-dot" />
              <span>SAP BDC · GVC outputs synced 09:12</span>
            </div>

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

            <div className="lane-a-profile-badge" title="GVC Analyst (GA)">
              GA
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="lane-a-content">
          {/* Header */}
          <div className="lane-a-header-section">
            <div>
              <div className="lane-a-kicker">RESULTS</div>
              <h1 className="lane-a-title">Nothing moved by {threshold}% or more</h1>

              <div className="lane-a-status-row">
                {/* 4 agents completed pill */}
                <div className="lane-a-agent-pill" style={{ background: '#f1f3f7' }}>
                  <div className="lane-a-agent-icons">
                    <span className="lane-a-agent-icon-badge blue"><Database size={11} /></span>
                    <span className="lane-a-agent-icon-badge amber"><Flag size={11} /></span>
                    <span className="lane-a-agent-icon-badge purple"><GitFork size={11} /></span>
                    <span className="lane-a-agent-icon-badge coral"><MessageSquare size={11} /></span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#334155' }}>
                    4 agents · completed 09:16
                  </span>
                </div>

                <span className="lane-a-meta-pill">{comparisonType}</span>
                <span className="lane-a-meta-pill">{measure}</span>
                <span className="lane-a-meta-pill">Threshold ≥ {threshold}%</span>
              </div>
            </div>

            <div className="lane-a-actions">
              <button
                className="lane-a-btn-threshold"
                onClick={onEditThreshold}
              >
                <Edit3 size={13} /> Threshold ≥ {threshold}%
              </button>
            </div>
          </div>

          {/* Centered Empty State Panel */}
          <div 
            className="lane-a-table-card" 
            style={{ 
              minHeight: '440px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '64px 24px',
              textAlign: 'center'
            }}
          >
            {/* Concentric Aura with Icon */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <div 
                style={{
                  width: '92px',
                  height: '92px',
                  borderRadius: '50%',
                  border: '1px dashed #a7f3d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'radial-gradient(circle, #f0fdf4 0%, transparent 70%)',
                }}
              >
                <div 
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    background: '#12141a',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(18, 20, 26, 0.2)',
                  }}
                >
                  <GitBranch size={26} strokeWidth={2.2} />
                </div>
              </div>

              {/* Green Check Badge */}
              <div 
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                ✓
              </div>
            </div>

            {/* Title */}
            <h2 
              style={{ 
                fontFamily: 'var(--lane-a-font-display)', 
                fontSize: '24px', 
                fontWeight: 600, 
                color: '#0f172a',
                margin: '0 0 10px 0' 
              }}
            >
              No combination crossed {threshold}%
            </h2>

            {/* Subtitle */}
            <p 
              style={{ 
                fontSize: '14px', 
                color: '#64748b', 
                maxWidth: '520px', 
                lineHeight: 1.5,
                margin: '0 0 28px 0' 
              }}
            >
              All 1,296 root plant / SKU combinations were compared. The largest movement was{' '}
              <strong style={{ color: '#0f172a' }}>
                {largestMovement.product} · {largestMovement.rootPlant} at {largestMovement.deltaPct}
              </strong>
              , below your threshold.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                className="lane-a-btn-export"
                style={{ 
                  background: '#dc2626', 
                  borderColor: '#dc2626', 
                  padding: '9px 22px', 
                  fontSize: '13px',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)' 
                }}
                onClick={onReRunAt8}
              >
                <span>Re-run at 8%</span>
                <ArrowRight size={15} />
              </button>

              <button
                className="lane-a-btn-threshold"
                style={{ padding: '9px 20px', fontSize: '13px' }}
                onClick={onEditThreshold}
              >
                Edit threshold
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
