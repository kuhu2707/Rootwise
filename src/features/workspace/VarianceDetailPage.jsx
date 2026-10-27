import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { formatCurrency, getCost, getDelta, getPercentChange } from '../../data/mockResults';
import { Button } from '../../components/ui';
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
    return { name: driver.name, cycle1, cycle2, percent: cycle1 ? scaledDelta / cycle1 * 100 : 0, level: 0 };
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
    { name: 'Cycle 1', value: costs.cycle1, type: 'total', date: 'Baseline' },
    ...bridgeSteps.map((step) => ({ ...step, type: 'change' })),
    { name: 'Cycle 2', value: costs.cycle2, type: 'total', date: 'Comparison' },
  ];
  const min = Math.floor(Math.min(costs.cycle1, costs.cycle2) - 1);
  const max = Math.ceil(Math.max(costs.cycle1, costs.cycle2) + 0.5);
  const range = Math.max(max - min, 1);
  let running = costs.cycle1;

  return (
    <section className="detail-panel bridge-panel">
      <div className="detail-panel-heading"><div><h2>Cost bridge</h2><span className="source-pill">From GVC records</span></div><small>Change per unit</small></div>
      <div className="bridge-chart" style={{ '--chart-range': range }}>
        <div className="bridge-grid-lines">{[0, 1, 2, 3].map((line) => <i key={line} />)}</div>
        <div className="bridge-y-labels"><span>{formatCurrency(max)}</span><span>{formatCurrency(max - range / 3)}</span><span>{formatCurrency(max - range * 2 / 3)}</span><span>{formatCurrency(min)}</span></div>
        <div className="bridge-columns">
          {labels.map((step, index) => {
            const current = running;
            const after = step.type === 'total' ? step.value : Number((running + step.delta).toFixed(2));
            const bottom = step.type === 'total' ? 0 : ((Math.min(current, after) - min) / range) * 100;
            const height = step.type === 'total' ? ((step.value - min) / range) * 100 : (Math.abs(step.delta) / range) * 100;
            if (step.type === 'change') running = after;
            return (
              <div className="bridge-column" key={`${step.name}-${index}`}>
                {(() => {
                  const topPercent = ((step.type === 'total' ? step.value : Math.max(current, after)) - min) / range * 100;
                  const marker = row.id === 'A-100245' ? ({ Material: '2', Manufacturing: '1', Logistics: '3' }[step.name]) : String(index);
                  return <>
                    {step.type === 'change' && <span className="bridge-marker" style={{ bottom: `calc(${topPercent}% + 14px)` }}>{marker}</span>}
                    <span className={`bridge-value ${step.type === 'change' ? (step.delta >= 0 ? 'bridge-up-label' : 'bridge-down-label') : ''}`} style={{ bottom: `calc(${topPercent}% + 2px)` }}>
                  {step.type === 'total' ? formatCurrency(step.value) : `${step.delta >= 0 ? '+' : '−'}${formatCurrency(Math.abs(step.delta))}`}
                    </span>
                  </>;
                })()}
                <i className={`bridge-bar ${step.type === 'total' ? 'bridge-total' : step.delta >= 0 ? 'bridge-positive' : 'bridge-negative'}`} style={{ bottom: `${bottom}%`, height: `${Math.max(height, 1.5)}%` }} />
                <span className="bridge-category">{step.name}</span>
                <small>{step.date || ''}</small>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bridge-legend"><i /> Cost increase <i className="legend-decrease" /> Cost decrease</div>
    </section>
  );
}

function BreakdownTable({ rows, costs, settings }) {
  const cycle1Label = settings.baseline.replace('GCC ', '');
  const cycle2Label = settings.comparison.replace('GCC ', '');
  const topTotal = rows.filter((row) => row.level === 0).reduce((sum, row) => sum + row.cycle1, 0);
  const bottomTotal = rows.filter((row) => row.level === 0).reduce((sum, row) => sum + row.cycle2, 0);
  const totalDelta = Number((costs.cycle2 - costs.cycle1).toFixed(2));
  const totalPercent = (totalDelta / costs.cycle1) * 100;
  const checks = ['Manufacturing node unchanged', 'BOM version unchanged', 'Supply route unchanged'];

  return (
    <section className="detail-panel breakdown-panel">
      <div className="detail-panel-heading"><div><h2>Breakdown by cost element</h2><span className="source-pill">From GVC records</span></div><button className="detail-more-button" aria-label="Breakdown information">•••</button></div>
      <p className="breakdown-note">BOM level 1 gives the totals; detail rows show the elements behind each cost.</p>
      <div className="breakdown-scroll"><table className="breakdown-table"><thead><tr><th>COST ELEMENT</th><th>{cycle1Label}</th><th>{cycle2Label}</th><th>DELTA</th><th>DELTA %</th></tr></thead><tbody>
        {rows.map((item, index) => {
          const delta = Number((item.cycle2 - item.cycle1).toFixed(2));
          const percent = item.percent ?? (item.cycle1 ? delta / item.cycle1 * 100 : 0);
          return <tr key={`${item.name}-${index}`} className={`${item.level ? 'breakdown-nested' : ''} ${item.marker ? 'breakdown-key-row' : ''}`}>
            <td>{item.marker && <span className={`breakdown-marker marker-${item.marker}`}>{item.marker}</span>}<span>{item.name}</span></td>
            <td>{formatCurrency(item.cycle1)}</td><td>{formatCurrency(item.cycle2)}</td>
            <td className={delta >= 0 ? 'detail-delta-up' : 'detail-delta-down'}>{delta >= 0 ? '+' : '−'}{formatCurrency(Math.abs(delta))}</td>
            <td><span className="breakdown-percent-track"><i className={delta >= 0 ? 'breakdown-up' : 'breakdown-down'} style={{ width: `${Math.min(Math.abs(percent) * 1.4, 100)}%` }} /></span><span className={delta >= 0 ? 'detail-delta-up' : 'detail-delta-down'}>{delta >= 0 ? '+' : '−'}{Math.abs(percent).toFixed(0)}%</span></td>
          </tr>;
        })}
        <tr className="breakdown-grand-total"><td>Total {settings.measure.toLowerCase()}</td><td>{formatCurrency(costs.cycle1)}</td><td>{formatCurrency(costs.cycle2)}</td><td className={totalDelta >= 0 ? 'detail-delta-up' : 'detail-delta-down'}>{totalDelta >= 0 ? '+' : '−'}{formatCurrency(Math.abs(totalDelta))}</td><td className={totalDelta >= 0 ? 'detail-delta-up' : 'detail-delta-down'}>{totalDelta >= 0 ? '+' : '−'}{Math.abs(totalPercent).toFixed(1)}%</td></tr>
      </tbody></table></div>
      <div className="detail-checks">{(checks).map((check) => <span key={check}><Check size={10} />{check}</span>)}</div>
      {Math.abs(topTotal - costs.cycle1) > 0.02 || Math.abs(bottomTotal - costs.cycle2) > 0.02 ? <span className="sr-only">Breakdown rows are illustrative where source detail is unavailable.</span> : null}
    </section>
  );
}

export function VarianceDetailPage({ row, rows, angle, settings, onBack, onSelectRow }) {
  const costs = getCost(row, settings.measure);
  const delta = getDelta(row, settings.measure);
  const percent = getPercentChange(row, settings.measure);
  const currentIndex = rows.findIndex((item) => item.id === row.id);
  const focusAreas = getFocusAreas(row, angle);
  const breakdown = getBreakdown(row, costs, settings.measure);
  const cycle1Label = settings.baseline.replace('GCC ', '');
  const cycle2Label = settings.comparison.replace('GCC ', '');
  const commentaryLabel = angle === 'GVC Analyst' ? 'Explain agent · Diagnostic' : 'Explain agent · Management';
  const summary = angle === 'GVC Analyst' && row.detailSummary ? row.detailSummary : row[angle === 'GVC Analyst' ? 'diagnosticCommentary' : 'managementCommentary'];

  return (
    <div className="page-wrap detail-page">
      <div className="detail-back-line"><button onClick={onBack}><ArrowLeft size={13} /> Back to results</button><span>Variance detail · {angle}</span></div>
      <div className="detail-heading-row">
        <div><div className="detail-title-line"><h1>{row.product}</h1><span className={`percent-pill ${delta >= 0 ? 'percent-up' : 'percent-down'}`}>{delta >= 0 ? '↗' : '↘'} {Math.abs(percent).toFixed(1)}%</span></div>
          <div className="detail-context-pills"><span>Root plant {row.rootPlant}</span><span>SKU {row.sku}</span><span>{cycle1Label} → {cycle2Label}</span><span>{settings.measure} per unit · USD</span></div>
        </div>
        <div className="detail-row-nav"><small>{currentIndex + 1} of {rows.length} flagged</small><Button variant="outline" size="sm" aria-label="Previous flagged product" disabled={currentIndex <= 0} onClick={() => onSelectRow(rows[currentIndex - 1])}><ChevronLeft size={15} /></Button><Button variant="outline" size="sm" disabled={currentIndex >= rows.length - 1} onClick={() => onSelectRow(rows[currentIndex + 1])}>Next · {rows[currentIndex + 1]?.product || '—'} <ChevronRight size={13} /></Button></div>
      </div>

      <div className="detail-summary-grid">
        <section className="explain-card">
          <div className="explain-card-top"><span className="explain-agent-icon"><Sparkles size={13} /></span><span>{commentaryLabel} · AI-written from GVC records</span><b>{angle === 'GVC Analyst' ? 'Diagnostic' : 'Business drivers'}</b></div>
          <h2>{summary}</h2>
          <div className="focus-label">{angle === 'GVC Analyst' ? 'AREAS TO CHECK' : 'BUSINESS DRIVERS'}</div>
          <div className="focus-area-grid">{focusAreas.map((area, index) => <article key={`${area.title}-${index}`}><span>{index + 1}</span><strong>{area.title}</strong><p>{area.detail}</p></article>)}</div>
        </section>
        <section className="detail-total-card">
          <span className="detail-eyebrow">{settings.measure.toUpperCase()} PER UNIT</span>
          <div className="total-cycle-pair"><div><small>Cycle 1 · {cycle1Label}</small><strong>{formatCurrency(costs.cycle1)}</strong></div><ArrowRight size={15} /><div><small>Cycle 2 · {cycle2Label}</small><strong>{formatCurrency(costs.cycle2)}</strong></div></div>
          <div className={`detail-change-box ${delta < 0 ? 'change-down' : ''}`}><span>CHANGE</span><strong>{delta >= 0 ? '+' : '−'}{formatCurrency(Math.abs(delta))}</strong><b>{delta >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{Math.abs(percent).toFixed(1)}%</b></div>
          <div className={`detail-confidence ${row.confidence === 'High' ? '' : 'confidence-medium'}`}><i />{row.confidence}<small>All cost elements present in both cycles</small></div>
        </section>
      </div>

      <div className="detail-analysis-grid"><CostBridge row={row} costs={costs} measure={settings.measure} /><BreakdownTable rows={breakdown} costs={costs} settings={settings} /></div>
      <div className="detail-footer-note"><span><Check size={11} /> Read-only analysis</span><span>Variance detail is based on the selected flagged row and mock GVC records.</span><button aria-label="More about this analysis">More about this analysis <ChevronRight size={12} /></button></div>
    </div>
  );
}
