import React from 'react';

/**
 * LaneBMetricCards Component
 * Displays the 4 summary metrics cards matching the screenshot
 */
export function LaneBMetricCards({ metrics, onSelectMover }) {
  const {
    flaggedCount = 6,
    totalCompared = 1284,
    costIncreasesCount = 4,
    costIncreasesCombined = 6.08,
    costDecreasesCount = 2,
    costDecreasesCombined = -3.48,
    largestMover = {
      product: 'Product A',
      percent: 21.9,
      cycle1: 10.50,
      cycle2: 12.80,
      direction: 'up',
    },
  } = metrics || {};

  const incCombinedStr = `+$${Math.abs(costIncreasesCombined).toFixed(2)}`;
  const decCombinedStr = `-$${Math.abs(costDecreasesCombined).toFixed(2)}`;

  return (
    <div className="lane-b-metric-grid" aria-label="Key variance statistics">
      {/* 1. Flagged */}
      <div className="lane-b-metric-card">
        <div className="lane-b-metric-header">
          <span className="lane-b-metric-dot coral" />
          <span>Flagged</span>
        </div>
        <div className="lane-b-metric-value">{flaggedCount}</div>
        <p className="lane-b-metric-foot-sub">
          of {totalCompared.toLocaleString()} combinations compared
        </p>
      </div>

      {/* 2. Cost Increases */}
      <div className="lane-b-metric-card">
        <div className="lane-b-metric-header">
          <span className="lane-b-metric-dot amber" />
          <span>Cost Increases</span>
        </div>
        <div className="lane-b-metric-value">{costIncreasesCount}</div>
        <div>
          <span className="lane-b-metric-badge badge-red">
            ↗ {incCombinedStr} per unit, combined
          </span>
        </div>
      </div>

      {/* 3. Cost Decreases */}
      <div className="lane-b-metric-card">
        <div className="lane-b-metric-header">
          <span className="lane-b-metric-dot green" />
          <span>Cost Decreases</span>
        </div>
        <div className="lane-b-metric-value">{costDecreasesCount}</div>
        <div>
          <span className="lane-b-metric-badge badge-green">
            ↘ {decCombinedStr} per unit, combined
          </span>
        </div>
      </div>

      {/* 4. Largest Mover */}
      <div
        className="lane-b-metric-card"
        style={{ cursor: onSelectMover ? 'pointer' : 'default' }}
        onClick={() => onSelectMover && largestMover && onSelectMover(largestMover)}
      >
        <div className="lane-b-metric-header">
          <span className="lane-b-metric-dot violet" />
          <span>Largest Mover</span>
        </div>
        <div className="lane-b-metric-value text-mover">
          {largestMover?.product || '—'}
        </div>
        <div>
          {largestMover ? (
            <span
              className={`lane-b-metric-badge ${
                largestMover.direction === 'down' ? 'badge-green' : 'badge-red'
              }`}
            >
              {largestMover.direction === 'down' ? '↘' : '↗'}{' '}
              {Math.abs(largestMover.percent).toFixed(1)}% · $
              {largestMover.cycle1.toFixed(2)} → ${largestMover.cycle2.toFixed(2)}
            </span>
          ) : (
            <span className="lane-b-metric-foot-sub">No mover detected</span>
          )}
        </div>
      </div>
    </div>
  );
}
