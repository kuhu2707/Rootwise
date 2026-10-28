import React from 'react';

/**
 * CostBridgeChart Component
 * Visualizes the cost movement as a waterfall bridge chart matching the screenshot
 */
export function CostBridgeChart({
  min = 9,
  max = 13,
  steps = [
    { name: 'Cycle 1', subtitle: 'Apr 2027', value: 10.50, type: 'total' },
    { name: 'Material', marker: '2', delta: 0.99, type: 'increase', start: 10.50, end: 11.49 },
    { name: 'Manufacturing', marker: '1', delta: 1.29, type: 'increase', start: 11.49, end: 12.78 },
    { name: 'Logistics', marker: '3', delta: 0.02, type: 'increase', start: 12.78, end: 12.80 },
    { name: 'Cycle 2', subtitle: 'May 2027', value: 12.80, type: 'total' },
  ],
}) {
  const range = max - min;
  const getYPercent = (val) => ((val - min) / range) * 100;

  // Grid tick lines ($9, $10, $11, $12, $13)
  const ticks = [];
  for (let i = max; i >= min; i--) {
    ticks.push(i);
  }

  return (
    <div className="lane-b-bridge-card">
      <div className="lane-b-bridge-header">
        <div className="lane-b-bridge-title-group">
          <h2 className="lane-b-bridge-title">Cost bridge</h2>
          <span className="lane-b-source-tag">From GVC records</span>
        </div>
      </div>

      <div className="lane-b-waterfall-container">
        {/* Y Axis Grid Lines & Labels */}
        <div className="lane-b-waterfall-axis">
          {ticks.map((tick) => (
            <div key={tick} className="lane-b-waterfall-tick">
              <span className="lane-b-tick-label">${tick}</span>
              <span className="lane-b-tick-line" />
            </div>
          ))}
        </div>

        {/* Columns Area */}
        <div className="lane-b-waterfall-cols">
          {steps.map((step, idx) => {
            const isTotal = step.type === 'total';
            const isUp = step.delta >= 0;

            const bottomPct = isTotal
              ? 0
              : getYPercent(Math.min(step.start, step.end));
            const topPct = isTotal
              ? getYPercent(step.value)
              : getYPercent(Math.max(step.start, step.end));
            const heightPct = Math.max(topPct - bottomPct, 2);

            // Calculate connector line to next step if applicable
            const nextStep = steps[idx + 1];
            const hasConnector = !isTotal && nextStep && !nextStep.type.includes('total');
            const connectorBottom = getYPercent(step.end);

            return (
              <div key={step.name + idx} className="lane-b-waterfall-col">
                {/* Value & Bubble on Top */}
                <div
                  className="lane-b-col-top-annotation"
                  style={{ bottom: `${topPct}%` }}
                >
                  {step.marker && (
                    <span className="lane-b-col-bubble">{step.marker}</span>
                  )}
                  <span
                    className={`lane-b-col-val-text ${
                      isTotal ? 'total-text' : isUp ? 'inc-text' : 'dec-text'
                    }`}
                  >
                    {isTotal
                      ? `$${step.value.toFixed(2)}`
                      : `${isUp ? '+' : '−'}$${Math.abs(step.delta).toFixed(2)}`}
                  </span>
                </div>

                {/* The Bar */}
                <div
                  className={`lane-b-waterfall-bar ${
                    isTotal ? 'bar-total' : isUp ? 'bar-inc' : 'bar-dec'
                  }`}
                  style={{
                    bottom: `${bottomPct}%`,
                    height: `${heightPct}%`,
                  }}
                />

                {/* Dotted connector line from Cycle 1 to next step */}
                {idx === 0 && steps[1] && (
                  <div
                    className="lane-b-connector-line"
                    style={{
                      bottom: `${getYPercent(step.value)}%`,
                      left: '50%',
                      width: '100%',
                    }}
                  />
                )}

                {/* Dotted connector lines between floating steps */}
                {hasConnector && (
                  <div
                    className="lane-b-connector-line"
                    style={{
                      bottom: `${connectorBottom}%`,
                      left: '50%',
                      width: '100%',
                    }}
                  />
                )}

                {/* X Axis Labels */}
                <div className="lane-b-col-x-label">
                  <span className="lane-b-col-name">{step.name}</span>
                  {step.subtitle && (
                    <span className="lane-b-col-sub">{step.subtitle}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
