import React, { useState } from 'react';
import { Database, ArrowLeftRight, ChevronDown, ArrowRight } from 'lucide-react';

/**
 * LaneCSetupScreen Component (Matches Image 1)
 * Setup screen with Year-over-year comparison and FX restatement banner
 */
export function LaneCSetupScreen({
  params = {
    baseline: 'GCC 2026',
    comparison: 'GCC 2027',
    comparisonType: 'Year over year',
    measure: 'Total group cost',
    threshold: 10,
  },
  onChangeParams,
  onRun,
}) {
  const [baseline, setBaseline] = useState(params.baseline || 'GCC 2026');
  const [comparison, setComparison] = useState(params.comparison || 'GCC 2027');
  const [comparisonType, setComparisonType] = useState(params.comparisonType || 'Year over year');
  const [measure, setMeasure] = useState(params.measure || 'Total group cost');
  const [threshold, setThreshold] = useState(params.threshold || 10);

  const handleSwap = () => {
    const temp = baseline;
    setBaseline(comparison);
    setComparison(temp);
    if (onChangeParams) {
      onChangeParams({ baseline: comparison, comparison: temp });
    }
  };

  const handleTypeSelect = (type) => {
    setComparisonType(type);
    let newBaseline = baseline;
    let newComparison = comparison;
    if (type === 'Same-year cycles') {
      newBaseline = 'GCC April 2027';
      newComparison = 'GCC May 2027';
      setBaseline(newBaseline);
      setComparison(newComparison);
    } else if (type === 'Year over year') {
      newBaseline = 'GCC 2026';
      newComparison = 'GCC 2027';
      setBaseline(newBaseline);
      setComparison(newComparison);
    }
    if (onChangeParams) {
      onChangeParams({
        comparisonType: type,
        baseline: newBaseline,
        comparison: newComparison,
      });
    }
  };

  const handleMeasureSelect = (m) => {
    setMeasure(m);
    if (onChangeParams) {
      onChangeParams({ measure: m });
    }
  };

  const handleThresholdSelect = (val) => {
    setThreshold(val);
    if (onChangeParams) {
      onChangeParams({ threshold: val });
    }
  };

  const handleSubmit = () => {
    if (onRun) {
      onRun({
        baseline,
        comparison,
        comparisonType,
        measure,
        threshold,
      });
    }
  };

  return (
    <div className="lane-c-setup-card">
      {/* 1. Datasets Section */}
      <div className="lane-c-section-lbl">DATASETS</div>
      <div className="lane-c-datasets-row">
        {/* Baseline Dataset */}
        <div className="lane-c-dataset-card">
          <div className="lane-c-dataset-icon">
            <Database size={16} />
          </div>
          <div className="lane-c-dataset-info">
            <span className="lane-c-dataset-tag">DATASET 1 · BASELINE</span>
            <span className="lane-c-dataset-name">{baseline}</span>
            <span className="lane-c-dataset-desc">
              Final · group cost output · 1,253 combinations
            </span>
          </div>
          <ChevronDown size={16} color="#94a3b8" />
        </div>

        {/* Swap Button */}
        <button
          type="button"
          className="lane-c-swap-btn"
          onClick={handleSwap}
          title="Swap baseline and comparison datasets"
        >
          <ArrowLeftRight size={15} />
        </button>

        {/* Comparison Dataset */}
        <div className="lane-c-dataset-card">
          <div className="lane-c-dataset-icon">
            <Database size={16} />
          </div>
          <div className="lane-c-dataset-info">
            <span className="lane-c-dataset-tag">DATASET 2 · COMPARISON</span>
            <span className="lane-c-dataset-name">{comparison}</span>
            <span className="lane-c-dataset-desc">
              Final · group cost output · 1,244 combinations
            </span>
          </div>
          <ChevronDown size={16} color="#94a3b8" />
        </div>
      </div>

      {/* 2. Comparison Type */}
      <div className="lane-c-section-lbl">COMPARISON TYPE</div>
      <div className="lane-c-types-grid">
        {/* Same-year cycles */}
        <div
          className={`lane-c-type-card ${comparisonType === 'Same-year cycles' ? 'selected' : ''}`}
          onClick={() => handleTypeSelect('Same-year cycles')}
        >
          <span className="lane-c-radio-dot">
            {comparisonType === 'Same-year cycles' && <span className="lane-c-radio-inner" />}
          </span>
          <div className="lane-c-type-content">
            <span className="lane-c-type-title">Same-year cycles</span>
            <span className="lane-c-type-sub">e.g. May vs April 2027</span>
          </div>
        </div>

        {/* Year over year (Selected) */}
        <div
          className={`lane-c-type-card ${comparisonType === 'Year over year' ? 'selected' : ''}`}
          onClick={() => handleTypeSelect('Year over year')}
        >
          <span className="lane-c-radio-dot">
            {comparisonType === 'Year over year' && <span className="lane-c-radio-inner" />}
          </span>
          <div className="lane-c-type-content">
            <span className="lane-c-type-title">Year over year</span>
            <span className="lane-c-type-sub">e.g. 2027 vs 2026</span>
          </div>
        </div>

        {/* Final vs preliminary */}
        <div
          className={`lane-c-type-card ${comparisonType === 'Final vs preliminary' ? 'selected' : ''}`}
          onClick={() => handleTypeSelect('Final vs preliminary')}
        >
          <span className="lane-c-radio-dot">
            {comparisonType === 'Final vs preliminary' && <span className="lane-c-radio-inner" />}
          </span>
          <div className="lane-c-type-content">
            <span className="lane-c-type-title">Final vs preliminary</span>
            <span className="lane-c-type-sub">e.g. final vs prelim May</span>
          </div>
        </div>
      </div>

      {/* 3. FX Restatement Banner (Shown when Year over year is active) */}
      {comparisonType === 'Year over year' && (
        <div className="lane-c-fx-banner">
          <div className="lane-c-fx-icon">
            <ArrowLeftRight size={15} />
          </div>
          <div className="lane-c-fx-text">
            <span className="lane-c-fx-title">FX restatement runs first</span>
            <span className="lane-c-fx-desc">
              {baseline} is restated at the {comparison} FBP FX rates, so currency movement never shows up as a cost variance.
            </span>
          </div>
        </div>
      )}

      {/* 4. Measure & Threshold */}
      <div className="lane-c-measure-grid">
        {/* Measure */}
        <div>
          <div className="lane-c-section-lbl">MEASURE</div>
          <div className="lane-c-measure-toggle" role="radiogroup">
            <button
              type="button"
              className={`lane-c-toggle-btn ${measure === 'Total group cost' ? 'active' : ''}`}
              onClick={() => handleMeasureSelect('Total group cost')}
            >
              Total group cost
            </button>
            <button
              type="button"
              className={`lane-c-toggle-btn ${measure === 'Total legal standard cost' ? 'active' : ''}`}
              onClick={() => handleMeasureSelect('Total legal standard cost')}
            >
              Total legal standard cost
            </button>
          </div>
        </div>

        {/* Flag when cost moves by */}
        <div>
          <div className="lane-c-section-lbl">FLAG WHEN COST MOVES BY</div>
          <div className="lane-c-threshold-row">
            <div className="lane-c-threshold-box">
              <input
                type="number"
                className="lane-c-threshold-input"
                value={threshold}
                onChange={(e) => handleThresholdSelect(Number(e.target.value))}
                min="1"
                max="100"
              />
              <span className="lane-c-threshold-unit">%</span>
            </div>

            <div className="lane-c-threshold-presets">
              {[5, 10, 15].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`lane-c-preset-btn ${threshold === preset ? 'active' : ''}`}
                  onClick={() => handleThresholdSelect(preset)}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>
          <div className="lane-c-threshold-note">
            Absolute change in total cost. You set it; nothing is hard-coded.
          </div>
        </div>
      </div>

      {/* 5. Footer */}
      <div className="lane-c-setup-footer">
        <div className="lane-c-footer-left">
          <div className="lane-c-agent-dots">
            <span className="lane-c-dot-icon blue">▤</span>
            <span className="lane-c-dot-icon amber">⚑</span>
            <span className="lane-c-dot-icon purple">⌘</span>
            <span className="lane-c-dot-icon coral">✧</span>
          </div>
          <div className="lane-c-footer-agent-text">
            <span className="lane-c-footer-agent-title">4 agents will run</span>
            <span className="lane-c-footer-agent-sub">
              Prepare → Flag → Trace drivers → Explain · about 2 min
            </span>
          </div>
        </div>

        <button
          type="button"
          className="lane-c-btn-run"
          onClick={handleSubmit}
        >
          <span>Run comparison</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
