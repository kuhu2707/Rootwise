import React, { useState, useEffect, useMemo } from 'react';
import { Database, Flag, GitFork, MessageSquare, Edit3, Upload } from 'lucide-react';
import { LaneASidebar } from './components/LaneASidebar';
import { LaneATopBar } from './components/LaneATopBar';
import { LaneAMetricCards } from './components/LaneAMetricCards';
import { LaneATable } from './components/LaneATable';
import { ExportOverlayModal } from '../components/ExportOverlayModal';
import { fetchGvcResults, exportGvcCsv } from './api/laneAApi';
import './laneA.css';

export function LaneAResultsPage({
  angle = 'GVC Analyst',
  onAngleChange,
  settings = {
    baseline: 'GCC April 2027',
    comparison: 'GCC May 2027',
    comparisonType: 'Same-year cycles',
    measure: 'Total group cost',
    threshold: 10,
  },
  onAdjustThreshold,
  onSelectRow,
  onNavigate,
  writtenCountInitial = 2,
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [writtenCount, setWrittenCount] = useState(writtenCountInitial);
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Dynamic fetch / computation
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await fetchGvcResults({
          threshold: settings?.threshold || 10,
          measure: settings?.measure || 'Total group cost',
          angle,
          writtenCount,
          query,
          filter,
        });
        if (isMounted) {
          setResultData(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('[LaneAResultsPage] Failed to fetch results:', err);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [settings?.threshold, settings?.measure, angle, writtenCount, query, filter]);

  const handleExport = () => {
    setIsExportOpen(true);
  };

  const handleSelectProductA = () => {
    const productA = resultData?.rows?.find((r) => r.id === 'A-100245') || resultData?.rows?.[0];
    if (productA && onSelectRow) {
      onSelectRow(productA);
    }
  };

  return (
    <div className="lane-a-layout">
      {/* Fixed Left Navigation Sidebar */}
      <LaneASidebar onNavigate={onNavigate} />

      {/* Main Body */}
      <div className="lane-a-main">
        {/* Global Top Bar */}
        <LaneATopBar angle={angle} onAngleChange={onAngleChange} />

        {/* Content Container */}
        <main className="lane-a-content">
          {/* Header Section */}
          <div className="lane-a-header-section">
            <div>
              <div className="lane-a-kicker">RESULTS</div>
              <h1 className="lane-a-title">6 of 1,284 combinations flagged</h1>

              {/* Status and Configuration Pills */}
              <div className="lane-a-status-row">
                {/* 4 Agent Icon Pill */}
                <div className="lane-a-agent-pill">
                  <div className="lane-a-agent-icons">
                    <span className="lane-a-agent-icon-badge blue" title="Prepare Agent">
                      <Database size={11} />
                    </span>
                    <span className="lane-a-agent-icon-badge amber" title="Flag Agent">
                      <Flag size={11} />
                    </span>
                    <span className="lane-a-agent-icon-badge purple" title="Trace Drivers Agent">
                      <GitFork size={11} />
                    </span>
                    <span className="lane-a-agent-icon-badge coral" title="Explain Agent">
                      <MessageSquare size={11} />
                    </span>
                  </div>
                  <span className="lane-a-agent-text">
                    Explain agent still writing · {writtenCount} of 6
                  </span>
                </div>

                {/* Configuration Pills */}
                <span className="lane-a-meta-pill">{settings.comparisonType || 'Same-year cycles'}</span>
                <span className="lane-a-meta-pill">{settings.measure || 'Total group cost'}</span>
                <span className="lane-a-meta-pill">Threshold ≥ {settings.threshold || 10}%</span>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="lane-a-actions">
              <button
                className="lane-a-btn-threshold"
                onClick={onAdjustThreshold || (() => onNavigate && onNavigate('02a'))}
              >
                <Edit3 size={13} /> Threshold ≥ {settings.threshold || 10}%
              </button>

              <button className="lane-a-btn-export" onClick={handleExport}>
                <Upload size={14} /> Export
              </button>
            </div>
          </div>

          {/* 4 Metric Summary Cards */}
          <LaneAMetricCards
            metrics={resultData?.metrics}
            onSelectProductA={handleSelectProductA}
          />

          {/* Flagged Combinations Card with Table */}
          <LaneATable
            rows={resultData?.rows || []}
            counts={resultData?.counts || { all: 6, increases: 4, decreases: 2 }}
            filter={filter}
            onFilterChange={setFilter}
            query={query}
            onQueryChange={setQuery}
            bannerPill={resultData?.status?.bannerPill || `${writtenCount} of 6 written`}
            bannerText={resultData?.status?.bannerText || 'Commentary is still being written. Costs and deltas are final, so you can review them now.'}
            onSelectRow={(row) => onSelectRow && onSelectRow(row)}
          />
        </main>
      </div>

      {/* Export Overlay Modal */}
      <ExportOverlayModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        rows={resultData?.rows || []}
        baseline={settings?.baseline || 'GCC April 2027'}
        comparison={settings?.comparison || 'GCC May 2027'}
        measure={settings?.measure || 'Total group cost'}
        threshold={settings?.threshold || 10}
        initialAngle={angle}
      />
    </div>
  );
}
