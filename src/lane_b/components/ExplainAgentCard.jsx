import React from 'react';
import { Bot } from 'lucide-react';

/**
 * ExplainAgentCard Component
 * Dark hero card displaying AI variance management quote and key drivers
 */
export function ExplainAgentCard({
  quote = '“Product A cost rose 22% this cycle. Higher manufacturing cost and a 35% rise in API cost, from supplier price changes and tighter supply, account for almost all of it.”',
  keyDriversShare = '99% OF THE INCREASE',
  keyDrivers = [
    { marker: '1', tone: 'red', title: 'Manufacturing', subtitle: 'conversion', delta: 1.29 },
    { marker: '2', tone: 'red', title: 'Material', subtitle: 'API price', delta: 0.99 },
    { marker: '3', tone: 'grey', title: 'Logistics', subtitle: 'minor', delta: 0.02 },
  ],
}) {
  return (
    <div className="lane-b-explain-card">
      {/* Top Badges */}
      <div className="lane-b-explain-top">
        <span className="lane-b-explain-agent-pill">
          <span className="lane-b-agent-icon-chat">
            <Bot size={13} />
          </span>
          <span>Explain agent · AI-written from GVC records</span>
        </span>
        <span className="lane-b-management-pill">Management</span>
      </div>

      {/* Main Quote */}
      <blockquote className="lane-b-explain-quote">{quote}</blockquote>

      {/* Key Drivers Section */}
      <div className="lane-b-drivers-section">
        <div className="lane-b-drivers-kicker">
          KEY DRIVERS · {keyDriversShare}
        </div>
        <div className="lane-b-drivers-grid">
          {keyDrivers.map((driver, index) => {
            const isUp = driver.delta >= 0;
            const formattedDelta = `${isUp ? '+' : '−'}$${Math.abs(driver.delta).toFixed(2)}`;

            return (
              <div key={driver.title + index} className="lane-b-driver-card">
                <div className="lane-b-driver-header">
                  <span
                    className={`lane-b-driver-bubble ${
                      driver.tone === 'red' ? 'bubble-red' : 'bubble-grey'
                    }`}
                  >
                    {driver.marker || index + 1}
                  </span>
                  <span className="lane-b-driver-title">{driver.title}</span>
                  <span className="lane-b-driver-sub">{driver.subtitle}</span>
                </div>
                <div
                  className={`lane-b-driver-value ${
                    driver.tone === 'red' ? 'val-coral' : 'val-light'
                  }`}
                >
                  {formattedDelta}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
