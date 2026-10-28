import { AgentTimeline } from '../../components/AgentTimeline';
import { getFlaggedRows } from '../../data/mockResults';
import { Clock3 } from 'lucide-react';

const stageBadges = {
  '03a.1': 'Step 1 of 4 · Prepare',
  '03a.2': 'Step 2 of 4 · Flag',
  '03a.3': 'Step 3 of 4 · Trace drivers',
  '03a.4': 'Step 4 of 4 · Explain',
  '03a.5': 'Complete · 4 of 4',
};

const runDurations = {
  '03a.1': '18 s',
  '03a.2': '34 s',
  '03a.3': '58 s',
  '03a.4': '1 m 12 s',
  '03a.5': '1 m 18 s',
};

export function AgentRunPage({ screen, settings, onAdvance, onBack, onViewReadyRows }) {
  const stepLabel = stageBadges[screen] || 'Step 1 of 4 · Prepare';
  const stage = ['03a.1', '03a.2', '03a.3', '03a.4', '03a.5'].indexOf(screen);
  const complete = screen === '03a.5';
  const rows = getFlaggedRows(settings.threshold, settings.measure);
  const duration = runDurations[screen] || '58 s';

  return (
    <div className="page-wrap run-page">
      <div className="run-page-heading">
        <div className="run-heading-left">
          <div className="run-badges">
            <span className="run-badge-tag">AGENT RUN</span>
            <span className="run-badge-step">{stepLabel}</span>
          </div>
          <h1>{settings.baseline} <span>→</span> {settings.comparison}</h1>
          <div className="run-chips">
            <span className="chip chip-status chip-running">
              <i className="pulse-dot" /> {complete ? `Complete · ${duration}` : `Running · ${duration}`}
            </span>
            <span className="chip">{settings.comparisonType}</span>
            <span className="chip">{settings.measure}</span>
            <span className="chip">Threshold ≥ {settings.threshold}%</span>
          </div>
        </div>
        <div className="run-heading-right">
          <button className="button-cancel-run" onClick={onBack}>Cancel run</button>
        </div>
      </div>

      <div className="run-pipeline-wrap" onClick={onAdvance} title="Click to advance stage (demo)" style={{ cursor: 'pointer' }}>
        <AgentTimeline screen={screen} settings={settings} />
      </div>

      {stage >= 2 ? (
        <section className="run-findings-card">
          <div className="run-findings-header">
            <h2>Flagged combinations</h2>
            <span className="run-findings-badge">{rows.length}</span>
            <span className="run-findings-subtitle">Rows are traced one by one</span>
          </div>
          <div className="run-table-wrap">
            <table className="run-live-table">
              <thead>
                <tr>
                  <th style={{ width: '38%' }}>FLAGGED COMBINATION</th>
                  <th style={{ width: '18%' }}>DELTA %</th>
                  <th style={{ width: '22%' }}>TRACE DRIVERS</th>
                  <th style={{ width: '22%' }}>EXPLAIN</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const isTracing = stage === 2 && idx === 0;
                  const isTraced = stage > 2 || (stage === 2 && idx < 0);
                  const isQueued = stage === 2 && idx > 0;

                  return (
                    <tr key={row.id}>
                      <td>
                        <div className="run-product-cell">
                          <span
                            className="run-avatar-box"
                            style={{
                              backgroundColor: row.letterBg || 'rgba(254, 242, 242, 1)',
                              color: row.letterColor || 'rgba(226, 23, 0, 1)',
                            }}
                          >
                            {row.letter || row.product.slice(-1)}
                          </span>
                          <span className="run-product-title">{row.product}</span>
                          <span className="run-product-code">{row.rootPlant}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className="run-delta-num"
                          style={{ color: row.deltaColor || 'rgba(226, 23, 0, 1)' }}
                        >
                          ↗ {row.deltaPercent ? `${row.deltaPercent.toFixed(1)}%` : '—'}
                        </span>
                      </td>
                      <td>
                        {isTracing ? (
                          <span className="run-status-chip chip-tracing">
                            <i className="pulse-dot" /> Tracing
                          </span>
                        ) : isTraced ? (
                          <span className="run-status-chip chip-done">
                            Traced
                          </span>
                        ) : (
                          <span className="run-status-chip chip-queued">
                            <Clock3 size={11} /> Queued
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="run-status-chip chip-waiting">
                          <Clock3 size={11} /> Waiting
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="run-empty-card">
          {stage === 1 ? (
            <>
              <h3>Flag agent is comparing totals</h3>
              <p>Flagged rows appear here when the comparison finishes.</p>
            </>
          ) : (
            <>
              <h3>No flagged combinations yet</h3>
              <p>Rows appear here as soon as the Flag agent finishes.</p>
            </>
          )}
        </section>
      )}
    </div>
  );
}
