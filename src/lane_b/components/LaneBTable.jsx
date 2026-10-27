import React from 'react';
import { Search, Bot } from 'lucide-react';
import { SignalConfidence } from './SignalConfidence';
import { DeltaGaugeBar } from './DeltaGaugeBar';

/**
 * LaneBTable Component
 * Renders the Flagged combinations table matching the screenshot
 */
export function LaneBTable({
  rows = [],
  activeFilter = 'All',
  onFilterChange,
  counts = { all: 6, increases: 4, decreases: 2 },
  searchQuery = '',
  onSearchChange,
  selectedRowId = 'A-100245',
  onSelectRow,
}) {
  return (
    <div className="lane-b-table-card">
      {/* Table Toolbar */}
      <div className="lane-b-table-top">
        <div className="lane-b-table-heading-area">
          <h2 className="lane-b-table-title">Flagged combinations</h2>

          {/* Sub-tabs pills */}
          <div className="lane-b-table-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'All'}
              className={`lane-b-tab-btn ${activeFilter === 'All' ? 'active' : ''}`}
              onClick={() => onFilterChange && onFilterChange('All')}
            >
              All {counts.all}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'Increases'}
              className={`lane-b-tab-btn ${activeFilter === 'Increases' ? 'active' : ''}`}
              onClick={() => onFilterChange && onFilterChange('Increases')}
            >
              Increases {counts.increases}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'Decreases'}
              className={`lane-b-tab-btn ${activeFilter === 'Decreases' ? 'active' : ''}`}
              onClick={() => onFilterChange && onFilterChange('Decreases')}
            >
              Decreases {counts.decreases}
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="lane-b-table-search">
          <Search size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search product, SKU or plant"
            aria-label="Search combinations"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="lane-b-table-wrapper">
        <table className="lane-b-data-table">
          <thead>
            <tr>
              <th>ROOT PLANT / SKU</th>
              <th>CYCLE 1</th>
              <th>CYCLE 2</th>
              <th>DELTA</th>
              <th>DELTA %</th>
              <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>AI VARIANCE COMMENTARY</span>
                  <span className="lane-b-commentary-badge">
                    <Bot size={11} /> Management
                  </span>
                </div>
              </th>
              <th>CONFIDENCE</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => {
                const isSelected = row.id === selectedRowId;
                const isUp = row.delta > 0;

                return (
                  <tr
                    key={row.id}
                    className={isSelected ? 'selected' : ''}
                    onClick={() => onSelectRow && onSelectRow(row)}
                  >
                    {/* 1. Root Plant / SKU with avatar */}
                    <td>
                      <div className="lane-b-product-cell">
                        <div className={`lane-b-avatar-box ${row.tone || 'coral'}`}>
                          {row.letter || row.product?.charAt(row.product.length - 1) || 'A'}
                        </div>
                        <div className="lane-b-product-details">
                          <span className="lane-b-product-name">{row.product}</span>
                          <span className="lane-b-product-sub">
                            {row.rootPlant} · SKU {row.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Cycle 1 */}
                    <td>
                      <span className="lane-b-cell-cycle1">
                        ${row.cycle1.toFixed(2)}
                      </span>
                    </td>

                    {/* 3. Cycle 2 */}
                    <td>
                      <span className="lane-b-cell-cycle2">
                        ${row.cycle2.toFixed(2)}
                      </span>
                    </td>

                    {/* 4. Delta */}
                    <td>
                      <span
                        className={`lane-b-cell-delta ${isUp ? 'red' : 'green'}`}
                      >
                        {isUp ? `+${row.delta.toFixed(2)}` : row.delta.toFixed(2)}
                      </span>
                    </td>

                    {/* 5. Delta % with mini gauge */}
                    <td>
                      <DeltaGaugeBar
                        percent={row.deltaPercent}
                        direction={row.direction || (isUp ? 'up' : 'down')}
                      />
                    </td>

                    {/* 6. AI Variance Commentary */}
                    <td>
                      <div className="lane-b-commentary-text">
                        {row.commentary}
                      </div>
                    </td>

                    {/* 7. Confidence */}
                    <td>
                      <SignalConfidence
                        confidence={row.confidence}
                        score={row.confidenceScore}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  No combinations match your search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
