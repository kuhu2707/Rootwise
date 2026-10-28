import React, { useState, useEffect } from 'react';
import { LaneCPipelineDiagram } from './LaneCPipelineDiagram';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

/**
 * LaneCRunningScreen Component (Matches Image 2)
 * Active pipeline execution.
 * - Year over year: Performs FX restatement and demonstrates the failure path (Image 3)
 * - Same-year cycles: Successfully completes without error, allowing "View ready rows" / "View results"
 */
export function LaneCRunningScreen({
  params = {
    baseline: 'GCC 2026',
    comparison: 'GCC 2027',
    comparisonType: 'Year over year',
    measure: 'Total group cost',
    threshold: 10,
  },
  onCancel,
  onFail, // Transitions to Image 3 (FX Rate Missing Failure) - ONLY for Year over year
  onComplete, // Transitions to Results - for Same-year cycles
}) {
  const isYearOverYear = params.comparisonType === 'Year over year';
  const [seconds, setSeconds] = useState(isYearOverYear ? 42 : 14);

  // Active timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ONLY Year over year runs demonstrate the FX Rate Missing failure path
  useEffect(() => {
    if (!isYearOverYear) {
      // For Same-year cycles: auto-advance to results after 3.8s if user doesn't click
      const autoDoneTimer = setTimeout(() => {
        if (onComplete) {
          onComplete('results');
        }
      }, 4000);
      return () => clearTimeout(autoDoneTimer);
    }

    // For Year over year runs: auto-fail after 4.5s
    const autoFailTimer = setTimeout(() => {
      if (onFail) {
        onFail({
          errorCode: 'FX_RATE_NOT_FOUND',
          errorMessage: '2027 FBP FX rates not found in BDC',
        });
      }
    }, 4500);

    return () => clearTimeout(autoFailTimer);
  }, [isYearOverYear, onFail, onComplete]);

  return (
    <div>
      {/* Title & Status Row */}
      <div className="lane-c-run-header-row">
        <div className="lane-c-run-title-col">
          <div className="lane-c-kicker">AGENT RUN</div>
          <h1 className="lane-c-title">
            {params.baseline} → {params.comparison}
          </h1>

          <div className="lane-c-chips-row">
            <span className="lane-c-status-chip running">
              <span className="lane-c-dot-pulse" />
              <span>Running · {seconds} s</span>
            </span>
            <span className="lane-c-info-chip">{params.comparisonType}</span>
            <span className="lane-c-info-chip">{params.measure}</span>
            <span className="lane-c-info-chip">Threshold ≥ {params.threshold}%</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {!isYearOverYear && (
            <button
              type="button"
              className="lane-c-btn-run"
              style={{ padding: '8px 18px', fontSize: '13px' }}
              onClick={() => onComplete && onComplete('04a')}
            >
              <span>View ready rows (2)</span>
              <ArrowRight size={15} />
            </button>
          )}
          <button
            type="button"
            className="lane-c-btn-action-outline"
            onClick={onCancel}
          >
            Cancel run
          </button>
        </div>
      </div>

      {/* Agent Pipeline Diagram */}
      <LaneCPipelineDiagram
        status="running"
        comparisonType={params.comparisonType}
        baselineName={params.baseline}
        comparisonName={params.comparison}
        prepareProgressText={
          isYearOverYear
            ? 'Restating 2026 at 2027 FBP rates · 741 of 1,231'
            : '1,284 pairs matched'
        }
      />

      {/* Bottom Findings Card */}
      {isYearOverYear ? (
        <div className="lane-c-empty-card">
          <h2 className="lane-c-empty-title">No flagged combinations yet</h2>
          <p className="lane-c-empty-sub">
            Rows appear as soon as the Flag agent finishes. Year-over-year runs restate FX first.
          </p>
        </div>
      ) : (
        <div className="lane-c-empty-card" style={{ borderLeft: '3px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#059669', marginBottom: '6px' }}>
            <CheckCircle2 size={16} />
            <h2 className="lane-c-empty-title" style={{ margin: 0, color: '#0f172a' }}>
              6 combinations flagged · Ready to review
            </h2>
          </div>
          <p className="lane-c-empty-sub">
            Costs and deltas are finalized. Commentary is being written. You can review the ready rows now.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              type="button"
              className="lane-c-btn-run"
              style={{ padding: '9px 20px', fontSize: '13px' }}
              onClick={() => onComplete && onComplete('04a')}
            >
              <span>View ready rows</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Instant Action Button to trigger FX Rate Missing ONLY for Year over year */}
      {isYearOverYear && (
        <div className="lane-c-simulate-box">
          <button
            type="button"
            className="lane-c-simulate-btn"
            onClick={() =>
              onFail &&
              onFail({
                errorCode: 'FX_RATE_NOT_FOUND',
                errorMessage: '2027 FBP FX rates not found in BDC',
              })
            }
            title="Simulate FX Rate Missing event"
          >
            <AlertCircle size={13} />
            <span>Simulate FX Rate Missing (Instant Failure)</span>
          </button>
        </div>
      )}
    </div>
  );
}
