import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Share2 } from 'lucide-react';
import { MetricCard } from '../../components/MetricCard';
import { VarianceTable } from '../../components/VarianceTable';
import { formatCurrency, getCost, getDelta, getFlaggedRows, getPercentChange } from '../../data/mockResults';
import { DatabaseIcon, FlagIcon, TraceDriversIcon, ExplainIcon } from '../../components/AgentTimeline';

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

  const exportCsv = () => {
    const records = [
      ['Root plant', 'Product', 'SKU', 'Cycle 1', 'Cycle 2', 'Delta', 'Delta %', 'AI commentary', 'Confidence'],
      ...rows.map((row) => {
        const costs = getCost(row, settings.measure);
        const commentary = angle === 'GVC Analyst' ? row.diagnosticCommentary : row.managementCommentary;
        return [row.rootPlant, row.product, row.sku, costs.cycle1, costs.cycle2, getDelta(row, settings.measure), getPercentChange(row, settings.measure).toFixed(1), commentary, row.confidence];
      }),
    ];
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
      {/* Top Heading Area */}
      <div className="results-heading-row">
        <div className="results-heading-left">
          <h1>{rows.length} of 1,284 combinations flagged</h1>
          <div className="results-badges-wrap">
            {/* 4 agents completed pill */}
            <div className="agents-done-pill">
              <span className="mini-agent-icon mini-icon-blue"><DatabaseIcon size={10} color="#ffffff" /></span>
              <span className="mini-agent-icon mini-icon-orange"><FlagIcon size={10} color="#ffffff" /></span>
              <span className="mini-agent-icon mini-icon-purple"><TraceDriversIcon size={10} color="#ffffff" /></span>
              <span className="mini-agent-icon mini-icon-coral"><ExplainIcon size={10} color="#ffffff" /></span>
              <span className="agents-done-text">4 agents · completed 09:16</span>
            </div>

            <span className="meta-pill">{settings.comparisonType}</span>
            <span className="meta-pill">{settings.measure}</span>
            <span className="meta-pill">Threshold ≥ {settings.threshold}%</span>
          </div>
        </div>

        <div className="results-heading-right">
          <button className="button-outline-threshold" onClick={onAdjustThreshold}>
            <SlidersHorizontal size={13} /> Threshold ≥ {settings.threshold}%
          </button>
          <button className="button-black-export" onClick={exportCsv}>
            <Share2 size={13} /> Export
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="results-kpi-grid">
        <MetricCard
          label="FLAGGED"
          value={rows.length}
          foot="of 1,284 combinations compared"
          tone="red"
          active={true}
        />
        <MetricCard
          label="COST INCREASES"
          value={increases}
          foot="↗ +$6.08 per unit, combined"
          tone="amber"
        />
        <MetricCard
          label="COST DECREASES"
          value={decreases}
          foot="↘ -$3.48 per unit, combined"
          tone="green"
        />
        <MetricCard
          label="LARGEST MOVER"
          value={largest?.product || '—'}
          foot={largest && largestCosts ? `↗ 21.9% · ${formatCurrency(largestCosts.cycle1)} → ${formatCurrency(largestCosts.cycle2)}` : 'No row crossed threshold'}
          tone="purple"
          onClick={() => largest && onSelectRow?.(largest)}
        />
      </div>

      {/* Main Results Table Card */}
      <section className="results-table-card">
        <div className="results-table-ctrl-bar">
          <div className="ctrl-bar-left">
            <h2>Flagged combinations</h2>
            <div className="segmented-control">
              <button
                className={`seg-btn ${filter === 'All' ? 'seg-btn-active' : ''}`}
                onClick={() => setFilter('All')}
              >
                All {rows.length}
              </button>
              <button
                className={`seg-btn ${filter === 'Increases' ? 'seg-btn-active' : ''}`}
                onClick={() => setFilter('Increases')}
              >
                Increases {increases}
              </button>
              <button
                className={`seg-btn ${filter === 'Decreases' ? 'seg-btn-active' : ''}`}
                onClick={() => setFilter('Decreases')}
              >
                Decreases {decreases}
              </button>
            </div>
          </div>

          <div className="ctrl-bar-right">
            <div className="search-box">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search product, SKU or plant"
              />
            </div>
          </div>
        </div>

        {visibleRows.length ? (
          <VarianceTable
            rows={visibleRows}
            measure={settings.measure}
            angle={angle}
            onSelectRow={onSelectRow}
          />
        ) : (
          <div className="no-results">
            <Search size={18} />
            <strong>No combinations match this view</strong>
            <span>Try another filter or search term.</span>
          </div>
        )}
      </section>
    </div>
  );
}
