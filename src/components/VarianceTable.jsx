import { getCost, getDelta, getPercentChange, formatCurrency } from '../data/mockResults';

export function VarianceTable({ rows, measure, angle, onSelectRow }) {
  const commentaryLabel = angle === 'GVC Analyst' ? 'DIAGNOSTIC' : 'MANAGEMENT';
  return (
    <div className="table-scroll">
      <table className="variance-table">
        <thead><tr><th>ROOT PLANT / SKU</th><th>CYCLE 1</th><th>CYCLE 2</th><th>DELTA</th><th>DELTA %</th><th>AI VARIANCE COMMENTARY <span className="commentary-tag">{commentaryLabel}</span></th><th>CONFIDENCE</th></tr></thead>
        <tbody>{rows.map((row) => {
          const costs = getCost(row, measure);
          const delta = getDelta(row, measure);
          const percent = getPercentChange(row, measure);
          const increase = delta >= 0;
          const commentary = angle === 'GVC Analyst' ? row.diagnosticCommentary : row.managementCommentary;
          return <tr key={row.id} className={onSelectRow ? 'variance-row-clickable' : ''} onClick={() => onSelectRow?.(row)} onKeyDown={(event) => { if (event.target === event.currentTarget && onSelectRow && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onSelectRow(row); } }} tabIndex={onSelectRow ? 0 : undefined} aria-label={onSelectRow ? `Open variance details for ${row.product}` : undefined}>
            <td><button className="product-cell product-open-button" type="button" onClick={(event) => { event.stopPropagation(); onSelectRow?.(row); }} aria-label={`Open variance details for ${row.product}`}><span className={`product-letter letter-${row.product.slice(-1).toLowerCase()}`}>{row.product.slice(-1)}</span><span><strong>{row.product}</strong><small>{row.rootPlant} · SKU {row.sku}</small></span></button></td>
            <td className="numeric-cell">{formatCurrency(costs.cycle1)}</td>
            <td className="numeric-cell numeric-strong">{formatCurrency(costs.cycle2)}</td>
            <td className={`delta-cell ${increase ? 'delta-up' : 'delta-down'}`}>{increase ? '+' : '−'}{formatCurrency(Math.abs(delta))}</td>
            <td><span className={`percent-pill ${increase ? 'percent-up' : 'percent-down'}`}>{increase ? '↗' : '↘'} {Math.abs(percent).toFixed(1)}%</span><span className="delta-bar"><i className={increase ? 'bar-up' : 'bar-down'} style={{ width: `${Math.min(Math.abs(percent) * 3, 100)}%` }} /></span></td>
            <td className="commentary-cell">{commentary}</td>
            <td><span className={`confidence-label ${row.confidence === 'High' ? 'confidence-high' : 'confidence-medium'}`}><i />{row.confidence}</span></td>
          </tr>;
        })}</tbody>
      </table>
    </div>
  );
}
