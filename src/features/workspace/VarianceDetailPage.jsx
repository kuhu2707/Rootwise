import { formatCurrency, getCost, getDelta, getPercentChange } from '../../data/mockResults';
import { ExplainIcon } from '../../components/AgentTimeline';
import './varianceDetail.css';

function getBreakdown(row, costs, measure) {
  if (measure === 'Total group cost' && row.breakdown) return row.breakdown;

  const drivers = row.drivers || [];
  if (!drivers.length) return [{ name: 'Total cost movement', cycle1: costs.cycle1, cycle2: costs.cycle2, level: 0 }];
  const targetDelta = getDelta(row, measure);
  const driverTotal = drivers.reduce((sum, driver) => sum + driver.delta, 0) || 1;
  let allocatedDelta = 0;
  const weights = drivers.reduce((sum, driver) => sum + Math.abs(driver.delta), 0) || drivers.length;
  return drivers.map((driver, index) => {
    const scaledDelta = index === drivers.length - 1
      ? Number((targetDelta - allocatedDelta).toFixed(2))
      : Number((driver.delta * targetDelta / driverTotal).toFixed(2));
    allocatedDelta += scaledDelta;
    const cycle1 = costs.cycle1 * (Math.abs(driver.delta) / weights || 1 / drivers.length);
    const cycle2 = cycle1 + scaledDelta;
    return { name: driver.name, cycle1, cycle2, percent: cycle1 ? (scaledDelta / cycle1) * 100 : 0, level: 0 };
  });
}

function getFocusAreas(row, angle) {
  if (angle === 'Cost Analyst' && row.managementFocusAreas) return row.managementFocusAreas;
  if (row.focusAreas) return row.focusAreas;
  return (row.drivers || []).slice(0, 3).map((driver) => ({
    title: `${driver.name} ${driver.percent > 0 ? '+' : ''}${driver.percent}%`,
    detail: driver.detail,
  }));
}

function CostBridge({ row, costs, measure }) {
  const delta = getDelta(row, measure);
  const originalDrivers = row.drivers || [];
  const originalTotal = originalDrivers.reduce((sum, driver) => sum + driver.delta, 0);
  const scale = measure === 'Total group cost' || !originalTotal ? 1 : delta / originalTotal;
  const bridgeSteps = originalDrivers.map((driver) => ({ ...driver, delta: Number((driver.delta * scale).toFixed(2)) }));
  if (!bridgeSteps.length && Math.abs(delta) >= 0.01) bridgeSteps.push({ name: 'Cost elements', delta });
  const driverTotal = bridgeSteps.reduce((sum, driver) => sum + driver.delta, 0);
  const residual = Number((delta - driverTotal).toFixed(2));
  if (Math.abs(residual) >= 0.01) bridgeSteps.push({ name: 'Other', delta: residual });

  const labels = [
    { name: 'Cycle 1', value: costs.cycle1, type: 'total', date: 'April 2027' },
    ...bridgeSteps.map((step) => ({ ...step, type: 'change' })),
    { name: 'Cycle 2', value: costs.cycle2, type: 'total', date: 'May 2027' },
  ];
  const min = 9;
  const max = 13;
  const range = max - min;
  let running = costs.cycle1;

  return (
    <section className="evidence-panel bridge-panel">
      <div className="evidence-panel-header">
        <div className="header-title-pill">
          <h2>Cost bridge</h2>
          <span className="gvc-source-pill">From GVC records</span>
        </div>
      </div>

      <div className="bridge-chart-container">
        <div className="bridge-y-axis">
          <span>$13</span>
          <span>$12</span>
          <span>$11</span>
          <span>$10</span>
          <span>$9</span>
        </div>
        <div className="bridge-bars-area">
          <div className="bridge-grid-line" style={{ top: '0%' }} />
          <div className="bridge-grid-line" style={{ top: '25%' }} />
          <div className="bridge-grid-line" style={{ top: '50%' }} />
          <div className="bridge-grid-line" style={{ top: '75%' }} />
          <div className="bridge-grid-line" style={{ top: '100%' }} />

          <div className="bridge-columns-row">
            {labels.map((step, index) => {
              const current = running;
              const after = step.type === 'total' ? step.value : Number((running + step.delta).toFixed(2));
              const bottom = step.type === 'total' ? 0 : ((Math.min(current, after) - min) / range) * 100;
              const height = step.type === 'total' ? ((step.value - min) / range) * 100 : (Math.abs(step.delta) / range) * 100;
              if (step.type === 'change') running = after;

              const topPercent = ((step.type === 'total' ? step.value : Math.max(current, after)) - min) / range * 100;
              const markerNum = row.id === 'A-100245' ? ({ Material: '2', Manufacturing: '1', Logistics: '3' }[step.name]) : String(index);

              return (
                <div className="bridge-col" key={`${step.name}-${index}`}>
                  {step.type === 'change' && (
                    <span className="bridge-col-marker" style={{ bottom: `calc(${topPercent}% + 18px)` }}>
                      {markerNum}
                    </span>
                  )}
                  <span
                    className={`bridge-col-value ${step.type === 'change' ? (step.delta >= 0 ? 'bridge-val-up' : 'bridge-val-down') : 'bridge-val-total'}`}
                    style={{ bottom: `calc(${topPercent}% + 2px)` }}
                  >
                    {step.type === 'total' ? formatCurrency(step.value) : `${step.delta >= 0 ? '+' : '−'}${formatCurrency(Math.abs(step.delta))}`}
                  </span>
                  <i
                    className={`bridge-col-bar ${step.type === 'total' ? 'bar-total' : step.delta >= 0 ? 'bar-positive' : 'bar-negative'}`}
                    style={{ bottom: `${bottom}%`, height: `${Math.max(height, 2)}%` }}
                  />
                  <div className="bridge-col-label">
                    <span>{step.name}</span>
                    {step.date && <small>{step.date}</small>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function BreakdownTable({ row, rows, costs, settings }) {
  const cycle1Label = 'CYCLE 1';
  const cycle2Label = 'CYCLE 2';
  const delta = Number((costs.cycle2 - costs.cycle1).toFixed(2));
  const percent = costs.cycle1 ? ((delta / costs.cycle1) * 100) : 0;
  const checks = row.checks || ['Manufacturing node unchanged', 'BOM version unchanged', 'Supply route unchanged'];

  return (
    <section className="evidence-panel breakdown-panel">
      <div className="evidence-panel-header">
        <div className="header-title-pill">
          <h2>Breakdown by cost element</h2>
          <span className="gvc-source-pill">From GVC records</span>
        </div>
      </div>
      <p className="breakdown-subtitle">
        BOM level 1 gives the totals; detail rows (node type blank) give the elements below.
      </p>

      <div className="breakdown-table-wrap">
        <table className="breakdown-live-table">
          <thead>
            <tr>
              <th style={{ width: '38%' }}>COST ELEMENT</th>
              <th style={{ width: '15%' }}>{cycle1Label}</th>
              <th style={{ width: '15%' }}>{cycle2Label}</th>
              <th style={{ width: '15%' }}>DELTA</th>
              <th style={{ width: '17%' }}>DELTA %</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => {
              const itemDelta = Number((item.cycle2 - item.cycle1).toFixed(2));
              const itemPercent = item.percent ?? (item.cycle1 ? (itemDelta / item.cycle1) * 100 : 0);
              const increase = itemDelta >= 0;
              const isHighlight = item.name === 'API' || item.highlight;
              const isPrimary = !item.level;

              return (
                <tr
                  key={`${item.name}-${index}`}
                  className={`${item.level ? 'row-nested' : 'row-primary'} ${isHighlight ? 'row-highlighted' : ''}`}
                >
                  <td>
                    <div className="element-name-cell">
                      {item.marker && (
                        <span className={`element-num-badge badge-num-${item.marker}`}>
                          {item.marker}
                        </span>
                      )}
                      <span className={isPrimary ? 'primary-element-text' : 'nested-element-text'}>
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="num-cell">{formatCurrency(item.cycle1)}</td>
                  <td className="num-cell num-bold">{formatCurrency(item.cycle2)}</td>
                  <td className={`num-cell ${increase ? 'delta-red' : 'delta-green'}`}>
                    {increase ? '+' : '−'}{formatCurrency(Math.abs(itemDelta))}
                  </td>
                  <td className="num-cell">
                    <div className="delta-percent-cell">
                      <span
                        className={`delta-mini-bar ${increase ? 'bar-red' : 'bar-green'}`}
                        style={{ width: `${Math.min(Math.max(Math.abs(itemPercent) * 0.9, 6), 36)}px` }}
                      />
                      <span className={increase ? 'delta-red' : 'delta-green'}>
                        {increase ? '+' : '−'}{Math.abs(itemPercent).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="breakdown-total-row">
              <td>
                <span className="total-label">{settings.measure}</span>
              </td>
              <td className="num-cell num-bold">{formatCurrency(costs.cycle1)}</td>
              <td className="num-cell num-bold">{formatCurrency(costs.cycle2)}</td>
              <td className={`num-cell ${delta >= 0 ? 'delta-red' : 'delta-green'} num-bold`}>
                {delta >= 0 ? '+' : '−'}{formatCurrency(Math.abs(delta))}
              </td>
              <td className="num-cell num-bold">
                <div className="delta-percent-cell">
                  <span
                    className={`delta-mini-bar ${delta >= 0 ? 'bar-red' : 'bar-green'}`}
                    style={{ width: `${Math.min(Math.max(Math.abs(percent) * 0.9, 6), 36)}px` }}
                  />
                  <span className={delta >= 0 ? 'delta-red' : 'delta-green'}>
                    {delta >= 0 ? '+' : '−'}{Math.abs(percent).toFixed(1)}%
                  </span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="breakdown-checks-footer">
        {checks.map((checkText, idx) => (
          <div className="check-item" key={idx}>
            <span className="check-icon">✓</span>
            <span className="check-text">{checkText}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function VarianceDetailPage({ row, rows = [], angle, settings, onBack, onSelectRow }) {
  const costs = getCost(row, settings.measure);
  const delta = getDelta(row, settings.measure);
  const percent = getPercentChange(row, settings.measure);
  const focusAreas = getFocusAreas(row, angle);
  const breakdown = getBreakdown(row, costs, settings.measure);
  const cycle1Label = settings.baseline.replace('GCC ', '');
  const cycle2Label = settings.comparison.replace('GCC ', '');
  const summary = angle === 'GVC Analyst' && row.detailSummary ? row.detailSummary : row[angle === 'GVC Analyst' ? 'diagnosticCommentary' : 'managementCommentary'];

  const currentIndex = rows.findIndex((r) => r.id === row.id);
  const totalCount = rows.length || 6;
  const currentPos = currentIndex >= 0 ? currentIndex + 1 : 1;
  const nextRow = rows.length > 1 ? rows[(currentIndex + 1) % rows.length] : null;

  return (
    <div className="page-wrap detail-page">
      {/* Top Navigation Bar: Back link on left, Pagination on right */}
      <div className="detail-top-nav-bar">
        <button className="back-link-btn" onClick={onBack}>
          ← Back to results
        </button>

        <div className="detail-pagination">
          <span className="pagination-count">{currentPos} of {totalCount} flagged</span>
          {nextRow && (
            <button className="pagination-next-btn" onClick={() => onSelectRow?.(nextRow)}>
              Next · {nextRow.product} →
            </button>
          )}
        </div>
      </div>

      {/* Main Product Title & Delta */}
      <div className="detail-title-line">
        <h1>{row.product}</h1>
        <span className="delta-pill-badge">
          ↗ {Math.abs(percent).toFixed(1)}%
        </span>
      </div>

      {/* Context Metadata Pills */}
      <div className="detail-meta-pills">
        <span className="detail-meta-pill">Root plant {row.rootPlant}</span>
        <span className="detail-meta-pill">SKU {row.sku}</span>
        <span className="detail-meta-pill">{cycle1Label} → {cycle2Label}</span>
        <span className="detail-meta-pill">Total group cost per unit · USD</span>
      </div>

      {/* Insight Row: Explain Agent dark card + Cost Summary card */}
      <div className="insight-row">
        {/* Left: Explain Agent dark card */}
        <section className="explain-dark-card">
          <div className="explain-card-top-row">
            <div className="explain-ai-source-pill">
              <span className="explain-icon-box">
                <ExplainIcon size={12} color="#ffffff" />
              </span>
              <span className="explain-pill-label">
                Explain agent · AI-written from GVC records
              </span>
            </div>
            <span className="explain-pill-diag">Diagnostic</span>
          </div>

          <h2 className="explain-narrative">{summary}</h2>

          <div className="areas-check-label">AREAS TO CHECK</div>

          <div className="areas-check-grid">
            {focusAreas.map((area, index) => (
              <article key={`${area.title}-${index}`} className="area-check-box">
                <div className="area-check-header">
                  <span className={`area-num-circle ${index < 2 ? 'circle-red' : 'circle-dark'}`}>
                    {index + 1}
                  </span>
                  <strong>{area.title}</strong>
                </div>
                <p>{area.detail}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Right: Cost summary card */}
        <section className="cost-summary-card">
          <div className="cost-summary-eyebrow">TOTAL GROUP COST PER UNIT</div>

          <div className="cost-cycles-row">
            <div className="cost-cycle-col">
              <span className="cycle-col-label">Cycle 1 · April 2027</span>
              <strong className="cycle-col-price">{formatCurrency(costs.cycle1)}</strong>
            </div>

            <span className="cycles-arrow">→</span>

            <div className="cost-cycle-col">
              <span className="cycle-col-label">Cycle 2 · May 2027</span>
              <strong className="cycle-col-price">{formatCurrency(costs.cycle2)}</strong>
            </div>
          </div>

          <div className="change-highlight-box">
            <div className="change-box-left">
              <span className="change-tag">CHANGE</span>
              <strong className="change-num">
                {delta >= 0 ? '+' : '−'}{formatCurrency(Math.abs(delta))}
              </strong>
            </div>
            <span className="change-badge">
              ↗ {Math.abs(percent).toFixed(1)}%
            </span>
          </div>

          <div className="confidence-footer">
            <div className="confidence-signal-bars">
              <span className="sig-bar" style={{ height: '4px' }} />
              <span className="sig-bar" style={{ height: '7px' }} />
              <span className="sig-bar" style={{ height: '11px' }} />
            </div>
            <span className="confidence-text-strong">High</span>
            <span className="confidence-text-detail">· All cost elements present in both cycles</span>
          </div>
        </section>
      </div>

      {/* Evidence Row: Cost bridge & Breakdown by cost element */}
      <div className="evidence-row">
        <CostBridge row={row} costs={costs} measure={settings.measure} />
        <BreakdownTable row={row} rows={breakdown} costs={costs} settings={settings} />
      </div>
    </div>
  );
}
