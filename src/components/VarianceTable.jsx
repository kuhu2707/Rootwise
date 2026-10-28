import { getCost, getDelta, getPercentChange, formatCurrency } from '../data/mockResults';

function ConfidenceSignal({ level = 'High' }) {
  const isHigh = level === 'High';
  return (
    <div className="confidence-signal-group">
      <div className="signal-bars">
        <span className={`signal-bar ${isHigh ? 'bar-high' : 'bar-medium'}`} style={{ height: '6px' }} />
        <span className={`signal-bar ${isHigh ? 'bar-high' : 'bar-medium'}`} style={{ height: '9px' }} />
        <span className={`signal-bar ${isHigh ? 'bar-high' : 'bar-muted'}`} style={{ height: '12px' }} />
      </div>
      <span className="confidence-text">{level}</span>
    </div>
  );
}

export function VarianceTable({ rows, measure, angle, onSelectRow }) {
  const commentaryLabel = angle === 'GVC Analyst' ? 'Diagnostic' : 'Management';

  return (
    <div className="table-scroll">
      <table className="variance-table">
        <thead>
          <tr>
            <th style={{ width: '22%' }}>ROOT PLANT / SKU</th>
            <th style={{ width: '10%' }}>CYCLE 1</th>
            <th style={{ width: '10%' }}>CYCLE 2</th>
            <th style={{ width: '10%' }}>DELTA</th>
            <th style={{ width: '14%' }}>DELTA %</th>
            <th style={{ width: '24%' }}>
              AI VARIANCE COMMENTARY <span className="commentary-pill">{commentaryLabel}</span>
            </th>
            <th style={{ width: '10%' }}>CONFIDENCE</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const costs = getCost(row, measure);
            const delta = getDelta(row, measure);
            const percent = getPercentChange(row, measure);
            const increase = delta >= 0;
            const commentary = angle === 'GVC Analyst' ? row.diagnosticCommentary : row.managementCommentary;

            return (
              <tr
                key={row.id}
                className={`variance-row-clickable ${increase ? 'row-stripe-increase' : 'row-stripe-decrease'}`}
                onClick={() => onSelectRow?.(row)}
                onKeyDown={(event) => {
                  if (event.target === event.currentTarget && onSelectRow && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    onSelectRow(row);
                  }
                }}
                tabIndex={onSelectRow ? 0 : undefined}
                aria-label={onSelectRow ? `Open variance details for ${row.product}` : undefined}
              >
                <td>
                  <div className="product-cell-wrap">
                    <span
                      className="product-letter-avatar"
                      style={{
                        backgroundColor: row.letterBg || (increase ? 'rgba(254, 242, 242, 1)' : 'rgba(236, 253, 245, 1)'),
                        color: row.letterColor || (increase ? 'rgba(226, 23, 0, 1)' : 'rgba(16, 185, 129, 1)'),
                      }}
                    >
                      {row.letter || row.product.slice(-1)}
                    </span>
                    <div className="product-title-group">
                      <strong>{row.product}</strong>
                      <small>{row.rootPlant} · SKU {row.sku}</small>
                    </div>
                  </div>
                </td>
                <td className="numeric-cell">{formatCurrency(costs.cycle1)}</td>
                <td className="numeric-cell numeric-strong">{formatCurrency(costs.cycle2)}</td>
                <td className={`delta-cell ${increase ? 'delta-up' : 'delta-down'}`}>
                  {increase ? '+' : '−'}{formatCurrency(Math.abs(delta))}
                </td>
                <td>
                  <div className="percent-cell-wrap">
                    <span className={`percent-num ${increase ? 'percent-up' : 'percent-down'}`}>
                      {increase ? '↗' : '↘'} {Math.abs(percent).toFixed(1)}%
                    </span>
                    <span className="mini-delta-bar">
                      <i
                        className={increase ? 'bar-fill-up' : 'bar-fill-down'}
                        style={{ width: `${Math.min(Math.abs(percent) * 3.5, 48)}px` }}
                      />
                    </span>
                  </div>
                </td>
                <td className="commentary-cell">{commentary}</td>
                <td>
                  <ConfidenceSignal level={row.confidence} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
