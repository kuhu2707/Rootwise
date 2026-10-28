import React from 'react';
import { Database, Flag, GitFork, Sparkles, X, Clock, Check } from 'lucide-react';

/**
 * LaneCPipelineDiagram Component
 * Renders the 4-agent pipeline flow supporting Year-over-year (failure path)
 * and Same-year cycles (successful working path).
 */
export function LaneCPipelineDiagram({
  status = 'running', // 'running' | 'failed' | 'complete'
  comparisonType = 'Year over year',
  baselineName = 'GCC 2026',
  comparisonName = 'GCC 2027',
  prepareProgressText = 'Restating 2026 at 2027 FBP rates · 741 of 1,231',
  errorText = '2027 FBP FX rates not found in BDC',
}) {
  const isFailed = status === 'failed';
  const isYearOverYear = comparisonType === 'Year over year';

  return (
    <div className="lane-c-pipeline-card">
      {/* Top Header */}
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

      {/* Main Diagram Area */}
      <div className="lane-c-diagram-row">
        {/* Left Datasets Stack */}
        <div className="lane-c-diagram-datasets">
          <div className="lane-c-mini-dataset">
            <span className="lane-c-mini-dataset-icon">
              <Database size={14} />
            </span>
            <div className="lane-c-mini-dataset-text">
              <span className="lane-c-mini-dataset-title">{baselineName}</span>
              <span className="lane-c-mini-dataset-sub">
                {isYearOverYear ? 'Baseline · restated FX' : 'Baseline · GVC output'}
              </span>
            </div>
          </div>

          <div className="lane-c-mini-dataset">
            <span className="lane-c-mini-dataset-icon">
              <Database size={14} />
            </span>
            <div className="lane-c-mini-dataset-text">
              <span className="lane-c-mini-dataset-title">{comparisonName}</span>
              <span className="lane-c-mini-dataset-sub">Comparison</span>
            </div>
          </div>
        </div>

        {/* Curved SVG connectors */}
        <svg className="lane-c-connector-svg" viewBox="0 0 100 140" fill="none">
          <path
            d="M 0 35 C 50 35, 50 70, 100 70"
            stroke="#93c5fd"
            strokeWidth="1.5"
          />
          <path
            d="M 0 105 C 50 105, 50 70, 100 70"
            stroke="#93c5fd"
            strokeWidth="1.5"
          />
        </svg>

        {/* Pipeline Nodes Row */}
        <div className="lane-c-nodes-row">
          {/* Connecting dashed line behind nodes */}
          <div className="lane-c-dashed-line" />

          {/* 1. Prepare Node */}
          <div className="lane-c-step-node">
            <div
              className={`lane-c-node-icon-box ${
                isFailed
                  ? 'prepare-failed'
                  : !isYearOverYear
                  ? 'prepare-running'
                  : 'prepare-running'
              }`}
            >
              <Database size={24} />
              {isFailed && (
                <span className="lane-c-node-fail-badge">
                  <X size={12} strokeWidth={3} />
                </span>
              )}
            </div>
            <span className="lane-c-node-title">Prepare</span>
            {isFailed ? (
              <span className="lane-c-node-pill pill-failed">
                <X size={10} strokeWidth={3} /> Failed
              </span>
            ) : isYearOverYear ? (
              <span className="lane-c-node-pill pill-fx">
                <span className="lane-c-dot-pulse" /> FX restatement
              </span>
            ) : (
              <span className="lane-c-node-pill" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #d1fae5' }}>
                <Check size={10} strokeWidth={2.5} /> Done
              </span>
            )}
            <span className={`lane-c-node-sub ${isFailed ? 'sub-error' : ''}`}>
              {isFailed
                ? errorText
                : isYearOverYear
                ? prepareProgressText
                : '1,284 pairs matched'}
            </span>
          </div>

          {/* 2. Flag Node */}
          <div className="lane-c-step-node">
            <div className="lane-c-node-icon-box flag">
              <Flag size={22} />
            </div>
            <span className="lane-c-node-title">Flag</span>
            {isYearOverYear ? (
              <span className="lane-c-node-pill pill-waiting">
                <Clock size={10} /> {isFailed ? 'Not started' : 'Waiting'}
              </span>
            ) : (
              <span className="lane-c-node-pill" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #d1fae5' }}>
                <Check size={10} strokeWidth={2.5} /> Done
              </span>
            )}
            <span className="lane-c-node-sub">
              {isFailed ? '—' : isYearOverYear ? 'Starts after FX restatement' : '6 of 1,284 flagged'}
            </span>
          </div>

          {/* 3. Trace drivers Node */}
          <div className="lane-c-step-node">
            <div className="lane-c-node-icon-box trace">
              <GitFork size={22} />
            </div>
            <span className="lane-c-node-title">Trace drivers</span>
            {isYearOverYear ? (
              <span className="lane-c-node-pill pill-waiting">
                <Clock size={10} /> {isFailed ? 'Not started' : 'Waiting'}
              </span>
            ) : (
              <span className="lane-c-node-pill" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #d1fae5' }}>
                <Check size={10} strokeWidth={2.5} /> Done
              </span>
            )}
            <span className="lane-c-node-sub">
              {isYearOverYear ? '—' : '6 traced · 9 drivers'}
            </span>
          </div>

          {/* 4. Explain Node */}
          <div className="lane-c-step-node">
            <div className="lane-c-node-icon-box explain">
              <Sparkles size={22} />
            </div>
            <span className="lane-c-node-title">Explain</span>
            {isYearOverYear ? (
              <span className="lane-c-node-pill pill-waiting">
                <Clock size={10} /> {isFailed ? 'Not started' : 'Waiting'}
              </span>
            ) : (
              <span className="lane-c-node-pill pill-fx" style={{ background: '#fff5f4', color: '#dc2626', border: '1px solid #fee2e2' }}>
                <span className="lane-c-dot-pulse" style={{ background: '#dc2626' }} /> Writing
              </span>
            )}
            <span className="lane-c-node-sub">
              {isYearOverYear ? '—' : '2 of 6 ready'}
            </span>
          </div>

          {/* Output Card */}
          <div className="lane-c-output-box">
            <span className="lane-c-output-tag">OUTPUT</span>
            <span className="lane-c-output-dash">{isYearOverYear ? '—' : '6'}</span>
            <span className="lane-c-output-sub">
              {isFailed ? 'nothing flagged' : isYearOverYear ? 'not yet' : 'flagged'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
