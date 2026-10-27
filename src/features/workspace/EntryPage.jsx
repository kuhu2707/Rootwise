import { ArrowRight, BarChart3, Check, Database, GitBranch, MessageSquareText, Search, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui';

const angles = [
  {
    name: 'GVC Analyst', tag: 'Error detection', icon: Search, tone: 'coral',
    description: 'Catch anomalies and data errors in a GVC cycle before the figures are used.',
  },
  {
    name: 'Cost Analyst', tag: 'Reporting', icon: BarChart3, tone: 'blue',
    description: 'Understand the business drivers behind cost changes, ready for commentary.',
  },
];

export function EntryPage({ angle, onAngleChange, onContinue }) {
  return (
    <div className="page-wrap entry-page">
      <div className="entry-announcement"><span>New</span> AI root-cause analysis for GVC cost variances <ArrowRight size={13} /></div>
      <section className="entry-hero">
        <h1>Every cost change,<br /><span>explained.</span></h1>
        <p>Compare two GVC datasets. Agents flag every root plant / SKU that moved past your threshold and explain why, from actual GVC records.</p>
      </section>
      <section className="angle-choice" aria-labelledby="angle-title">
        <div className="sr-only" id="angle-title">Choose an analyst perspective</div>
        <div className="angle-cards">
          {angles.map(({ name, tag, icon: Icon, tone, description }) => (
            <button key={name} className={`angle-card ${angle === name ? 'angle-selected' : ''}`} onClick={() => onAngleChange(name)} aria-pressed={angle === name}>
              <span className={`angle-icon angle-${tone}`}><Icon size={19} /></span>
              <span className="angle-copy"><span className="angle-title-row"><strong>{name}</strong><small>{tag}</small></span><span className="angle-description">{description}</span></span>
              <span className={`angle-radio ${angle === name ? 'radio-selected' : ''}`}>{angle === name && <Check size={11} />}</span>
            </button>
          ))}
        </div>
        <div className="entry-actions"><Button onClick={onContinue}>Continue as {angle} <ArrowRight size={15} /></Button><span>Switch angle any time · same data, same flagged rows</span></div>
      </section>
      <section className="entry-diagram" aria-label="How Rootwise compares GVC data">
        <div className="diagram-dataset-stack">
          <div className="diagram-node"><span className="diagram-icon dataset-icon"><Database size={16} /></span><span><strong>GCC April 2027</strong><small>Dataset 1 · baseline</small></span></div>
          <div className="diagram-node"><span className="diagram-icon dataset-icon"><Database size={16} /></span><span><strong>GCC May 2027</strong><small>Dataset 2 · comparison</small></span></div>
        </div>
        <div className="diagram-agent"><span><GitBranch size={25} /></span><strong>Rootwise agents</strong><small>Prepare · Flag · Trace · Explain</small></div>
        <div className="diagram-output-stack">
          <div className="diagram-node"><span className="diagram-icon angle-coral"><Search size={16} /></span><span><strong>Diagnostic commentary</strong><small>GVC Analyst · what to check</small></span></div>
          <div className="diagram-node"><span className="diagram-icon angle-blue"><MessageSquareText size={16} /></span><span><strong>Management commentary</strong><small>Cost Analyst · business drivers</small></span></div>
        </div>
        <div className="diagram-caption"><Sparkles size={12} /> One comparison · two analyst angles</div>
      </section>
    </div>
  );
}
