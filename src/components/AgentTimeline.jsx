import { Check } from 'lucide-react';

export function DatabaseIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="8" ry="2.7" />
      <path d="M4 5v14c0 1.5 3.6 2.7 8 2.7s8-1.2 8-2.7V5" />
      <path d="M4 12c0 1.5 3.6 2.7 8 2.7s8-1.2 8-2.7" />
    </svg>
  );
}

export function FlagIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22V4" />
      <path d="M4 4h13c1.1 0 1.7.8 1.3 1.7L16.8 9.5 18.3 13.3c.4.9-.2 1.7-1.3 1.7H4" />
    </svg>
  );
}

export function TraceDriversIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4.8" r="2.2" />
      <line x1="12" y1="7" x2="12" y2="11.5" />
      <line x1="5.5" y1="11.5" x2="18.5" y2="11.5" />
      <line x1="5.5" y1="11.5" x2="5.5" y2="15.8" />
      <line x1="12" y1="11.5" x2="12" y2="15.8" />
      <line x1="18.5" y1="11.5" x2="18.5" y2="15.8" />
      <circle cx="5.5" cy="18" r="2.2" />
      <circle cx="12" cy="18" r="2.2" />
      <circle cx="18.5" cy="18" r="2.2" />
    </svg>
  );
}

export function ExplainIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 4H5C3.9 4 3 4.9 3 6v8.5C3 15.6 3.9 16.5 5 16.5h2v3.5l4-3.5h8c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
      <path
        d="M12 7.2c0 1.6.9 2.5 2.5 2.5-1.6 0-2.5.9-2.5 2.5 0-1.6-.9-2.5-2.5-2.5 1.6 0 2.5-.9 2.5-2.5z"
        fill={color}
        stroke="none"
      />
    </svg>
  );
}

function ClockIcon({ size = 11, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}

const agentDefs = [
  {
    id: 'prepare',
    label: 'Prepare',
    workingText: 'Matching pairs',
    workingDetail: '812 of 1,298 pairs matched',
    waitingDetail: 'Ready to match datasets',
    doneDetail: '1,284 pairs matched',
    gradient: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
    activeColor: 'rgba(51, 102, 255, 1)',
    activeShadow: '0 10px 28px rgba(51, 102, 255, 0.28)',
    activeRingBorder: 'rgba(51, 102, 255, 0.42)',
    activeRingOuter: 'rgba(51, 102, 255, 0.22)',
    activeRingBg: 'transparent',
    progressColor: 'rgba(51, 102, 255, 1)',
    progressWidth: '64%',
    icon: DatabaseIcon,
  },
  {
    id: 'flag',
    label: 'Flag',
    workingText: 'Comparing totals',
    workingDetail: '903 of 1,284 compared',
    waitingDetail: 'Starts when pairs are matched',
    doneDetail: '6 of 1,284 above 10%',
    gradient: 'linear-gradient(180deg, #fba81f 0%, #e27d00 100%)',
    activeColor: 'rgba(240, 138, 0, 1)',
    activeShadow: '0 10px 28px rgba(240, 138, 0, 0.28)',
    activeRingBorder: 'rgba(240, 138, 0, 0.45)',
    activeRingOuter: 'rgba(240, 138, 0, 0.22)',
    activeRingBg: 'rgba(255, 244, 224, 0.35)',
    progressColor: 'rgba(240, 138, 0, 1)',
    progressWidth: '70%',
    icon: FlagIcon,
  },
  {
    id: 'trace',
    label: 'Trace drivers',
    workingText: 'Tracing · 1 of 6',
    workingDetail: 'Product A: cost components and flow nodes',
    waitingDetail: 'Starts when rows are flagged',
    doneDetail: '6 traced · 9 drivers found',
    gradient: 'linear-gradient(180deg, #a855f7 0%, #7c3aed 100%)',
    activeColor: 'rgba(124, 58, 237, 1)',
    activeShadow: '0 10px 28px rgba(124, 58, 237, 0.28)',
    activeRingBorder: 'rgba(124, 58, 237, 0.45)',
    activeRingOuter: 'rgba(124, 58, 237, 0.22)',
    activeRingBg: 'rgba(243, 232, 255, 0.35)',
    progressColor: 'rgba(124, 58, 237, 1)',
    progressWidth: '25%',
    icon: TraceDriversIcon,
  },
  {
    id: 'explain',
    label: 'Explain',
    workingText: 'Writing commentary',
    workingDetail: 'Creating concise explanations',
    waitingDetail: 'Starts as each row is traced',
    doneDetail: '6 of 6 explained',
    gradient: 'linear-gradient(180deg, #fca5a5 0%, #f87171 100%)',
    activeColor: 'rgba(239, 68, 68, 1)',
    activeShadow: '0 10px 28px rgba(239, 68, 68, 0.25)',
    activeRingBorder: 'rgba(239, 68, 68, 0.45)',
    activeRingOuter: 'rgba(239, 68, 68, 0.22)',
    activeRingBg: 'rgba(254, 226, 226, 0.35)',
    progressColor: 'rgba(239, 68, 68, 1)',
    progressWidth: '40%',
    icon: ExplainIcon,
  },
];

const stageIndex = { '03a.1': 0, '03a.2': 1, '03a.3': 2, '03a.4': 3, '03a.5': 4 };

const stageSubtitles = {
  '03a.1': 'Agent 1 is matching root plant / SKU pairs .',
  '03a.2': (threshold) => `Agent 2 is comparing BOM level 1 totals against ${threshold || 10}% .`,
  '03a.3': 'Agent 3 is walking the detail rows for each flagged row .',
  '03a.4': 'Agent 4 is generating variance root-cause commentary .',
  '03a.5': 'All agent tasks completed successfully.',
};

export function AgentTimeline({ screen, settings }) {
  const activeIndex = stageIndex[screen] ?? 0;
  const completeRun = screen === '03a.5';

  const subFn = stageSubtitles[screen] || stageSubtitles['03a.1'];
  const pipelineSub = typeof subFn === 'function' ? subFn(settings.threshold) : subFn;

  return (
    <div className="pipeline-card">
      <div className="pipeline-heading">
        <div className="pipeline-title-group">
          <strong>Agent pipeline</strong>
          <span className="pipeline-title-sub">{pipelineSub}</span>
        </div>
        <div className="pipeline-legend">
          <span><i className="legend-done" /> Complete</span>
          <span><i className="legend-working" /> Working</span>
          <span><i className="legend-waiting" /> Waiting</span>
        </div>
      </div>

      <div className="pipeline-flow">
        {/* Left: Dataset stack */}
        <div className="dataset-stack">
          <div className="dataset-node">
            <span className="dataset-icon"><DatabaseIcon size={16} color="#ffffff" /></span>
            <span className="dataset-node-text">
              <strong>{settings.baseline}</strong>
              <small>Baseline</small>
            </span>
          </div>
          <div className="dataset-node">
            <span className="dataset-icon"><DatabaseIcon size={16} color="#ffffff" /></span>
            <span className="dataset-node-text">
              <strong>{settings.comparison}</strong>
              <small>Comparison</small>
            </span>
          </div>
        </div>

        {/* Curved connectors from Datasets to Prepare */}
        <div className="pipeline-curve-connector">
          <svg width="64" height="122" viewBox="0 0 64 122" fill="none">
            <path d="M 0 26 C 36 26, 32 61, 64 61" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 0 96 C 36 96, 32 61, 64 61" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* 4 Agent Steps with Intermediary Connectors */}
        {agentDefs.map((agent, index) => {
          const done = completeRun || index < activeIndex;
          const working = !completeRun && index === activeIndex;
          const waiting = !done && !working;
          const IconComponent = agent.icon;

          return (
            <div key={agent.id} className="pipeline-agent-step-group">
              <div className={`pipeline-agent-col ${working ? 'agent-working' : ''} ${done ? 'agent-done' : ''} ${waiting ? 'agent-waiting' : ''}`}>
                <div className="agent-tile-anchor">
                  {/* Concentric rings */}
                  {working && (
                    <>
                      <div
                        className="agent-ring-outer"
                        style={{ borderColor: agent.activeRingOuter }}
                      />
                      <div
                        className="agent-ring-inner"
                        style={{
                          borderColor: agent.activeRingBorder,
                          backgroundColor: agent.activeRingBg,
                        }}
                      />
                    </>
                  )}
                  {!working && <div className="agent-ring-idle" />}

                  {/* Done check badge at top-right */}
                  {done && (
                    <div className="agent-check-badge">
                      <Check size={12} strokeWidth={3} color="#ffffff" />
                    </div>
                  )}

                  {/* 92x92 squircle card */}
                  <div
                    className={`agent-squircle-card ${working ? 'active-squircle' : ''} ${done ? 'done-squircle' : ''}`}
                    style={
                      working
                        ? {
                            border: `2px solid ${agent.activeColor}`,
                            boxShadow: agent.activeShadow,
                          }
                        : done
                        ? {
                            border: `2px solid ${agent.activeColor}`,
                            boxShadow: '0 2px 10px rgba(20, 20, 43, 0.04)',
                          }
                        : {}
                    }
                  >
                    <div className="agent-squircle-inner" style={{ background: agent.gradient }}>
                      <IconComponent size={25} color="#ffffff" />
                    </div>
                  </div>
                </div>

                {/* Agent info below */}
                <div className="agent-info-block">
                  <strong className="agent-col-name">{agent.label}</strong>
                  <span className={`agent-status-pill ${done ? 'pill-done' : working ? 'pill-working' : 'pill-waiting'}`}>
                    {done ? (
                      <><Check size={11} strokeWidth={2.5} /> Done</>
                    ) : working ? (
                      <><i className="pill-pulse-dot" /> {agent.workingText}</>
                    ) : (
                      <><ClockIcon size={11} /> Waiting</>
                    )}
                  </span>
                  <span className="agent-col-subtitle">
                    {done ? agent.doneDetail : working ? agent.workingDetail : agent.waitingDetail}
                  </span>
                  {working && (
                    <div className="agent-progress-line">
                      <div
                        className="agent-progress-fill"
                        style={{ width: agent.progressWidth, backgroundColor: agent.progressColor }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Connector leading to next agent (or to output) */}
              <div className="pipeline-arrow-connector">
                <svg width="56" height="122" viewBox="0 0 56 122" fill="none">
                  {/* Completed pipeline segment: solid blue line */}
                  {index < activeIndex ? (
                    <line x1="0" y1="61" x2="56" y2="61" stroke="rgba(51, 102, 255, 1)" strokeWidth="1.5" />
                  ) : index === activeIndex ? (
                    /* Active step connector leading to next: red dashed line with arrowhead */
                    <>
                      <line x1="0" y1="61" x2="47" y2="61" stroke="#e21700" strokeWidth="1.5" strokeDasharray="4 4" />
                      <polygon points="46,57.5 53,61 46,64.5" fill="#e21700" />
                    </>
                  ) : (
                    /* Waiting connector: grey dashed line with arrowhead */
                    <>
                      <line x1="0" y1="61" x2="47" y2="61" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
                      <polygon points="46,57.5 53,61 46,64.5" fill="#cbd5e1" />
                    </>
                  )}
                </svg>
              </div>
            </div>
          );
        })}

        {/* OUTPUT Node */}
        <div className="pipeline-output-col">
          <div className="agent-tile-anchor">
            {activeIndex >= 2 ? (
              <div className="output-card-box output-card-active">
                <span className="output-tag">OUTPUT</span>
                <strong className="output-count-num">6</strong>
                <span className="output-count-label">flagged</span>
              </div>
            ) : (
              <div className="output-card-box">
                <span className="output-tag">OUTPUT</span>
                <div className="output-dash-bar" />
                <span className="output-status-text">not yet</span>
              </div>
            )}
          </div>
          <div className="agent-info-block output-spacer" />
        </div>
      </div>
    </div>
  );
}
