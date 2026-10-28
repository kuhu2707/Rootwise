import React from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';
import { LaneCPipelineDiagram } from './LaneCPipelineDiagram';

/**
 * LaneCFailedScreen Component (Matches Image 3)
 * Displays the failed pipeline at Prepare stage with detailed root cause and recovery actions
 */
export function LaneCFailedScreen({
  params = {
    baseline: 'GCC 2026',
    comparison: 'GCC 2027',
    comparisonType: 'Year over year',
    measure: 'Total group cost',
    threshold: 10,
  },
  duration = '34 s',
  errorMessage = '2027 FBP FX rates not found in BDC',
  onChangeDatasets, // Returns to Image 1 (Setup)
  onRetry,          // Re-runs comparison (transitions to Image 2)
}) {
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
            <span className="lane-c-status-chip failed">
              <span>✖ Failed at Prepare · {duration}</span>
            </span>
            <span className="lane-c-info-chip">{params.comparisonType}</span>
            <span className="lane-c-info-chip">{params.measure}</span>
            <span className="lane-c-info-chip">Threshold ≥ {params.threshold}%</span>
          </div>
        </div>

        <button
          type="button"
          className="lane-c-btn-action-outline"
          onClick={onChangeDatasets}
        >
          Back to setup
        </button>
      </div>

      {/* Agent Pipeline Diagram with Failed State */}
      <LaneCPipelineDiagram
        status="failed"
        baselineName={params.baseline}
        comparisonName={params.comparison}
        errorText={errorMessage}
      />

      {/* Bottom Failure Action Card */}
      <div className="lane-c-error-banner">
        <div className="lane-c-error-left">
          <div className="lane-c-error-icon-box">
            <AlertCircle size={22} strokeWidth={2.2} />
          </div>
          <div className="lane-c-error-content">
            <h2 className="lane-c-error-title">
              The run stopped before anything was compared
            </h2>
            <p className="lane-c-error-desc">
              Year-over-year runs need both cycles on the same FX basis. Rootwise could not read the 2027 FBP FX rates, so nothing was flagged and no commentary was written. No data was changed.
            </p>
          </div>
        </div>

        <div className="lane-c-error-actions">
          <button
            type="button"
            className="lane-c-btn-white"
            onClick={onChangeDatasets}
          >
            Change datasets
          </button>

          <button
            type="button"
            className="lane-c-btn-retry"
            onClick={onRetry}
          >
            <RotateCw size={15} />
            <span>Retry run</span>
          </button>
        </div>
      </div>
    </div>
  );
}
