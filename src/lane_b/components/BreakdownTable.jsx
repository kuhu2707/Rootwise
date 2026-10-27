import React from 'react';
import { Check } from 'lucide-react';

/**
 * BreakdownTable Component
 * Shows BOM level 1 totals, indented components with highlighted API row,
 * grand total, and verification badges
 */
export function BreakdownTable({
  breakdown = [
    { name: 'Material', marker: '2', cycle1: 5.48, cycle2: 6.47, delta: 0.99, percent: 18, level: 0 },
    { name: 'API', cycle1: 2.21, cycle2: 2.99, delta: 0.78, percent: 35, level: 1, highlighted: true },
    { name: 'Packaging', cycle1: 1.27, cycle2: 1.42, delta: 0.15, percent: 12, level: 1 },
    { name: 'Excipients', cycle1: 2.00, cycle2: 2.06, delta: 0.06, percent: 3, level: 1 },
    { name: 'Manufacturing', marker: '1', cycle1: 4.62, cycle2: 5.91, delta: 1.29, percent: 28, level: 0 },
    { name: 'Logistics', marker: '3', cycle1: 0.40, cycle2: 0.42, delta: 0.02, percent: 5, level: 0 },
  ],
  totalRow = {
    name: 'Total group cost',
    cycle1: 10.50,
    cycle2: 12.80,
    delta: 2.30,
    percent: 21.9,
  },
  checks = [
    'Manufacturing node unchanged',
    'BOM version unchanged',
    'Supply route unchanged',
  ],
}) {
  return (
    <div className="lane-b-breakdown-card">
      {/* Header */}
      <div className="lane-b-breakdown-header">
        <div className="lane-b-breakdown-title-group">
          <h2 className="lane-b-breakdown-title">Breakdown by cost element</h2>
          <span className="lane-b-source-tag">From GVC records</span>
        </div>
        <p className="lane-b-breakdown-note">
          BOM level 1 gives the totals; detail rows (node type blank) give the elements below.
        </p>
      </div>

      {/* Table */}
      <div className="lane-b-breakdown-table-wrap">
        <table className="lane-b-breakdown-table">
          <thead>
            <tr>
              <th>COST ELEMENT</th>
              <th>CYCLE 1</th>
              <th>CYCLE 2</th>
              <th>DELTA</th>
              <th>DELTA %</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((row, idx) => {
              const isUp = row.delta >= 0;
              const absPct = Math.abs(row.percent || 0);
              const barWidth = Math.min(Math.max((absPct / 40) * 100, 10), 100);

              return (
                <tr
                  key={row.name + idx}
                  className={`
                    ${row.level === 1 ? 'row-indent' : 'row-top'}
                    ${row.highlighted ? 'row-highlighted' : ''}
                  `}
                >
                  {/* Element Name */}
                  <td>
                    <div className="lane-b-elem-cell">
                      {row.marker && (
                        <span
                          className={`lane-b-elem-bubble ${
                            row.marker === '3' ? 'bubble-grey' : 'bubble-red'
                          }`}
                        >
                          {row.marker}
                        </span>
                      )}
                      <span className={`lane-b-elem-name ${row.level === 0 ? 'bold' : ''}`}>
                        {row.name}
                      </span>
                    </div>
                  </td>

                  {/* Cycle 1 */}
                  <td>
                    <span className="lane-b-num-cell">${row.cycle1.toFixed(2)}</span>
                  </td>

                  {/* Cycle 2 */}
                  <td>
                    <span className="lane-b-num-cell bold">${row.cycle2.toFixed(2)}</span>
                  </td>

                  {/* Delta */}
                  <td>
                    <span className={`lane-b-delta-cell ${isUp ? 'red' : 'green'}`}>
                      {isUp ? `+${row.delta.toFixed(2)}` : row.delta.toFixed(2)}
                    </span>
                  </td>

                  {/* Delta % with Gauge */}
                  <td>
                    <div className="lane-b-gauge-percent-cell">
                      <div className="lane-b-sub-gauge-track">
                        <div
                          className={`lane-b-sub-gauge-bar ${isUp ? 'red' : 'green'}`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <span className={`lane-b-sub-pct-text ${isUp ? 'red' : 'green'}`}>
                        {isUp ? `+${absPct}%` : `−${absPct}%`}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Total Row */}
            <tr className="lane-b-breakdown-total-row">
              <td>
                <span className="lane-b-total-title">{totalRow.name}</span>
              </td>
              <td>
                <span className="lane-b-num-cell">${totalRow.cycle1.toFixed(2)}</span>
              </td>
              <td>
                <span className="lane-b-num-cell bold">${totalRow.cycle2.toFixed(2)}</span>
              </td>
              <td>
                <span className="lane-b-delta-cell red bold">
                  +{totalRow.delta.toFixed(2)}
                </span>
              </td>
              <td>
                <span className="lane-b-delta-cell red bold">
                  +{totalRow.percent.toFixed(1)}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Verification Check Pills */}
      <div className="lane-b-checks-row">
        {checks.map((check, idx) => (
          <span key={check + idx} className="lane-b-check-pill">
            <Check size={13} strokeWidth={2.5} />
            <span>{check}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
