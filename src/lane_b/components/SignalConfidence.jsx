import React from 'react';

/**
 * SignalConfidence Component
 * Renders vertical signal bars (3 bars) and confidence level
 * - High: 3 black bars
 * - Medium: 2 orange bars + 1 empty bar
 */
export function SignalConfidence({ confidence = 'High', score = 3 }) {
  const isHigh = confidence.toLowerCase() === 'high' || score >= 3;
  const isMedium = confidence.toLowerCase() === 'medium' || score === 2;

  return (
    <div className="lane-b-confidence-cell" title={`Confidence: ${confidence}`}>
      <div className="lane-b-signal-bars" aria-label={`Confidence level: ${confidence}`}>
        <span
          className={`lane-b-bar bar-1 ${
            isHigh ? 'black-filled' : isMedium ? 'orange-filled' : 'empty'
          }`}
        />
        <span
          className={`lane-b-bar bar-2 ${
            isHigh ? 'black-filled' : isMedium ? 'orange-filled' : 'empty'
          }`}
        />
        <span
          className={`lane-b-bar bar-3 ${
            isHigh ? 'black-filled' : 'empty'
          }`}
        />
      </div>
      <span className={`lane-b-confidence-label ${isHigh ? 'high' : 'medium'}`}>
        {confidence}
      </span>
    </div>
  );
}
