import React, { useState, useEffect } from 'react';
import { Database, Flag, GitFork, Sparkles, ArrowRight, Check, Clock } from 'lucide-react';
import { LaneASidebar } from '../../lane_a/components/LaneASidebar';
import '../../lane_a/laneA.css';

/**
 * LaneCRunningPipelineScreen Component (Matches Image 2 in current message)
 * Exact recreation of the active agent pipeline with live row-by-row table
 */
export function LaneCRunningPipelineScreen({
  baseline = 'GCC April 2027',
  comparison = 'GCC May 2027',
  comparisonType = 'Same-year cycles',
  measure = 'Total group cost',
  threshold = 10,
  angle = 'GVC Analyst',
  onAngleChange,
  onCancel,
  onViewReadyRows,
  onThresholdClick,
  onNavigate,
}) {
  const [seconds, setSeconds] = useState(99); // 1 min 39 s = 99s

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return mins > 0 ? `${mins} min ${secs} s` : `${secs} s`;
  };

  const rows = [
    {
      id: 'A-100245',
      letter: 'A',
      product: 'Product A',
      rootPlant: 'RP-01',
      deltaPct: '21.9%',
      direction: 'up',
      drivers: '3 drivers',
      driversStatus: 'done',
      explain: 'Written',
      explainStatus: 'done',
      avatarColor: 'peach',
    },
    {
      id: 'E-102310',
      letter: 'E',
      product: 'Product E',
      rootPlant: 'RP-02',
      deltaPct: '14.9%',
      direction: 'up',
      drivers: '2 drivers',
      driversStatus: 'done',
      explain: 'Written',
      explainStatus: 'done',
      avatarColor: 'peach',
    },
    {
      id: 'C-100512',
      letter: 'C',
      product: 'Product C',
      rootPlant: 'RP-03',
      deltaPct: '13.8%',
      direction: 'down',
      drivers: '1 driver',
      driversStatus: 'done',
      explain: 'Writing',
      explainStatus: 'working',
      avatarColor: 'mint',
    },
    {
      id: 'D-101077',
      letter: 'D',
      product: 'Product D',
      rootPlant: 'RP-01',
      deltaPct: '12.8%',
      direction: 'up',
      drivers: 'Tracing',
      driversStatus: 'working',
      explain: 'Waiting',
      explainStatus: 'waiting',
      avatarColor: 'peach',
    },
    {
      id: 'F-100988',
      letter: 'F',
      product: 'Product F',
      rootPlant: 'RP-04',
      deltaPct: '12.4%',
      direction: 'up',
      drivers: '1 driver',
      driversStatus: 'done',
      explain: 'Queued',
      explainStatus: 'waiting',
      avatarColor: 'peach',
    },
    {
      id: 'G-103402',
      letter: 'G',
      product: 'Product G',
      rootPlant: 'RP-02',
      deltaPct: '11.3%',
      direction: 'down',
      drivers: 'Queued',
      driversStatus: 'waiting',
      explain: 'Waiting',
      explainStatus: 'waiting',
      avatarColor: 'mint',
    },
  ];

  return (
    <div className="lane-a-layout">
      {/* Sidebar with Workflow / Tree icon active */}
      <aside className="lane-a-sidebar" aria-label="Rootwise Navigation">
        <div 
          className="lane-a-logo-mark"
          onClick={() => onNavigate && onNavigate('01')}
          title="Rootwise Home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="2" fill="currentColor" />
            <path d="M12 7v6" />
            <path d="M12 13a4 4 0 0 0-4 4v2" />
            <path d="M12 13a4 4 0 0 1 4 4v2" />
          </svg>
        </div>

        <div className="lane-a-nav-group">
          <button className="lane-a-nav-item" onClick={() => onNavigate && onNavigate('01')} title="Home">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
          </button>
          <button className="lane-a-nav-item" onClick={() => onNavigate && onNavigate('02a')} title="New comparison">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
          {/* Active workflow item */}
          <button className="lane-a-nav-item active" title="Active run">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" /><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" /><path d="M12 12v3" /></svg>
          </button>
          <button className="lane-a-nav-item" onClick={() => onNavigate && onNavigate('04a')} title="Results">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" /></svg>
          </button>
        </div>
      </aside>

      <div className="lane-a-main">
        {/* Topbar */}
        <header className="lane-a-topbar">
          <div className="lane-a-breadcrumbs">
            <span className="crumb-muted">Comparisons</span>
            <span className="crumb-muted">/</span>
            <span className="crumb-active">{baseline} → {comparison}</span>
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
          {/* Header Row */}
          <div className="lane-a-header-section" style={{ marginBottom: '18px' }}>
            <div>
              <div className="lane-a-kicker">AGENT RUN</div>
              <h1 className="lane-a-title">{baseline} → {comparison}</h1>

              <div className="lane-a-status-row">
                <span className="lane-c-status-chip running" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', borderRadius: '9999px', padding: '4px 12px', fontSize: '12px', fontWeight: 600 }}>
                  <span className="lane-c-dot-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dc2626' }} />
                  <span>Running · {formatTimer(seconds)}</span>
                </span>
                <span className="lane-a-meta-pill">{comparisonType}</span>
                <span className="lane-a-meta-pill">{measure}</span>
                <span 
                  className="lane-a-meta-pill" 
                  style={{ cursor: 'pointer' }}
                  onClick={onThresholdClick}
                  title="Click to view threshold behavior"
                >
                  Threshold ≥ {threshold}%
                </span>
              </div>
            </div>

            <div className="lane-a-actions">
              <button 
                className="lane-a-btn-threshold"
                onClick={onCancel}
              >
                Cancel run
              </button>

              <button 
                className="lane-a-btn-export" 
                style={{ background: '#12141a', color: '#ffffff', padding: '9px 18px', gap: '8px' }}
                onClick={onViewReadyRows}
              >
                <span>View 2 ready rows</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Agent Pipeline Card with Dot Grid Background */}
          <div 
            className="lane-c-pipeline-card" 
            style={{ 
              background: 'radial-gradient(#d1d5db 1px, transparent 1px), #ffffff', 
              backgroundSize: '16px 16px',
              padding: '24px 28px',
              marginBottom: '20px'
            }}
          >
            {/* Pipeline Heading & Legend */}
            <div className="lane-c-pipeline-top">
              <div className="lane-c-pipeline-heading">
                <span className="lane-c-pipeline-title">Agent pipeline</span>
                <span className="lane-c-pipeline-sub">
                  4 agents · read-only on GVC outputs in SAP BDC
                </span>
              </div>
              <div className="lane-c-pipeline-legend">
                <span className="lane-c-legend-item">
                  <span className="lane-c-legend-dot green" />
                  <span>Complete</span>
                </span>
                <span className="lane-c-legend-item">
                  <span className="lane-c-legend-dot red" />
                  <span>Working</span>
                </span>
                <span className="lane-c-legend-item">
                  <span className="lane-c-legend-dot grey" />
                  <span>Waiting</span>
                </span>
              </div>
            </div>

            {/* Pipeline Flow */}
            <div className="lane-c-diagram-row" style={{ marginTop: '16px' }}>
              {/* Datasets */}
              <div className="lane-c-diagram-datasets">
                <div className="lane-c-mini-dataset">
                  <span className="lane-c-mini-dataset-icon"><Database size={14} /></span>
                  <div className="lane-c-mini-dataset-text">
                    <span className="lane-c-mini-dataset-title">{baseline}</span>
                    <span className="lane-c-mini-dataset-sub">Baseline</span>
                  </div>
                </div>

                <div className="lane-c-mini-dataset">
                  <span className="lane-c-mini-dataset-icon"><Database size={14} /></span>
                  <div className="lane-c-mini-dataset-text">
                    <span className="lane-c-mini-dataset-title">{comparison}</span>
                    <span className="lane-c-mini-dataset-sub">Comparison</span>
                  </div>
                </div>
              </div>

              {/* Curved SVG Connectors to Prepare */}
              <svg className="lane-c-connector-svg" viewBox="0 0 100 140" fill="none">
                <path d="M 0 35 C 50 35, 50 70, 100 70" stroke="#93c5fd" strokeWidth="1.5" />
                <path d="M 0 105 C 50 105, 50 70, 100 70" stroke="#93c5fd" strokeWidth="1.5" />
              </svg>

              {/* Pipeline Nodes Row */}
              <div className="lane-c-nodes-row" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                {/* 1. Prepare (Done) */}
                <div className="lane-c-step-node" style={{ position: 'relative' }}>
                  <div className="lane-c-node-icon-box" style={{ background: '#3b82f6', color: '#ffffff', boxShadow: '0 0 0 4px #dbeafe' }}>
                    <Database size={24} />
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', borderRadius: '50%', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, border: '2px solid #ffffff' }}>
                      ✓
                    </span>
                  </div>
                  <span className="lane-c-node-title">Prepare</span>
                  <span className="lane-c-node-pill" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #d1fae5' }}>
                    <Check size={10} strokeWidth={3} /> Done
                  </span>
                  <span className="lane-c-node-sub">1,284 pairs matched</span>
                </div>

                {/* Solid blue arrow to Flag */}
                <div style={{ width: '38px', height: '2px', background: '#3b82f6', position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '-4px', top: '-4px', borderLeft: '6px solid #3b82f6', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
                </div>

                {/* 2. Flag (Done) */}
                <div className="lane-c-step-node" style={{ position: 'relative' }}>
                  <div className="lane-c-node-icon-box" style={{ background: '#f59e0b', color: '#ffffff', boxShadow: '0 0 0 4px #fef3c7' }}>
                    <Flag size={22} />
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', borderRadius: '50%', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, border: '2px solid #ffffff' }}>
                      ✓
                    </span>
                  </div>
                  <span className="lane-c-node-title">Flag</span>
                  <span className="lane-c-node-pill" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #d1fae5' }}>
                    <Check size={10} strokeWidth={3} /> Done
                  </span>
                  <span className="lane-c-node-sub">6 of 1,284 above 10%</span>
                </div>

                {/* Dashed purple arrow to Trace drivers */}
                <div style={{ width: '38px', height: '2px', borderTop: '2px dashed #8b5cf6', position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '-4px', top: '-5px', borderLeft: '6px solid #8b5cf6', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
                </div>

                {/* 3. Trace drivers (Active) */}
                <div className="lane-c-step-node" style={{ position: 'relative' }}>
                  <div className="lane-c-node-icon-box" style={{ background: '#8b5cf6', color: '#ffffff', boxShadow: '0 0 0 6px #ede9fe' }}>
                    <GitFork size={22} />
                  </div>
                  <span className="lane-c-node-title">Trace drivers</span>
                  <span className="lane-c-node-pill" style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #ffe4e6' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#e11d48', marginRight: '4px' }} /> Tracing · 4 of 6 done
                  </span>
                  <span className="lane-c-node-sub" style={{ maxWidth: '140px' }}>
                    Reading cost components and flow nodes
                  </span>
                  <div style={{ width: '60px', height: '3px', background: '#8b5cf6', borderRadius: '2px', marginTop: '6px' }} />
                </div>

                {/* Dashed red arrow to Explain */}
                <div style={{ width: '38px', height: '2px', borderTop: '2px dashed #ef4444', position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '-4px', top: '-5px', borderLeft: '6px solid #ef4444', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
                </div>

                {/* 4. Explain (Active) */}
                <div className="lane-c-step-node" style={{ position: 'relative' }}>
                  <div className="lane-c-node-icon-box" style={{ background: '#ef4444', color: '#ffffff', boxShadow: '0 0 0 6px #fee2e2' }}>
                    <Sparkles size={22} />
                  </div>
                  <span className="lane-c-node-title">Explain</span>
                  <span className="lane-c-node-pill" style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #ffe4e6' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#e11d48', marginRight: '4px' }} /> Writing · 2 of 6 done
                  </span>
                  <span className="lane-c-node-sub">GVC Analyst commentary</span>
                  <div style={{ width: '40px', height: '3px', background: '#ef4444', borderRadius: '2px', marginTop: '6px' }} />
                </div>

                {/* Dashed red arrow to Output */}
                <div style={{ width: '28px', height: '2px', borderTop: '2px dashed #ef4444', position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '-4px', top: '-5px', borderLeft: '6px solid #ef4444', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
                </div>

                {/* Output Card */}
                <div 
                  className="lane-c-output-box" 
                  style={{ 
                    background: '#12141a', 
                    borderRadius: '16px', 
                    padding: '16px 20px', 
                    color: '#ffffff', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)' 
                  }}
                >
                  <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.06em' }}>OUTPUT</span>
                  <span style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1.1, color: '#ffffff' }}>6</span>
                  <span style={{ fontSize: '11px', color: '#f87171', fontWeight: 600 }}>flagged</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Flagged Combinations Card with Table */}
          <div className="lane-a-table-card" style={{ padding: '22px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Flagged combinations
              </h2>
              <span style={{ background: '#f1f5f9', color: '#334155', borderRadius: '9999px', padding: '2px 8px', fontSize: '12px', fontWeight: 600 }}>
                6
              </span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                Each row moves through Trace and Explain on its own
              </span>
            </div>

            <div className="lane-a-table-wrap">
              <table className="lane-a-table">
                <thead>
                  <tr>
                    <th>FLAGGED COMBINATION</th>
                    <th>DELTA %</th>
                    <th>TRACE DRIVERS</th>
                    <th>EXPLAIN</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      {/* Product */}
                      <td>
                        <div className="lane-a-product-cell">
                          <div className={`lane-a-avatar ${row.avatarColor}`}>
                            {row.letter}
                          </div>
                          <div className="lane-a-product-details">
                            <span className="lane-a-product-name">{row.product}</span>
                            <span className="lane-a-product-sub">{row.rootPlant}</span>
                          </div>
                        </div>
                      </td>

                      {/* Delta % */}
                      <td>
                        <span className={`lane-a-delta-pct-val ${row.direction === 'up' ? 'increase' : 'decrease'}`}>
                          {row.direction === 'up' ? '↗' : '↘'} {row.deltaPct}
                        </span>
                      </td>

                      {/* Trace Drivers Pill */}
                      <td>
                        {row.driversStatus === 'done' && (
                          <span className="lane-a-badge-pill decrease" style={{ gap: '4px' }}>
                            <Check size={11} strokeWidth={2.5} /> {row.drivers}
                          </span>
                        )}
                        {row.driversStatus === 'working' && (
                          <span className="lane-a-badge-pill increase" style={{ gap: '4px' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#dc2626' }} /> {row.drivers}
                          </span>
                        )}
                        {row.driversStatus === 'waiting' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', color: '#64748b', borderRadius: '9999px', padding: '3px 8px', fontSize: '11px', fontWeight: 500 }}>
                            <Clock size={11} /> {row.drivers}
                          </span>
                        )}
                      </td>

                      {/* Explain Pill */}
                      <td>
                        {row.explainStatus === 'done' && (
                          <span className="lane-a-badge-pill decrease" style={{ gap: '4px' }}>
                            <Check size={11} strokeWidth={2.5} /> {row.explain}
                          </span>
                        )}
                        {row.explainStatus === 'working' && (
                          <span className="lane-a-badge-pill increase" style={{ gap: '4px' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#dc2626' }} /> {row.explain}
                          </span>
                        )}
                        {row.explainStatus === 'waiting' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', color: '#64748b', borderRadius: '9999px', padding: '3px 8px', fontSize: '11px', fontWeight: 500 }}>
                            <Clock size={11} /> {row.explain}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
