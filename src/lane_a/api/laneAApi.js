/**
 * Rootwise Lane A - GVC Analyst API & Data Service
 * 
 * Provides dynamic data and pre-fitted flexibility for backend integration.
 * When VITE_API_URL is configured, fetches from live REST / SSE endpoints:
 *   GET /api/v1/comparisons/results?angle=GVC+Analyst&threshold=10&measure=Total+group+cost
 *   GET /api/v1/comparisons/stream-commentary (SSE / WebSocket for live agent writing)
 * 
 * Falls back to dynamic mock store with real-time calculations.
 */

const API_BASE = import.meta.env?.VITE_API_URL || '';

export const GVC_INITIAL_FLAGGED_ROWS = [
  {
    id: 'A-100245',
    product: 'Product A',
    letter: 'A',
    rootPlant: 'RP-01',
    sku: '100245',
    totalGroupCost: { cycle1: 10.50, cycle2: 12.80 },
    totalLegalStandardCost: { cycle1: 9.80, cycle2: 11.10 },
    delta: 2.30,
    percent: 21.9,
    direction: 'up',
    commentary: 'Material +18%, led by API +35%. Manufacturing +28% at the same node. Verify the API price and activity rates in cycle 2.',
    commentaryStatus: 'written', // 'written' | 'writing' | 'waiting'
    confidence: 'High',
    confidenceBars: 3,
    isActive: true, // Selected in view
  },
  {
    id: 'E-102310',
    product: 'Product E',
    letter: 'E',
    rootPlant: 'RP-02',
    sku: '102310',
    totalGroupCost: { cycle1: 7.85, cycle2: 9.02 },
    totalLegalStandardCost: { cycle1: 7.24, cycle2: 8.08 },
    delta: 1.17,
    percent: 14.9,
    direction: 'up',
    commentary: 'Freight component +41% after a supply route change. Check the new route and the freight rate applied.',
    commentaryStatus: 'written',
    confidence: 'High',
    confidenceBars: 3,
    isActive: false,
  },
  {
    id: 'C-100512',
    product: 'Product C',
    letter: 'C',
    rootPlant: 'RP-03',
    sku: '100512',
    totalGroupCost: { cycle1: 4.20, cycle2: 3.62 },
    totalLegalStandardCost: { cycle1: 3.85, cycle2: 3.45 },
    delta: -0.58,
    percent: -13.8,
    direction: 'down',
    commentary: 'Manufacturing node changed from RP-03 to RP-05; conversion cost is lower. Confirm the node change is intended.',
    commentaryStatus: 'writing',
    confidence: 'Pending',
    confidenceBars: 0,
    isActive: false,
  },
  {
    id: 'D-101077',
    product: 'Product D',
    letter: 'D',
    rootPlant: 'RP-01',
    sku: '101077',
    totalGroupCost: { cycle1: 18.40, cycle2: 20.75 },
    totalLegalStandardCost: { cycle1: 16.72, cycle2: 18.64 },
    delta: 2.35,
    percent: 12.8,
    direction: 'up',
    commentary: 'A new BOM version in cycle 2 adds one component. Check that the BOM is complete and has no duplicate lines.',
    commentaryStatus: 'writing',
    confidence: 'Pending',
    confidenceBars: 0,
    isActive: false,
  },
  {
    id: 'F-100988',
    product: 'Product F',
    letter: 'F',
    rootPlant: 'RP-04',
    sku: '100988',
    totalGroupCost: { cycle1: 2.10, cycle2: 2.36 },
    totalLegalStandardCost: { cycle1: 1.95, cycle2: 2.19 },
    delta: 0.26,
    percent: 12.4,
    direction: 'up',
    commentary: 'Packaging material increased 22%. No structural change was found; likely a price update.',
    commentaryStatus: 'writing',
    confidence: 'Pending',
    confidenceBars: 0,
    isActive: false,
  },
  {
    id: 'G-103402',
    product: 'Product G',
    letter: 'G',
    rootPlant: 'RP-02',
    sku: '103402',
    totalGroupCost: { cycle1: 25.60, cycle2: 22.70 },
    totalLegalStandardCost: { cycle1: 23.14, cycle2: 21.30 },
    delta: -2.90,
    percent: -11.3,
    direction: 'down',
    commentary: 'An excipient line is missing from the cycle 2 BOM. Possible missing structure; check before cycle close.',
    commentaryStatus: 'writing',
    confidence: 'Pending',
    confidenceBars: 0,
    isActive: false,
  },
];

/**
 * Calculates live summary metrics from rows
 */
export function calculateGvcMetrics(rows) {
  const flaggedCount = rows.length;
  const increases = rows.filter(r => r.delta > 0);
  const decreases = rows.filter(r => r.delta < 0);

  const combinedIncrease = increases.reduce((acc, r) => acc + Math.abs(r.delta), 0);
  const combinedDecrease = decreases.reduce((acc, r) => acc + Math.abs(r.delta), 0);

  // Largest mover by absolute percent
  const largest = [...rows].sort((a, b) => Math.abs(b.percent) - Math.abs(a.percent))[0] || rows[0];

  const writtenCount = rows.filter(r => r.commentaryStatus === 'written').length;

  return {
    flaggedCount,
    totalCompared: 1284,
    increasesCount: increases.length,
    decreasesCount: decreases.length,
    combinedIncrease: Number(combinedIncrease.toFixed(2)),
    combinedDecrease: Number(combinedDecrease.toFixed(2)),
    largestMover: largest ? {
      product: largest.product,
      percent: Math.abs(largest.percent).toFixed(1),
      cycle1: largest.totalGroupCost.cycle1.toFixed(2),
      cycle2: largest.totalGroupCost.cycle2.toFixed(2),
      direction: largest.direction,
    } : null,
    writtenCount,
    totalToExplain: flaggedCount,
  };
}

/**
 * Fetch GVC Analyst results (with backend fall-through)
 */
export async function fetchGvcResults(params = {}) {
  const {
    threshold = 10,
    measure = 'Total group cost',
    angle = 'GVC Analyst',
    writtenCount = 2,
    query = '',
    filter = 'All',
  } = params;

  if (API_BASE) {
    try {
      const url = new URL(`${API_BASE}/comparisons/results`);
      url.searchParams.set('angle', angle);
      url.searchParams.set('threshold', String(threshold));
      url.searchParams.set('measure', measure);
      if (query) url.searchParams.set('q', query);
      if (filter) url.searchParams.set('filter', filter);

      const res = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (err) {
      console.warn('[laneAApi] Backend unavailable, falling back to local store:', err);
    }
  }

  // Local dynamic computation
  let rows = GVC_INITIAL_FLAGGED_ROWS.map((row, index) => {
    // Dynamic status based on writtenCount
    const isWritten = index < writtenCount;
    return {
      ...row,
      commentaryStatus: isWritten ? 'written' : 'writing',
      confidence: isWritten ? 'High' : 'Pending',
      confidenceBars: isWritten ? 3 : 0,
    };
  });

  // Threshold filter
  rows = rows.filter(r => Math.abs(r.percent) >= threshold);

  // Search query filter
  if (query.trim()) {
    const q = query.toLowerCase();
    rows = rows.filter(r => 
      r.product.toLowerCase().includes(q) ||
      r.rootPlant.toLowerCase().includes(q) ||
      r.sku.includes(q)
    );
  }

  // Direction filter
  const allRowsCount = rows.length;
  const increasesCount = rows.filter(r => r.delta > 0).length;
  const decreasesCount = rows.filter(r => r.delta < 0).length;

  let filteredRows = rows;
  if (filter === 'Increases') {
    filteredRows = rows.filter(r => r.delta > 0);
  } else if (filter === 'Decreases') {
    filteredRows = rows.filter(r => r.delta < 0);
  }

  const metrics = calculateGvcMetrics(rows);

  return {
    rows: filteredRows,
    counts: {
      all: allRowsCount,
      increases: increasesCount,
      decreases: decreasesCount,
    },
    metrics,
    status: {
      syncTime: '09:12',
      syncSystem: 'SAP BDC · GVC outputs synced',
      explainStage: `Explain agent still writing · ${writtenCount} of ${rows.length}`,
      bannerText: `Commentary is still being written. Costs and deltas are final, so you can review them now.`,
      bannerPill: `${writtenCount} of ${rows.length} written`,
    },
  };
}

/**
 * Export results to CSV
 */
export function exportGvcCsv(rows) {
  const headers = ['Root plant', 'Product', 'SKU', 'Cycle 1', 'Cycle 2', 'Delta', 'Delta %', 'Diagnostic Commentary', 'Confidence'];
  const data = rows.map(r => [
    r.rootPlant,
    r.product,
    r.sku,
    `$${r.totalGroupCost.cycle1.toFixed(2)}`,
    `$${r.totalGroupCost.cycle2.toFixed(2)}`,
    `${r.delta > 0 ? '+' : ''}${r.delta.toFixed(2)}`,
    `${r.percent > 0 ? '+' : ''}${r.percent.toFixed(1)}%`,
    r.commentaryStatus === 'written' ? r.commentary : '[Agent writing]',
    r.confidence,
  ]);

  const csvContent = [headers, ...data]
    .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `rootwise-gvc-analyst-flagged-results-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
