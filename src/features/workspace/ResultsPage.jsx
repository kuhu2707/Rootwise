import { useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, ArrowDownRight, ChartNoAxesCombined, CircleHelp, Filter, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { MetricCard } from '../../components/MetricCard';
import { VarianceTable } from '../../components/VarianceTable';
import { Button, StatusBadge } from '../../components/ui';
import { formatCurrency, getCost, getDelta, getFlaggedRows, getPercentChange } from '../../data/mockResults';

export function ResultsPage({ angle, settings, onAdjustThreshold, onSelectRow }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const rows = useMemo(() => getFlaggedRows(settings.threshold, settings.measure), [settings.threshold, settings.measure]);
  const visibleRows = rows.filter((row) => {
    const searchMatch = `${row.product} ${row.rootPlant} ${row.sku}`.toLowerCase().includes(query.toLowerCase());
    const delta = getDelta(row, settings.measure);
    const filterMatch = filter === 'All' || (filter === 'Increases' && delta > 0) || (filter === 'Decreases' && delta < 0);
    return searchMatch && filterMatch;
  });
  const increases = rows.filter((row) => getDelta(row, settings.measure) > 0).length;
  const decreases = rows.length - increases;
  const largest = rows.reduce((best, row) => !best || Math.abs(getPercentChange(row, settings.measure)) > Math.abs(getPercentChange(best, settings.measure)) ? row : best, null);
  const largestCosts = largest ? getCost(largest, settings.measure) : null;
  const commentaryLabel = angle === 'GVC Analyst' ? 'Diagnostic' : 'Management';

  const exportCsv = () => {
    const records = [['Root plant', 'Product', 'SKU', 'Cycle 1', 'Cycle 2', 'Delta', 'Delta %', 'AI commentary', 'Confidence'], ...rows.map((row) => {
      const costs = getCost(row, settings.measure);
      const commentary = angle === 'GVC Analyst' ? row.diagnosticCommentary : row.managementCommentary;
      return [row.rootPlant, row.product, row.sku, costs.cycle1, costs.cycle2, getDelta(row, settings.measure), getPercentChange(row, settings.measure).toFixed(1), commentary, row.confidence];
    })];
    const content = records.map((record) => record.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `rootwise-${angle.toLowerCase().replace(' ', '-')}-results.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-wrap results-page">
      <div className="results-topline"><div><span className="page-kicker">COMPARISON RESULTS</span><h1>{rows.length} of 1,284 combinations flagged</h1><div className="result-context-pills"><span className="agent-token-row"><i>▤</i><i>⚑</i><i>⌘</i><i>✧</i><b>4 agents · completed 09:16</b></span><span>{settings.comparisonType}</span><span>{settings.measure}</span><span>Threshold ≥ {settings.threshold}%</span></div></div><div className="results-actions"><Button variant="outline" onClick={onAdjustThreshold}><Filter size={14} /> Threshold ≥ {settings.threshold}%</Button><Button variant="secondary" onClick={exportCsv}><ArrowDownToLine size={14} /> Export</Button></div></div>
      <div className="results-perspective"><span className="perspective-icon">{angle === 'GVC Analyst' ? <Search size={14} /> : <ChartNoAxesCombined size={14} />}</span><span><strong>{angle} perspective</strong><small>{angle === 'GVC Analyst' ? 'Error detection and issue resolution · diagnostic comments focus on what to check.' : 'Analysis and reporting · management comments focus on the business drivers.'}</small></span><StatusBadge tone="success">Same comparison · same flagged rows</StatusBadge></div>
      <div className="results-metric-grid">
        <MetricCard label="FLAGGED" value={rows.length} foot="of 1,284 combinations compared" tone="coral" />
        <MetricCard label="COST INCREASES" value={increases} foot={<><ArrowUpRight size={12} /> {increases} combinations increased</>} tone="amber" />
        <MetricCard label="COST DECREASES" value={decreases} foot={<><ArrowDownRight size={12} /> {decreases} combinations decreased</>} tone="green" />
        <MetricCard label="LARGEST MOVER" value={largest?.product || '—'} foot={largest && largestCosts ? <>{getPercentChange(largest, settings.measure) > 0 ? '↗' : '↘'} {Math.abs(getPercentChange(largest, settings.measure)).toFixed(1)}% · {formatCurrency(largestCosts.cycle1)} → {formatCurrency(largestCosts.cycle2)}</> : 'No row crossed the threshold'} tone="violet" onClick={() => largest && onSelectRow?.(largest)} />
      </div>
      <section className="results-table-card panel">
        <div className="results-table-heading"><div><h2>Flagged combinations <span>{rows.length}</span></h2><p>One line per flagged Root Plant / SKU combination</p></div><label className="table-search"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search product, SKU or plant" /><kbd>/</kbd></label></div>
        <div className="results-filter-tabs">{[['All', rows.length], ['Increases', increases], ['Decreases', decreases]].map(([label, count]) => <button key={label} className={filter === label ? 'filter-tab-active' : ''} onClick={() => setFilter(label)}>{label}<span>{count}</span></button>)}</div>
        {visibleRows.length ? <VarianceTable rows={visibleRows} measure={settings.measure} angle={angle} onSelectRow={onSelectRow} /> : <div className="no-results"><Search size={18} /><strong>No combinations match this view</strong><span>Try another filter or search term.</span></div>}
        <div className="results-table-footer"><span>Showing <strong>{visibleRows.length}</strong> of <strong>{rows.length}</strong> flagged combinations</span><span><ShieldCheck size={13} /> Confidence level reflects evidence available in the source records.</span></div>
      </section>
      <div className="results-note"><Sparkles size={14} /><span>AI variance commentary · {commentaryLabel}</span><i /> Both angles use the same dataset, threshold, and flagged rows.<button><CircleHelp size={13} /> About these results</button></div>
    </div>
  );
}

