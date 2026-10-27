import { ArrowRight, Check, Clock3, Sparkles } from 'lucide-react';
import { AgentTimeline } from '../../components/AgentTimeline';
import { Button, StatusBadge } from '../../components/ui';
import { getCost, getFlaggedRows, getPercentChange, formatCurrency } from '../../data/mockResults';

const stageInfo = {
  '03a.1': { step: 'Step 1 of 4 · Prepare', title: 'Matching root plant / SKU pairs', note: 'Aligning the two GVC outputs and validating the comparison set.' },
  '03a.2': { step: 'Step 2 of 4 · Flag', title: 'Checking cost movements', note: 'Comparing each matched total against your threshold.' },
  '03a.3': { step: 'Step 3 of 4 · Trace drivers', title: 'Tracing the flagged combinations', note: 'Following cost changes into BOM components and product flow nodes.' },
  '03a.4': { step: 'Step 4 of 4 · Explain', title: 'Writing variance commentary', note: 'Creating concise explanations from the underlying GVC records.' },
  '03a.5': { step: 'Complete · 4 of 4', title: 'Your comparison is ready', note: 'All agents finished. Review the flagged combinations and commentary.' },
};

export function AgentRunPage({ screen, settings, onAdvance, onBack, onViewReadyRows }) {
  const info = stageInfo[screen];
  const stage = ['03a.1', '03a.2', '03a.3', '03a.4', '03a.5'].indexOf(screen);
  const complete = screen === '03a.5';
  const rows = getFlaggedRows(settings.threshold, settings.measure);
  const visibleRows = stage < 2 ? [] : rows.slice(0, complete ? rows.length : Math.max(2, Math.ceil(rows.length * (stage === 2 ? 0.45 : 0.7))));

  return (
    <div className="page-wrap run-page">
      <div className="run-page-heading">
        <div>
          <span className="page-kicker">AGENT RUN <i /> {info.step}</span>
          <h1>{settings.baseline} <span>→</span> {settings.comparison}</h1>
          <div className="run-chips">
            <StatusBadge tone={complete ? 'success' : 'accent'}>{complete ? 'Completed · 2 min 04 s' : 'Running · demo'}</StatusBadge>
            <span>{settings.comparisonType}</span>
            <span>{settings.measure}</span>
            <span>Threshold ≥ {settings.threshold}%</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {stage >= 2 && !complete && (
            <Button variant="primary" onClick={onViewReadyRows || onAdvance}>
              View ready rows (2) <ArrowRight size={15} />
            </Button>
          )}
          <Button variant={complete ? 'primary' : 'outline'} onClick={onAdvance}>
            {complete ? 'View results' : 'Continue run'} <ArrowRight size={15} />
          </Button>
        </div>
      </div>
      <div className="run-context"><span className="angle-avatar">{settings.baseline.slice(4, 6)}</span><span><strong>{info.title}</strong><small>{info.note}</small></span><span className="run-context-angle"><Sparkles size={13} /> {complete ? 'Read-only · no changes written to GVC' : 'Working through mock data'}</span></div>
      <AgentTimeline screen={screen} settings={settings} />
      {visibleRows.length > 0 ? (
        <section className="run-findings panel">
          <div className="run-findings-heading">
            <div>
              <h2>Flagged combinations</h2>
              <span>{rows.length} rows <i /> {complete ? 'All rows traced and explained' : 'Rows move through Trace and Explain one by one'}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span className="run-stage-note"><Clock3 size={13} /> {complete ? 'Run complete' : stage === 2 ? 'Tracing · 1 of ' + rows.length : 'Explain · 2 of ' + rows.length}</span>
              {!complete && (
                <Button size="sm" variant="secondary" onClick={onViewReadyRows || onAdvance}>
                  View ready rows <ArrowRight size={13} />
                </Button>
              )}
            </div>
          </div>
          <div className="run-table-scroll"><table className="run-table"><thead><tr><th>FLAGGED COMBINATION</th><th>DELTA %</th><th>TRACE DRIVERS</th><th>EXPLAIN</th></tr></thead><tbody>{visibleRows.map((row, index) => {
            const pct = getPercentChange(row, settings.measure);
            return <tr key={row.id}><td><span className="run-product"><i>{row.product.slice(-1)}</i><strong>{row.product}</strong><small>{row.rootPlant}</small></span></td><td><span className={`percent-pill ${pct > 0 ? 'percent-up' : 'percent-down'}`}>{pct > 0 ? '↗' : '↘'} {Math.abs(pct).toFixed(1)}%</span></td><td><span className={`run-state-pill ${complete || index < Math.max(0, stage - 1) ? 'run-state-done' : index === 0 ? 'run-state-active' : 'run-state-wait'}`}>{complete ? <Check size={11} /> : index === 0 ? <Clock3 size={11} /> : <Clock3 size={11} />}{complete ? `${row.drivers.length} drivers` : index === 0 ? 'Tracing' : 'Queued'}</span></td><td><span className={`run-state-pill ${complete ? 'run-state-done' : 'run-state-wait'}`}>{complete ? <Check size={11} /> : <Clock3 size={11} />}{complete ? 'Written' : 'Waiting'}</span></td></tr>;
          })}</tbody></table></div>
        </section>
      ) : <div className="run-empty panel"><span className="empty-agent-icon"><Sparkles size={17} /></span><strong>No flagged combinations yet</strong><small>Rows appear here when the Flag agent finishes.</small></div>}
      <div className="run-bottom"><button onClick={onBack}>← Back</button><span>POC agent run · hardcoded demo states</span><Button size="sm" variant="quiet" onClick={onAdvance}>{complete ? 'Open results' : 'Advance to next stage'} <ArrowRight size={13} /></Button></div>
    </div>
  );
}
