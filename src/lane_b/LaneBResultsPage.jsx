import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './laneB.css';
import { LaneBSidebar } from './components/LaneBSidebar';
import { LaneBTopBar } from './components/LaneBTopBar';
import { LaneBFilterBar } from './components/LaneBFilterBar';
import { LaneBMetricCards } from './components/LaneBMetricCards';
import { LaneBTable } from './components/LaneBTable';
import { LaneBDetailPage } from './LaneBDetailPage';
import { ExportOverlayModal } from '../components/ExportOverlayModal';
import { laneBApi, computeSummaryMetrics, DEFAULT_LANE_B_DATA } from './api/laneBApi';

/**
 * LaneBResultsPage Component
 * 
 * Implements the Cost Analyst (Lane B) results page view.
 * Uses the exact colors, gradients, icons, and 'Johnson Display' typography.
 * Completely dynamic and pre-fitted for backend integration.
 */
export function LaneBResultsPage({
  angle = 'Cost Analyst',
  onAngleChange,
  settings: initialSettings = {
    baseline: 'GCC April 2027',
    comparison: 'GCC May 2027',
    comparisonType: 'Same-year cycles',
    measure: 'Total group cost',
    threshold: 10,
  },
  onAdjustThreshold,
  onSelectRow: externalSelectRow,
  onNavigate,
  embed = false,
}) {
  const [viewMode, setViewMode] = useState('results'); // 'results' | 'detail'
  const [settings, setSettings] = useState(initialSettings);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Increases' | 'Decreases'
  const [selectedRowId, setSelectedRowId] = useState('A-100245');
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [tempThreshold, setTempThreshold] = useState(settings.threshold || 10);
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Sync settings when initialSettings changes from parent
  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
      setTempThreshold(initialSettings.threshold || 10);
    }
  }, [initialSettings]);

  // Fetch or dynamically compute rows from API service
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await laneBApi.getResults({
        threshold: settings.threshold,
        measure: settings.measure,
        query: searchQuery,
        filter: activeFilter,
      });
      if (response?.data) {
        setApiData(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch Lane B data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [settings.threshold, settings.measure, searchQuery, activeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered rows
  const rows = useMemo(() => {
    return apiData?.rows || DEFAULT_LANE_B_DATA;
  }, [apiData]);

  // Counts for tabs
  const counts = useMemo(() => {
    const allMatchingThreshold = DEFAULT_LANE_B_DATA.filter(
      (r) => Math.abs(r.deltaPercent) >= settings.threshold
    );
    const increases = allMatchingThreshold.filter((r) => r.delta > 0).length;
    const decreases = allMatchingThreshold.filter((r) => r.delta < 0).length;
    return {
      all: allMatchingThreshold.length,
      increases,
      decreases,
    };
  }, [settings.threshold]);

  // Dynamic summary metrics
  const summaryMetrics = useMemo(() => {
    if (apiData?.metrics) return apiData.metrics;
    return computeSummaryMetrics(rows, 1284);
  }, [apiData, rows]);

  // Handle row selection
  const handleSelectRow = (row) => {
    setSelectedRowId(row.id);
    if (externalSelectRow) {
      externalSelectRow(row);
    } else {
      setViewMode('detail');
    }
  };

  // Handle Export Overlay Modal
  const handleExport = () => {
    setIsExportOpen(true);
  };

  // Handle Threshold Adjustment
  const handleThresholdSubmit = (e) => {
    e?.preventDefault();
    const val = Number(tempThreshold) || 10;
    setSettings((prev) => ({ ...prev, threshold: val }));
    setIsEditingThreshold(false);
    if (onAdjustThreshold) {
      onAdjustThreshold(val);
    }
  };

  const content = (
    <div className="lane-b-container">
      {/* 1. Header Section */}
      <section className="lane-b-header-section">
        <div className="lane-b-kicker">Results</div>
        <h1 className="lane-b-main-title">
          {summaryMetrics.flaggedCount} of {summaryMetrics.totalCompared.toLocaleString()} combinations flagged
        </h1>

        {/* Filter Pills & Action Buttons */}
        <LaneBFilterBar
          comparisonType={settings.comparisonType}
          measure={settings.measure}
          threshold={settings.threshold}
          onAdjustThreshold={() => setIsEditingThreshold((prev) => !prev)}
          onExport={handleExport}
        />

        {/* Quick Threshold Adjuster Popover */}
        {isEditingThreshold && (
          <form
            onSubmit={handleThresholdSubmit}
            style={{
              marginTop: '12px',
              padding: '12px 16px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
              Filter Threshold (%):
            </span>
            <input
              type="number"
              min="1"
              max="100"
              value={tempThreshold}
              onChange={(e) => setTempThreshold(e.target.value)}
              style={{
                width: '60px',
                padding: '6px 8px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13px',
                textAlign: 'center',
              }}
            />
            <button
              type="submit"
              style={{
                background: '#12141a',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => setIsEditingThreshold(false)}
              style={{
                background: 'transparent',
                color: '#64748b',
                border: 'none',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </form>
        )}
      </section>

      {/* 2. Key Metrics 4-Card Grid */}
      <LaneBMetricCards
        metrics={summaryMetrics}
        onSelectMover={(mover) => {
          const match = rows.find((r) => r.product === mover.product);
          if (match) handleSelectRow(match);
        }}
      />

      {/* 3. Flagged Combinations Table Card */}
      <LaneBTable
        rows={rows}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRowId={selectedRowId}
        onSelectRow={handleSelectRow}
      />
    </div>
  );

  if (viewMode === 'detail') {
    return (
      <LaneBDetailPage
        productId={selectedRowId}
        rows={rows}
        angle={angle}
        onAngleChange={onAngleChange}
        onBack={() => setViewMode('results')}
        onNavigate={onNavigate}
        onSelectRow={(r) => setSelectedRowId(r.id)}
        settings={settings}
      />
    );
  }

  // If embedded within an existing outer shell
  if (embed) {
    return <div className="lane-b-page">{content}</div>;
  }

  // Full page layout with Sidebar and TopBar
  return (
    <div className="lane-b-layout">
      <LaneBSidebar activeItem="results" onNavigate={onNavigate} />
      <div className="lane-b-page" style={{ flex: 1, minWidth: 0 }}>
        <LaneBTopBar
          baseline={settings.baseline}
          comparison={settings.comparison}
          activeAngle={angle}
          onAngleChange={onAngleChange}
        />
        {content}
      </div>

      {/* Export Overlay Modal */}
      <ExportOverlayModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        rows={rows}
        baseline={settings.baseline}
        comparison={settings.comparison}
        measure={settings.measure}
        threshold={settings.threshold}
        initialAngle={angle}
      />
    </div>
  );
}

export default LaneBResultsPage;
