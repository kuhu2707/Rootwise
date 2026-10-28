import React from 'react';

/**
 * DeltaGaugeBar Component
 * Renders the percentage with arrow (↗ or ↘) and a mini proportional gauge bar
 */
export function DeltaGaugeBar({ percent = 0, direction = 'up' }) {
  // If direction is explicitly provided, honor it. Otherwise check sign.
  const isUp = direction === 'down' ? false : direction === 'up' ? true : percent > 0;
  const absPercent = Math.abs(percent);
  // Scale bar width smoothly (up to 25% mapped to 100% of bar track)
  const barWidth = Math.min(Math.max((absPercent / 25) * 100, 20), 100);

  return (
    <div className="lane-b-percent-cell">
      <span className={`lane-b-percent-text ${isUp ? 'red' : 'green'}`}>
        {isUp ? '↗' : '↘'} {absPercent.toFixed(1)}%
      </span>
      <div className="lane-b-gauge-track" title={`${absPercent.toFixed(1)}% variance magnitude`}>
        <div
          className={`lane-b-gauge-bar ${isUp ? 'red' : 'green'}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  );
}
