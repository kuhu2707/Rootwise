import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import './laneB.css';
import { LaneBSidebar } from './components/LaneBSidebar';
import { LaneBTopBar } from './components/LaneBTopBar';
import { ExplainAgentCard } from './components/ExplainAgentCard';
import { CostSummaryCard } from './components/CostSummaryCard';
import { CostBridgeChart } from './components/CostBridgeChart';
import { BreakdownTable } from './components/BreakdownTable';
import { laneBApi, DEFAULT_LANE_B_DATA, buildProductDetail } from './api/laneBApi';

/**
 * LaneBDetailPage Component
 * Renders the Cost Analyst Variance Detail page for Product A (and any selected product)
 * matching the screenshot exactly.
 */
export function LaneBDetailPage({
  productId = 'A-100245',
  row: initialRow,
  rows: initialRows,
  settings: initialSettings = {
    baseline: 'GCC April 2027',
    comparison: 'GCC May 2027',
    comparisonType: 'Same-year cycles',
    measure: 'Total group cost',
    threshold: 10,
  },
  angle = 'Cost Analyst',
  onAngleChange,
  onBack,
  onSelectRow,
  onNavigate,
}) {
  const [currentId, setCurrentId] = useState(productId);
  const [detailData, setDetailData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync currentId when prop changes
  useEffect(() => {
    if (productId && productId !== currentId) {
      setCurrentId(productId);
    }
  }, [productId]);

  const rows = useMemo(() => {
    return initialRows && initialRows.length > 0
      ? initialRows
      : DEFAULT_LANE_B_DATA;
  }, [initialRows]);

  const currentIndex = rows.findIndex((r) => r.id === currentId);
  const activeIndex = currentIndex !== -1 ? currentIndex : 0;
  const currentRow = rows[activeIndex] || DEFAULT_LANE_B_DATA[0];

  const prevRow = activeIndex > 0 ? rows[activeIndex - 1] : null;
  const nextRow = activeIndex < rows.length - 1 ? rows[activeIndex + 1] : null;

  // Fetch or construct dynamic product detail
  useEffect(() => {
    let isMounted = true;
    async function loadDetail() {
      setIsLoading(true);
      try {
        const response = await laneBApi.getProductDetail(currentId);
        if (isMounted && response?.data) {
          setDetailData(response.data);
        }
      } catch (err) {
        console.warn('Failed to fetch detail, generating dynamic structure', err);
        if (isMounted) {
          setDetailData(buildProductDetail(currentRow));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadDetail();
    return () => {
      isMounted = false;
    };
  }, [currentId, currentRow]);

  const data = detailData || buildProductDetail(currentRow);

  const handlePrev = () => {
    if (prevRow) {
      setCurrentId(prevRow.id);
      if (onSelectRow) onSelectRow(prevRow);
    }
  };

  const handleNext = () => {
    if (nextRow) {
      setCurrentId(nextRow.id);
      if (onSelectRow) onSelectRow(nextRow);
    }
  };

  const isUp = data.direction === 'up' || data.delta >= 0;

  return (
    <div className="lane-b-layout">
      {/* Sidebar rail */}
      <LaneBSidebar activeItem="results" onNavigate={onNavigate} />

      <div className="lane-b-page" style={{ flex: 1, minWidth: 0 }}>
        {/* Top bar with Breadcrumbs */}
        <header className="lane-b-topbar">
          <nav className="lane-b-breadcrumbs" aria-label="Breadcrumb">
            <span className="lane-b-breadcrumb-item">Comparisons</span>
            <span className="lane-b-breadcrumb-sep">/</span>
            <span className="lane-b-breadcrumb-item">GCC April → May 2027</span>
            <span className="lane-b-breadcrumb-sep">/</span>
            <button
              type="button"
              onClick={onBack}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                font: 'inherit',
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              Results
            </button>
            <span className="lane-b-breadcrumb-sep">/</span>
            <span className="lane-b-breadcrumb-current">{data.product}</span>
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
                className={`lane-b-analyst-btn ${angle === 'GVC Analyst' ? 'active' : ''}`}
                onClick={() => onAngleChange && onAngleChange('GVC Analyst')}
              >
                <span className="lane-b-analyst-dot" />
                <span>GVC Analyst</span>
              </button>
              <button
                type="button"
                className={`lane-b-analyst-btn ${angle === 'Cost Analyst' ? 'active' : ''}`}
                onClick={() => onAngleChange && onAngleChange('Cost Analyst')}
              >
                <span className="lane-b-analyst-dot lane-b-analyst-dot-blue" />
                <span>Cost Analyst</span>
              </button>
            </div>

            <button type="button" className="lane-b-icon-btn" aria-label="Notifications">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>

            <div className="lane-b-user-avatar" title="Signed in as Cost Analyst (CA)">
              CA
            </div>
          </div>
        </header>

        {/* Detail Page Container */}
        <div className="lane-b-container">
          {/* Back Button */}
          <div className="lane-b-back-row">
            <button
              type="button"
              className="lane-b-back-btn"
              onClick={onBack}
              title="Return to results list"
            >
              <ArrowLeft size={14} />
              <span>Back to results</span>
            </button>
          </div>

          {/* Heading Row */}
          <div className="lane-b-detail-heading-row">
            <div className="lane-b-detail-title-col">
              <div className="lane-b-detail-title-line">
                <h1 className="lane-b-detail-h1">{data.product}</h1>
                <span className={`lane-b-detail-pct-pill ${isUp ? 'pill-up' : 'pill-down'}`}>
                  {isUp ? '↗' : '↘'} {Math.abs(data.deltaPercent).toFixed(1)}%
                </span>
              </div>

              {/* Sub-tags */}
              <div className="lane-b-detail-tags-line">
                <span className="lane-b-detail-tag">Root plant {data.rootPlant}</span>
                <span className="lane-b-detail-tag">SKU {data.sku}</span>
                <span className="lane-b-detail-tag">GCC April → May 2027</span>
                <span className="lane-b-detail-tag">Total group cost per unit · USD</span>
              </div>
            </div>

            {/* Paging Controls */}
            <div className="lane-b-detail-nav-col">
              <span className="lane-b-page-count">
                {activeIndex + 1} of {rows.length} flagged
              </span>

              <button
                type="button"
                className="lane-b-nav-arrow-btn"
                disabled={!prevRow}
                onClick={handlePrev}
                aria-label="Previous product"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                className="lane-b-nav-next-btn"
                disabled={!nextRow}
                onClick={handleNext}
                aria-label="Next product"
              >
                <span>Next · {nextRow ? nextRow.product : 'End'}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Top 2 Cards Grid */}
          <div className="lane-b-detail-top-grid">
            <ExplainAgentCard
              quote={data.quote}
              keyDriversShare={data.keyDriversShare}
              keyDrivers={data.keyDrivers}
            />

            <CostSummaryCard
              measure="TOTAL GROUP COST PER UNIT"
              cycle1Label={data.cycle1Label}
              cycle2Label={data.cycle2Label}
              cycle1={data.cycle1}
              cycle2={data.cycle2}
              delta={data.delta}
              deltaPercent={data.deltaPercent}
              direction={data.direction}
              confidence={data.confidence}
              confidenceNote={data.confidenceNote}
            />
          </div>

          {/* Bottom 2 Cards Grid */}
          <div className="lane-b-detail-bottom-grid">
            <CostBridgeChart
              min={data.costBridge?.min || 9}
              max={data.costBridge?.max || 13}
              steps={data.costBridge?.steps}
            />

            <BreakdownTable
              breakdown={data.breakdown}
              totalRow={{
                name: 'Total group cost',
                cycle1: data.cycle1,
                cycle2: data.cycle2,
                delta: data.delta,
                percent: data.deltaPercent,
              }}
              checks={data.checks}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaneBDetailPage;
