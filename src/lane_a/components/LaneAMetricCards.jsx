import React from 'react';

export function LaneAMetricCards({ metrics, onSelectProductA }) {
  if (!metrics) return null;

  return (
    <div className="lane-a-metrics-grid">
      {/* Card 1: Flagged */}
      <div className="lane-a-metric-card">
        <div className="lane-a-metric-card-top">
          <span className="lane-a-metric-dot coral" />
          <span className="lane-a-metric-label">FLAGGED</span>
        </div>
        <div className="lane-a-metric-val">{metrics.flaggedCount}</div>
        <div className="lane-a-metric-footer">
          of {metrics.totalCompared.toLocaleString()} combinations compared
        </div>
      </div>

      {/* Card 2: Cost Increases */}
      <div className="lane-a-metric-card">
        <div className="lane-a-metric-card-top">
          <span className="lane-a-metric-dot amber" />
          <span className="lane-a-metric-label">COST INCREASES</span>
        </div>
        <div className="lane-a-metric-val">{metrics.increasesCount}</div>
        <div className="lane-a-metric-footer">
          <span className="lane-a-badge-pill increase">
            ↗ +${metrics.combinedIncrease.toFixed(2)} per unit, combined
          </span>
        </div>
      </div>

      {/* Card 3: Cost Decreases */}
      <div className="lane-a-metric-card">
        <div className="lane-a-metric-card-top">
          <span className="lane-a-metric-dot green" />
          <span className="lane-a-metric-label">COST DECREASES</span>
        </div>
        <div className="lane-a-metric-val">{metrics.decreasesCount}</div>
        <div className="lane-a-metric-footer">
          <span className="lane-a-badge-pill decrease">
            ↘ -${metrics.combinedDecrease.toFixed(2)} per unit, combined
          </span>
        </div>
      </div>

      {/* Card 4: Largest Mover */}
      <div 
        className="lane-a-metric-card" 
        style={{ cursor: 'pointer' }}
        onClick={onSelectProductA}
        title="Click to view Product A detail"
      >
        <div className="lane-a-metric-card-top">
          <span className="lane-a-metric-dot purple" />
          <span className="lane-a-metric-label">LARGEST MOVER</span>
        </div>
        <div className="lane-a-metric-val product-font">
          {metrics.largestMover?.product || 'Product A'}
        </div>
        <div className="lane-a-metric-footer">
          <span className="lane-a-badge-pill increase">
            ↗ {metrics.largestMover?.percent}% · ${metrics.largestMover?.cycle1} → ${metrics.largestMover?.cycle2}
          </span>
        </div>
      </div>
    </div>
  );
}
