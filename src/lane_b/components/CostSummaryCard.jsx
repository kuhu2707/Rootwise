import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SignalConfidence } from './SignalConfidence';

/**
 * CostSummaryCard Component
 * Displays the cycle comparison, change box, and confidence details
 */
export function CostSummaryCard({
  measure = 'TOTAL GROUP COST PER UNIT',
  cycle1Label = 'Apr 2027',
  cycle2Label = 'May 2027',
  cycle1 = 10.50,
  cycle2 = 12.80,
  delta = 2.30,
  deltaPercent = 21.9,
  direction = 'up',
  confidence = 'High',
  confidenceNote = 'All cost elements present in both cycles',
}) {
  const isUp = direction === 'up' || delta >= 0;
  const deltaFormatted = `${isUp ? '+' : '−'}$${Math.abs(delta).toFixed(2)}`;

  return (
    <div className="lane-b-summary-card">
      <div className="lane-b-summary-eyebrow">{measure}</div>

      {/* Cycle Comparison Pair */}
      <div className="lane-b-cycle-pair">
        <div className="lane-b-cycle-block">
          <span className="lane-b-cycle-lbl">Cycle 1 · {cycle1Label}</span>
          <span className="lane-b-cycle-val">${cycle1.toFixed(2)}</span>
        </div>

        <span className="lane-b-cycle-arrow">
          <ArrowRight size={18} strokeWidth={2} />
        </span>

        <div className="lane-b-cycle-block">
          <span className="lane-b-cycle-lbl">Cycle 2 · {cycle2Label}</span>
          <span className="lane-b-cycle-val bold">${cycle2.toFixed(2)}</span>
        </div>
      </div>

      {/* Change Box */}
      <div className={`lane-b-change-box ${isUp ? 'change-up' : 'change-down'}`}>
        <div className="lane-b-change-header">
          <span className="lane-b-change-lbl">Change</span>
        </div>
        <div className="lane-b-change-row">
          <span className="lane-b-change-num">{deltaFormatted}</span>
          <span className="lane-b-change-pill">
            {isUp ? '↗' : '↘'} {Math.abs(deltaPercent).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Confidence Footer */}
      <div className="lane-b-summary-foot">
        <SignalConfidence confidence={confidence} score={confidence === 'High' ? 3 : 2} />
        <span className="lane-b-confidence-note">{confidenceNote}</span>
      </div>
    </div>
  );
}
