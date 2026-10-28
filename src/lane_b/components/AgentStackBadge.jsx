import React from 'react';
import { Database, Bot, Shield, FileSpreadsheet } from 'lucide-react';

/**
 * AgentStackBadge Component
 * Shows the 4 agent status icons and completion time
 */
export function AgentStackBadge({ completedTime = '09:16', count = 4 }) {
  return (
    <div className="lane-b-agents-pill" title={`${count} automated agents finished analysis at ${completedTime}`}>
      <div className="lane-b-agent-stack">
        <span className="lane-b-agent-icon sap" title="Agent 1: SAP BDC Sync">
          <Database size={11} strokeWidth={2.5} />
        </span>
        <span className="lane-b-agent-icon pbi" title="Agent 2: Planning & Aggregation">
          <FileSpreadsheet size={11} strokeWidth={2.5} />
        </span>
        <span className="lane-b-agent-icon bot" title="Agent 3: AI Variance Agent">
          <Bot size={11} strokeWidth={2.5} />
        </span>
        <span className="lane-b-agent-icon sec" title="Agent 4: Policy & Reconciliation">
          <Shield size={11} strokeWidth={2.5} />
        </span>
      </div>
      <span>{count} agents · completed {completedTime}</span>
    </div>
  );
}
