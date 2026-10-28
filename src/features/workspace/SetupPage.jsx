import { ArrowRight, Check, ChevronDown, Database, Info } from 'lucide-react';
import { datasetOptions, comparisonTypes, measures } from '../../data/mockResults';
import { Button } from '../../components/ui';

export function SetupPage({ settings, onSettingsChange, onRun }) {
  const change = (key, value) => onSettingsChange({ [key]: value });
  const chooseComparisonType = (type) => {
    const datasets = type === 'Year over year'
      ? { baseline: 'GCC April 2026', comparison: 'GCC April 2027' }
      : type === 'Final vs preliminary'
        ? { baseline: 'GCC May 2027 · Preliminary', comparison: 'GCC May 2027' }
        : { baseline: 'GCC April 2027', comparison: 'GCC May 2027' };
    onSettingsChange({ comparisonType: type, ...datasets });
  };
  const validDatasets = settings.baseline !== settings.comparison;

  return (
    <div className="page-wrap setup-page">
      <div className="page-title-block">
        <h1>What do you want to compare?</h1>
        <p>Pick two GVC output datasets and how far a cost must move to be flagged.</p>
      </div>
      <section className="setup-card">
        <div className="setup-section-label">DATASETS</div>
        <div className="dataset-selectors">
          <label className="dataset-select-card"><span className="dataset-select-icon"><Database size={17} /></span><span className="dataset-select-copy"><small>DATASET 1 · BASELINE</small><strong>{settings.baseline}</strong><span>Final · group cost output · 1,298 combinations</span></span><ChevronDown size={15} /><select aria-label="Baseline dataset" value={settings.baseline} onChange={(event) => change('baseline', event.target.value)}>{datasetOptions.filter((item) => item !== settings.comparison).map((item) => <option key={item}>{item}</option>)}</select></label>
          <span className="dataset-swap" aria-hidden="true">↕</span>
          <label className="dataset-select-card"><span className="dataset-select-icon"><Database size={17} /></span><span className="dataset-select-copy"><small>DATASET 2 · COMPARISON</small><strong>{settings.comparison}</strong><span>Final · group cost output · 1,302 combinations</span></span><ChevronDown size={15} /><select aria-label="Comparison dataset" value={settings.comparison} onChange={(event) => change('comparison', event.target.value)}>{datasetOptions.filter((item) => item !== settings.baseline).map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>
        {!validDatasets && <div className="validation-note"><Check size={13} /> Select two different datasets to continue.</div>}
        <div className="setup-divider" />
        <div className="setup-section-label">COMPARISON TYPE</div>
        <div className="comparison-type-options">{comparisonTypes.map((type, index) => <button key={type} className={`comparison-type ${settings.comparisonType === type ? 'comparison-type-active' : ''}`} onClick={() => chooseComparisonType(type)}><span className="type-radio">{settings.comparisonType === type && <i />}</span><span><strong>{type}</strong><small>{['e.g. May vs April 2027', 'e.g. 2027 vs 2026', 'e.g. final vs prelim May'][index]}</small></span></button>)}</div>
        <div className="setup-control-row">
          <div className="measure-control"><div className="setup-section-label">MEASURE</div><div className="segmented-control">{measures.map((measure) => <button key={measure} className={settings.measure === measure ? 'segment-active' : ''} onClick={() => change('measure', measure)}>{measure}</button>)}</div></div>
          <div className="threshold-control"><div className="setup-section-label">FLAG WHEN COST MOVES BY</div><div className="threshold-input-row"><label><input type="number" min="0" max="100" value={settings.threshold} onChange={(event) => change('threshold', Math.max(0, Math.min(100, Number(event.target.value))))} aria-label="Variance threshold percent" /><span>%</span></label><div className="threshold-presets">{[5, 10, 15].map((value) => <button key={value} className={settings.threshold === value ? 'preset-active' : ''} onClick={() => change('threshold', value)}>{value}%</button>)}</div></div><small className="threshold-help"><Info size={12} /> Absolute change in total cost. You set it; nothing is hard-coded.</small></div>
        </div>
        <div className="setup-footer"><div className="agent-preview"><span className="agent-mini agent-mini-blue"><Database size={14} /></span><span className="agent-mini agent-mini-amber">⚑</span><span className="agent-mini agent-mini-violet">⌘</span><span className="agent-mini agent-mini-coral">✧</span><span className="agent-preview-copy"><strong>4 agents will run</strong><small>Prepare → Flag → Trace drivers → Explain · about 2 min</small></span></div><Button onClick={onRun} disabled={!validDatasets}>Run comparison <ArrowRight size={15} /></Button></div>
      </section>
    </div>
  );
}


