import React, { useState } from 'react';
import './laneC.css';
import { LaneCSetupScreen } from './components/LaneCSetupScreen';
import { LaneCRunningScreen } from './components/LaneCRunningScreen';
import { LaneCRunningPipelineScreen } from './components/LaneCRunningPipelineScreen';
import { LaneCFailedScreen } from './components/LaneCFailedScreen';
import { LaneCEmptyResultsScreen } from './components/LaneCEmptyResultsScreen';
import { LANE_C_DEFAULT_PARAMS, laneCApi } from './api/laneCApi';

/**
 * LaneCWorkflowPage Component
 * 
 * Orchestrates complete workflow:
 *   1. Setup (Image 1): Select Same-year cycles or Year-over-year
 *   2. Running:
 *      - If Same-year cycles: Shows active pipeline with step-by-step row execution and
 *        "View 2 ready rows" button (Image 2).
 *      - If Year-over-year: Runs FX restatement, fails at Prepare, and shows failure screen (Image 3 from earlier).
 *   3. Threshold interaction (Empty Results):
 *      - Clicking threshold on view ready rows or pipeline displays
 *        "Nothing moved by 10% or more" (Image 3 with "Re-run at 8%" and "Edit threshold").
 */
export function LaneCWorkflowPage({
  initialStep = 'setup', // 'setup' | 'running' | 'failed' | 'empty_results'
  angle = 'GVC Analyst',
  onAngleChange,
  onNavigate,
}) {
  const [step, setStep] = useState(initialStep);
  const [params, setParams] = useState(LANE_C_DEFAULT_PARAMS);
  const [currentAngle, setCurrentAngle] = useState(angle || 'GVC Analyst');
  const [errorDetails, setErrorDetails] = useState(null);

  const handleAngleSwitch = (newAngle) => {
    setCurrentAngle(newAngle);
    if (onAngleChange) onAngleChange(newAngle);
  };

  // Step 1 -> Step 2
  const handleRunComparison = async (newParams) => {
    const updated = { ...params, ...newParams };
    setParams(updated);
    setStep('running');
    try {
      await laneCApi.startRun(updated);
    } catch (err) {
      console.warn('Backend startRun fallback', err);
    }
  };

  // Triggered only for Year-over-year runs
  const handleFailRun = (error) => {
    setErrorDetails(error);
    setStep('failed');
  };

  // Cancel -> Setup
  const handleCancelRun = async () => {
    try {
      await laneCApi.cancelRun();
    } catch (err) {
      console.warn(err);
    }
    setStep('setup');
  };

  // Retry -> Running
  const handleRetryRun = async () => {
    setStep('running');
    try {
      await laneCApi.retryRun(params);
    } catch (err) {
      console.warn(err);
    }
  };

  // Change datasets -> Setup
  const handleBackToSetup = () => {
    setStep('setup');
  };

  // Re-run at 8% from empty results
  const handleReRunAt8 = () => {
    const updated = { ...params, threshold: 8, comparisonType: 'Same-year cycles', baseline: 'GCC April 2027', comparison: 'GCC May 2027' };
    setParams(updated);
    setStep('running');
  };

  // When "View 2 ready rows" is clicked
  const handleViewReadyRows = () => {
    if (onNavigate) {
      onNavigate('04a');
    }
  };

  // When Threshold is clicked
  const handleThresholdClick = () => {
    setStep('empty_results');
  };

  // 1. If Empty Results screen is active
  if (step === 'empty_results') {
    return (
      <LaneCEmptyResultsScreen
        angle={currentAngle}
        onAngleChange={handleAngleSwitch}
        comparisonText={`${params.baseline} → ${params.comparison}`}
        comparisonType={params.comparisonType}
        measure={params.measure}
        threshold={params.threshold || 10}
        onReRunAt8={handleReRunAt8}
        onEditThreshold={handleBackToSetup}
        onNavigate={onNavigate}
      />
    );
  }

  // 2. If Same-year cycles is running, show the live agent pipeline screen with row-by-row table
  if (step === 'running' && params.comparisonType === 'Same-year cycles') {
    return (
      <LaneCRunningPipelineScreen
        baseline={params.baseline || 'GCC April 2027'}
        comparison={params.comparison || 'GCC May 2027'}
        comparisonType="Same-year cycles"
        measure={params.measure || 'Total group cost'}
        threshold={params.threshold || 10}
        angle={currentAngle}
        onAngleChange={handleAngleSwitch}
        onCancel={handleCancelRun}
        onViewReadyRows={handleViewReadyRows}
        onThresholdClick={handleThresholdClick}
        onNavigate={onNavigate}
      />
    );
  }

  // 3. Setup and Year-over-year error flow
  return (
    <div className="lane-b-layout">
      {/* Sidebar */}
      <aside className="lane-b-sidebar" aria-label="Main Navigation">
        <button
          type="button"
          className="lane-b-sidebar-logo"
          onClick={() => onNavigate && onNavigate('01')}
          title="Rootwise Workspace"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h16" />
            <path d="M8 20V10c0-2.2 1.8-4 4-4s4 1.8 4 4v10" />
            <path d="M12 6V2" />
          </svg>
        </button>

        <nav className="lane-b-sidebar-nav">
          <button
            type="button"
            className="lane-b-nav-item"
            onClick={() => onNavigate && onNavigate('01')}
            title="Start"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          </button>

          <button
            type="button"
            className={`lane-b-nav-item ${step === 'setup' ? 'active' : ''}`}
            onClick={handleBackToSetup}
            title="New comparison"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>

          <button
            type="button"
            className={`lane-b-nav-item ${step !== 'setup' ? 'active' : ''}`}
            onClick={() => setStep('running')}
            title="Agent run"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" /><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" /><path d="M12 12v3" /></svg>
          </button>

          <button
            type="button"
            className="lane-b-nav-item"
            onClick={() => onNavigate && onNavigate('results')}
            title="Results"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" /></svg>
          </button>
        </nav>

        <div className="lane-b-sidebar-bottom">
          <button type="button" className="lane-b-nav-item" title="Settings">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="lane-c-page" style={{ flex: 1, minWidth: 0 }}>
        {/* Topbar */}
        <header className="lane-b-topbar">
          <nav className="lane-b-breadcrumbs" aria-label="Breadcrumb">
            <span className="lane-b-breadcrumb-item">Comparisons</span>
            <span className="lane-b-breadcrumb-sep">/</span>
            <span className="lane-b-breadcrumb-current">
              {step === 'setup' ? 'New comparison' : `${params.baseline} → ${params.comparison}`}
            </span>
          </nav>

          <div className="lane-b-topbar-right">
            <div className="lane-b-sync-pill">
              <span className="lane-b-sync-dot" />
              <span>SAP BDC · GVC outputs synced 09:12</span>
            </div>

            <div className="lane-b-analyst-switch" role="radiogroup">
              <span className="lane-b-analyst-label">Viewing as</span>
              <button
                type="button"
                className={`lane-b-analyst-btn ${currentAngle === 'GVC Analyst' ? 'active' : ''}`}
                onClick={() => handleAngleSwitch('GVC Analyst')}
              >
                <span className="lane-b-analyst-dot" style={{ backgroundColor: '#dc2626' }} />
                <span>GVC Analyst</span>
              </button>
              <button
                type="button"
                className={`lane-b-analyst-btn ${currentAngle === 'Cost Analyst' ? 'active' : ''}`}
                onClick={() => handleAngleSwitch('Cost Analyst')}
              >
                <span className="lane-b-analyst-dot lane-b-analyst-dot-blue" />
                <span>Cost Analyst</span>
              </button>
            </div>

            <div className="lane-b-user-avatar" title="Signed in as GVC Analyst (GA)">
              {currentAngle === 'Cost Analyst' ? 'CA' : 'GA'}
            </div>
          </div>
        </header>

        {/* Lane C Workspace Container */}
        <div className="lane-c-container">
          {/* Screen 1: Setup */}
          {step === 'setup' && (
            <>
              <div className="lane-c-header-block">
                <div className="lane-c-kicker">NEW COMPARISON</div>
                <h1 className="lane-c-title">What do you want to compare?</h1>
                <p className="lane-c-subtitle">
                  Pick two GVC output datasets and how far a cost must move to be flagged.
                </p>
              </div>

              <LaneCSetupScreen
                params={params}
                onChangeParams={(newP) => setParams((prev) => ({ ...prev, ...newP }))}
                onRun={handleRunComparison}
              />
            </>
          )}

          {/* Screen 2: Running (Year over year with FX restatement) */}
          {step === 'running' && (
            <LaneCRunningScreen
              params={params}
              onCancel={handleCancelRun}
              onFail={handleFailRun}
              onComplete={(target) => {
                if (onNavigate) {
                  onNavigate(target || (currentAngle === 'GVC Analyst' ? '04a' : '04b'));
                }
              }}
            />
          )}

          {/* Screen 3: Failed at Prepare */}
          {step === 'failed' && (
            <LaneCFailedScreen
              params={params}
              duration={errorDetails?.failedDuration || '34 s'}
              errorMessage={errorDetails?.errorMessage || '2027 FBP FX rates not found in BDC'}
              onChangeDatasets={handleBackToSetup}
              onRetry={handleRetryRun}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default LaneCWorkflowPage;
