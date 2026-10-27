import { Bot, Check, Circle, Database, Flag, GitBranch, MessageSquareText } from 'lucide-react';

const agents = [
  { label: 'Prepare', detail: 'Match root plant / SKU pairs', icon: Database },
  { label: 'Flag', detail: 'Compare totals to threshold', icon: Flag },
  { label: 'Trace drivers', detail: 'Follow BOM and cost elements', icon: GitBranch },
  { label: 'Explain', detail: 'Write angle-specific commentary', icon: MessageSquareText },
];

const stageIndex = { '03a.1': 0, '03a.2': 1, '03a.3': 2, '03a.4': 3, '03a.5': 4 };

export function AgentTimeline({ screen, settings }) {
  const activeIndex = stageIndex[screen] ?? 0;
  const completeRun = screen === '03a.5';
  return (
    <div className="pipeline-card">
      <div className="pipeline-heading"><div><strong>Agent pipeline</strong><span>4 agents · read-only on GVC outputs</span></div><div className="pipeline-legend"><i className="legend-done" /> Complete <i className="legend-working" /> Working <i /> Waiting</div></div>
      <div className="pipeline-flow">
        <div className="dataset-stack">
          <div className="dataset-node"><span className="dataset-icon"><Database size={16} /></span><span><strong>{settings.baseline}</strong><small>Baseline · GVC output</small></span></div>
          <div className="dataset-node"><span className="dataset-icon"><Database size={16} /></span><span><strong>{settings.comparison}</strong><small>Comparison · GVC output</small></span></div>
        </div>
        <div className="pipeline-agents">
          {agents.map(({ label, detail, icon: Icon }, index) => {
            const done = completeRun || index < activeIndex;
            const working = !completeRun && index === activeIndex;
            return <div className={`pipeline-agent ${done ? 'agent-done' : ''} ${working ? 'agent-working' : ''}`} key={label}>
              <div className="pipeline-connector" />
              <span className="agent-node-icon"><Icon size={21} /></span>
              {(done || working) && <span className="agent-check">{done ? <Check size={10} /> : <span />}</span>}
              <strong>{label}</strong>
              <span className={`agent-state ${done ? 'state-done' : working ? 'state-working' : 'state-waiting'}`}>{done ? <><Check size={10} /> Done</> : working ? <><i /> {['Matching pairs', 'Comparing totals', 'Tracing drivers', 'Writing'][index]}</> : <><Circle size={10} /> Waiting</>}</span>
              <small>{completeRun ? ['1,284 pairs matched', '6 of 1,284 above threshold', '6 traced · 9 drivers found', '6 of 6 explained'][index] : working ? detail : index === 0 ? 'Ready to match the datasets' : 'Starts when the previous stage finishes'}</small>
              {working && <span className="agent-progress"><i style={{ width: `${[63, 71, 62, 42][index]}%` }} /></span>}
            </div>;
          })}
        </div>
        <div className={`pipeline-output ${completeRun ? 'output-ready' : ''}`}><small>OUTPUT</small><strong>{completeRun || activeIndex >= 2 ? '6' : '—'}</strong><span>{completeRun || activeIndex >= 2 ? 'flagged' : 'not yet'}</span></div>
      </div>
      <div className="pipeline-caption"><span>Absolute threshold</span><strong>{settings.threshold}%</strong><span>·</span><span>{settings.measure}</span></div>
    </div>
  );
}
