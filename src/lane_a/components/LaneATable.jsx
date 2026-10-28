import React from 'react';
import { Search, MessageSquare } from 'lucide-react';
import { LaneABanner } from './LaneABanner';

export function LaneATable({
  rows = [],
  counts = { all: 6, increases: 4, decreases: 2 },
  filter = 'All',
  onFilterChange,
  query = '',
  onQueryChange,
  bannerPill = '2 of 6 written',
  bannerText = 'Commentary is still being written. Costs and deltas are final, so you can review them now.',
  onSelectRow,
}) {
  return (
    <div className="lane-a-table-card">
      {/* Table Controls Row */}
      <div className="lane-a-table-controls">
        <div className="lane-a-table-controls-left">
          <span className="lane-a-table-title">Flagged combinations</span>

          <div className="lane-a-filter-tabs">
            <button
              className={`lane-a-filter-tab ${filter === 'All' ? 'active' : ''}`}
              onClick={() => onFilterChange && onFilterChange('All')}
            >
              All {counts.all}
            </button>
            <button
              className={`lane-a-filter-tab ${filter === 'Increases' ? 'active' : ''}`}
              onClick={() => onFilterChange && onFilterChange('Increases')}
            >
              Increases {counts.increases}
            </button>
            <button
              className={`lane-a-filter-tab ${filter === 'Decreases' ? 'active' : ''}`}
              onClick={() => onFilterChange && onFilterChange('Decreases')}
            >
              Decreases {counts.decreases}
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="lane-a-search-box">
          <Search size={14} className="lane-a-search-icon" />
          <input
            type="text"
            placeholder="Search product, SKU or plant"
            value={query}
            onChange={(e) => onQueryChange && onQueryChange(e.target.value)}
          />
        </div>
      </div>

      {/* In-Progress Notice Banner */}
      <LaneABanner pillText={bannerPill} text={bannerText} />

      {/* Flagged Rows Table */}
      <div className="lane-a-table-wrap">
        <table className="lane-a-table">
          <thead>
            <tr>
              <th>ROOT PLANT / SKU</th>
              <th>CYCLE 1</th>
              <th>CYCLE 2</th>
              <th>DELTA</th>
              <th>DELTA %</th>
              <th className="commentary-col">
                AI VARIANCE COMMENTARY
                <span className="lane-a-badge-diagnostic">
                  <MessageSquare size={11} fill="currentColor" /> Diagnostic
                </span>
              </th>
              <th>CONFIDENCE</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isIncrease = row.delta > 0;
              const isWritten = row.commentaryStatus === 'written';
              const isSelected = row.id === 'A-100245'; // Matching screenshot active row

              return (
                <tr
                  key={row.id}
                  className={isSelected ? 'row-active' : ''}
                  onClick={() => onSelectRow && onSelectRow(row)}
                  title={`Click to view ${row.product} variance details`}
                >
                  {/* Column 1: Root Plant / SKU */}
                  <td>
                    <div className="lane-a-product-cell">
                      <div className={`lane-a-avatar ${row.direction === 'down' ? 'mint' : 'peach'}`}>
                        {row.letter}
                      </div>
                      <div className="lane-a-product-details">
                        <span className="lane-a-product-name">{row.product}</span>
                        <span className="lane-a-product-sub">
                          {row.rootPlant} · SKU {row.sku}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Cycle 1 */}
                  <td>
                    <span className="lane-a-cycle1">
                      ${row.totalGroupCost.cycle1.toFixed(2)}
                    </span>
                  </td>

                  {/* Column 3: Cycle 2 */}
                  <td>
                    <span className="lane-a-cycle2">
                      ${row.totalGroupCost.cycle2.toFixed(2)}
                    </span>
                  </td>

                  {/* Column 4: Delta */}
                  <td>
                    <span className={`lane-a-delta-val ${isIncrease ? 'increase' : 'decrease'}`}>
                      {isIncrease ? '+' : ''}{row.delta.toFixed(2)}
                    </span>
                  </td>

                  {/* Column 5: Delta % with Horizontal Gauge Bar */}
                  <td>
                    <div className="lane-a-delta-pct-cell">
                      <span className={`lane-a-delta-pct-val ${isIncrease ? 'increase' : 'decrease'}`}>
                        {isIncrease ? '↗' : '↘'} {Math.abs(row.percent).toFixed(1)}%
                      </span>
                      <div className={`lane-a-gauge-bar ${isIncrease ? 'increase' : 'decrease'}`} />
                    </div>
                  </td>

                  {/* Column 6: AI Variance Commentary */}
                  <td>
                    {isWritten ? (
                      <div className="lane-a-commentary-text">
                        {row.commentary}
                      </div>
                    ) : (
                      <div className="lane-a-skeleton-container">
                        <div className="lane-a-skeleton-bar w-80" />
                        <div className="lane-a-skeleton-bar w-50" />
                        <span className="lane-a-writing-badge">
                          <span className="lane-a-writing-dot" /> Explain agent writing
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Column 7: Confidence */}
                  <td>
                    {isWritten ? (
                      <div className="lane-a-confidence-cell">
                        <span className="lane-a-signal-meter">
                          <span className="lane-a-signal-bar bar-1" />
                          <span className="lane-a-signal-bar bar-2" />
                          <span className="lane-a-signal-bar bar-3" />
                        </span>
                        <span className="lane-a-confidence-text">High</span>
                      </div>
                    ) : (
                      <div className="lane-a-confidence-cell">
                        <span className="lane-a-confidence-text pending">Pending</span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
