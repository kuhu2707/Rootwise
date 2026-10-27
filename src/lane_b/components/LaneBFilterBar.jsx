import React from 'react';
import { Pencil, Upload } from 'lucide-react';
import { AgentStackBadge } from './AgentStackBadge';

/**
 * LaneBFilterBar Component
 * Filter pills and actions bar
 */
export function LaneBFilterBar({
  comparisonType = 'Same-year cycles',
  measure = 'Total group cost',
  threshold = 10,
  onAdjustThreshold,
  onExport,
}) {
  return (
    <div className="lane-b-filter-toolbar">
      {/* Left Pills Group */}
      <div className="lane-b-pill-group">
        <AgentStackBadge completedTime="09:16" count={4} />
        <span className="lane-b-tag-pill">{comparisonType}</span>
        <span className="lane-b-tag-pill">{measure}</span>
        <span className="lane-b-tag-pill">Threshold ≥ {threshold}%</span>
      </div>

      {/* Right Action Buttons */}
      <div className="lane-b-action-group">
        <button
          type="button"
          className="lane-b-btn-threshold"
          onClick={onAdjustThreshold}
          title="Adjust variance detection threshold"
        >
          <Pencil size={13} />
          <span>Threshold ≥ {threshold}%</span>
        </button>

        <button
          type="button"
          className="lane-b-btn-export"
          onClick={onExport}
          title="Export flagged combinations to CSV"
        >
          <Upload size={13} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
