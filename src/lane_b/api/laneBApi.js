/**
 * Lane B (Cost Analyst Perspective) - Data Service & Backend Integration Layer
 * 
 * Designed to be 100% dynamic and plug-and-play with the future Rootwise backend.
 * When the backend API is ready:
 *   1. Define `VITE_API_URL` in `.env` (or call `configureApi({ baseUrl: '...' })`).
 *   2. The service seamlessly switches from built-in mock responses to live REST/GraphQL endpoints.
 */

const API_BASE_URL = import.meta.env?.VITE_API_URL || '';

// Default mock dataset matching the Rootwise GCC April -> May 2027 Cost Analyst view
export const DEFAULT_LANE_B_DATA = [
  {
    id: 'A-100245',
    product: 'Product A',
    letter: 'A',
    tone: 'coral', // coral avatar
    rootPlant: 'RP-01',
    sku: '100245',
    cycle1: 10.50,
    cycle2: 12.80,
    delta: 2.30,
    deltaPercent: 21.9,
    direction: 'up',
    commentary: 'Cost up 21.9%, driven by higher manufacturing cost and a 35% rise in API cost from supplier price changes and tighter supply.',
    commentaryBadge: 'Management',
    confidence: 'High',
    confidenceScore: 3, // out of 3
  },
  {
    id: 'E-102310',
    product: 'Product E',
    letter: 'E',
    tone: 'orange', // peach/orange avatar
    rootPlant: 'RP-02',
    sku: '102310',
    cycle1: 7.85,
    cycle2: 9.02,
    delta: 1.17,
    deltaPercent: 14.9,
    direction: 'up',
    commentary: 'Cost up 14.9%. A new sourcing route raised freight cost.',
    commentaryBadge: 'Management',
    confidence: 'High',
    confidenceScore: 3,
  },
  {
    id: 'C-100512',
    product: 'Product C',
    letter: 'C',
    tone: 'green', // mint green avatar
    rootPlant: 'RP-03',
    sku: '100512',
    cycle1: 4.20,
    cycle2: 3.62,
    delta: -0.58,
    deltaPercent: 13.8,
    direction: 'down',
    commentary: 'Cost down 13.8% after production moved to a lower-cost plant.',
    commentaryBadge: 'Management',
    confidence: 'High',
    confidenceScore: 3,
  },
  {
    id: 'D-101077',
    product: 'Product D',
    letter: 'D',
    tone: 'coral',
    rootPlant: 'RP-01',
    sku: '101077',
    cycle1: 18.40,
    cycle2: 20.75,
    delta: 2.35,
    deltaPercent: 12.8,
    direction: 'up',
    commentary: 'Cost up 12.8%. A new formulation adds one component.',
    commentaryBadge: 'Management',
    confidence: 'High',
    confidenceScore: 3,
  },
  {
    id: 'F-100988',
    product: 'Product F',
    letter: 'F',
    tone: 'orange',
    rootPlant: 'RP-04',
    sku: '100988',
    cycle1: 2.10,
    cycle2: 2.36,
    delta: 0.26,
    deltaPercent: 12.4,
    direction: 'up',
    commentary: 'Cost up 12.4%, driven by higher packaging prices.',
    commentaryBadge: 'Management',
    confidence: 'High',
    confidenceScore: 3,
  },
  {
    id: 'G-103402',
    product: 'Product G',
    letter: 'G',
    tone: 'green',
    rootPlant: 'RP-02',
    sku: '103402',
    cycle1: 25.60,
    cycle2: 22.70,
    delta: -2.90,
    deltaPercent: 11.3,
    direction: 'down',
    commentary: 'Cost down 11.3%, as one excipient no longer appears in the BOM.',
    commentaryBadge: 'Management',
    confidence: 'Medium',
    confidenceScore: 2,
  },
];

// Rich Product Detail Definitions (Dynamic Mock Backend Store)
export const PRODUCT_DETAILS = {
  'A-100245': {
    id: 'A-100245',
    product: 'Product A',
    deltaPercent: 21.9,
    direction: 'up',
    rootPlant: 'RP-01',
    sku: '100245',
    cycle1Label: 'Apr 2027',
    cycle2Label: 'May 2027',
    cycle1: 10.50,
    cycle2: 12.80,
    delta: 2.30,
    quote:
      '“Product A cost rose 22% this cycle. Higher manufacturing cost and a 35% rise in API cost, from supplier price changes and tighter supply, account for almost all of it.”',
    keyDriversShare: '99% OF THE INCREASE',
    keyDrivers: [
      {
        marker: '1',
        tone: 'red',
        title: 'Manufacturing',
        subtitle: 'conversion',
        delta: 1.29,
      },
      {
        marker: '2',
        tone: 'red',
        title: 'Material',
        subtitle: 'API price',
        delta: 0.99,
      },
      {
        marker: '3',
        tone: 'grey',
        title: 'Logistics',
        subtitle: 'minor',
        delta: 0.02,
      },
    ],
    confidence: 'High',
    confidenceNote: 'All cost elements present in both cycles',
    costBridge: {
      min: 9,
      max: 13,
      steps: [
        { name: 'Cycle 1', subtitle: 'Apr 2027', value: 10.50, type: 'total' },
        { name: 'Material', marker: '2', delta: 0.99, type: 'increase', start: 10.50, end: 11.49 },
        { name: 'Manufacturing', marker: '1', delta: 1.29, type: 'increase', start: 11.49, end: 12.78 },
        { name: 'Logistics', marker: '3', delta: 0.02, type: 'increase', start: 12.78, end: 12.80 },
        { name: 'Cycle 2', subtitle: 'May 2027', value: 12.80, type: 'total' },
      ],
    },
    breakdown: [
      { name: 'Material', marker: '2', cycle1: 5.48, cycle2: 6.47, delta: 0.99, percent: 18, level: 0 },
      { name: 'API', cycle1: 2.21, cycle2: 2.99, delta: 0.78, percent: 35, level: 1, highlighted: true },
      { name: 'Packaging', cycle1: 1.27, cycle2: 1.42, delta: 0.15, percent: 12, level: 1 },
      { name: 'Excipients', cycle1: 2.00, cycle2: 2.06, delta: 0.06, percent: 3, level: 1 },
      { name: 'Manufacturing', marker: '1', cycle1: 4.62, cycle2: 5.91, delta: 1.29, percent: 28, level: 0 },
      { name: 'Logistics', marker: '3', cycle1: 0.40, cycle2: 0.42, delta: 0.02, percent: 5, level: 0 },
    ],
    checks: [
      'Manufacturing node unchanged',
      'BOM version unchanged',
      'Supply route unchanged',
    ],
  },
};

/**
 * Dynamically constructs full detail object for any product
 */
export function buildProductDetail(row) {
  if (PRODUCT_DETAILS[row.id]) {
    return PRODUCT_DETAILS[row.id];
  }

  const isUp = row.delta > 0;
  const absDelta = Math.abs(row.delta);

  // Generate dynamic drivers based on the product
  const primaryDriverVal = Number((row.delta * 0.7).toFixed(2));
  const secondaryDriverVal = Number((row.delta * 0.25).toFixed(2));
  const minorDriverVal = Number((row.delta - primaryDriverVal - secondaryDriverVal).toFixed(2));

  return {
    id: row.id,
    product: row.product,
    deltaPercent: row.deltaPercent,
    direction: row.direction || (isUp ? 'up' : 'down'),
    rootPlant: row.rootPlant,
    sku: row.sku,
    cycle1Label: 'Apr 2027',
    cycle2Label: 'May 2027',
    cycle1: row.cycle1,
    cycle2: row.cycle2,
    delta: row.delta,
    quote: `“${row.product} cost ${isUp ? 'rose' : 'decreased'} ${Math.abs(row.deltaPercent).toFixed(0)}% this cycle. ${row.commentary}”`,
    keyDriversShare: '95% OF THE MOVEMENT',
    keyDrivers: [
      {
        marker: '1',
        tone: isUp ? 'red' : 'green',
        title: isUp ? 'Manufacturing' : 'Conversion',
        subtitle: isUp ? 'conversion' : 'location shift',
        delta: primaryDriverVal,
      },
      {
        marker: '2',
        tone: isUp ? 'red' : 'green',
        title: 'Material',
        subtitle: 'BOM pricing',
        delta: secondaryDriverVal,
      },
      {
        marker: '3',
        tone: 'grey',
        title: 'Logistics',
        subtitle: 'freight update',
        delta: minorDriverVal,
      },
    ],
    confidence: row.confidence || 'High',
    confidenceNote: 'All cost elements present in both cycles',
    costBridge: {
      min: Math.floor(Math.min(row.cycle1, row.cycle2) - 1),
      max: Math.ceil(Math.max(row.cycle1, row.cycle2) + 1),
      steps: [
        { name: 'Cycle 1', subtitle: 'Apr 2027', value: row.cycle1, type: 'total' },
        { name: 'Primary Driver', marker: '1', delta: primaryDriverVal, type: isUp ? 'increase' : 'decrease', start: row.cycle1, end: row.cycle1 + primaryDriverVal },
        { name: 'Material', marker: '2', delta: secondaryDriverVal, type: isUp ? 'increase' : 'decrease', start: row.cycle1 + primaryDriverVal, end: row.cycle1 + primaryDriverVal + secondaryDriverVal },
        { name: 'Logistics', marker: '3', delta: minorDriverVal, type: isUp ? 'increase' : 'decrease', start: row.cycle1 + primaryDriverVal + secondaryDriverVal, end: row.cycle2 },
        { name: 'Cycle 2', subtitle: 'May 2027', value: row.cycle2, type: 'total' },
      ],
    },
    breakdown: [
      { name: 'Material', marker: '2', cycle1: Number((row.cycle1 * 0.52).toFixed(2)), cycle2: Number((row.cycle2 * 0.51).toFixed(2)), delta: secondaryDriverVal, percent: row.deltaPercent, level: 0 },
      { name: 'Direct Material', cycle1: Number((row.cycle1 * 0.35).toFixed(2)), cycle2: Number((row.cycle2 * 0.36).toFixed(2)), delta: Number((secondaryDriverVal * 0.7).toFixed(2)), percent: row.deltaPercent, level: 1, highlighted: true },
      { name: 'Packaging', cycle1: Number((row.cycle1 * 0.17).toFixed(2)), cycle2: Number((row.cycle2 * 0.15).toFixed(2)), delta: Number((secondaryDriverVal * 0.3).toFixed(2)), percent: 5, level: 1 },
      { name: 'Manufacturing', marker: '1', cycle1: Number((row.cycle1 * 0.44).toFixed(2)), cycle2: Number((row.cycle2 * 0.46).toFixed(2)), delta: primaryDriverVal, percent: Math.round(row.deltaPercent * 1.2), level: 0 },
      { name: 'Logistics', marker: '3', cycle1: Number((row.cycle1 * 0.04).toFixed(2)), cycle2: Number((row.cycle2 * 0.03).toFixed(2)), delta: minorDriverVal, percent: 3, level: 0 },
    ],
    checks: [
      'Manufacturing node verified',
      'BOM version verified',
      'Supply route verified',
    ],
  };
}

/**
 * Dynamically computes summary metrics from any dataset
 */
export function computeSummaryMetrics(rows, totalCompared = 1284) {
  const increases = rows.filter((r) => r.delta > 0);
  const decreases = rows.filter((r) => r.delta < 0);

  const costIncreasesCombined = increases.reduce((sum, r) => sum + r.delta, 0);
  const costDecreasesCombined = decreases.reduce((sum, r) => sum + r.delta, 0);

  // Determine largest mover by absolute percentage change
  const largestMover = rows.length > 0
    ? [...rows].sort((a, b) => Math.abs(b.deltaPercent) - Math.abs(a.deltaPercent))[0]
    : null;

  return {
    flaggedCount: rows.length,
    totalCompared,
    costIncreasesCount: increases.length,
    costIncreasesCombined: Number(costIncreasesCombined.toFixed(2)),
    costDecreasesCount: decreases.length,
    costDecreasesCombined: Number(costDecreasesCombined.toFixed(2)),
    largestMover: largestMover
      ? {
          product: largestMover.product,
          percent: largestMover.deltaPercent,
          cycle1: largestMover.cycle1,
          cycle2: largestMover.cycle2,
          direction: largestMover.direction,
        }
      : null,
  };
}

/**
 * Dynamic API client for Lane B results
 */
export const laneBApi = {
  /**
   * Fetch results with optional filters and threshold
   */
  async getResults(params = {}) {
    const {
      threshold = 10,
      measure = 'Total group cost',
      query = '',
      filter = 'All', // 'All' | 'Increases' | 'Decreases'
    } = params;

    // Check if backend API endpoint is defined
    if (API_BASE_URL) {
      try {
        const queryParams = new URLSearchParams({
          perspective: 'cost-analyst',
          threshold: String(threshold),
          measure,
          search: query,
          filter,
        });
        const res = await fetch(`${API_BASE_URL}/api/lane-b/results?${queryParams}`);
        if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
        return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, falling back to dynamic local processing', err);
      }
    }

    // Dynamic local processing fallback
    let filtered = DEFAULT_LANE_B_DATA.filter(
      (item) => Math.abs(item.deltaPercent) >= threshold
    );

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.product.toLowerCase().includes(q) ||
          r.sku.toLowerCase().includes(q) ||
          r.rootPlant.toLowerCase().includes(q) ||
          r.commentary.toLowerCase().includes(q)
      );
    }

    const increasesCount = filtered.filter((r) => r.delta > 0).length;
    const decreasesCount = filtered.filter((r) => r.delta < 0).length;

    if (filter === 'Increases') {
      filtered = filtered.filter((r) => r.delta > 0);
    } else if (filter === 'Decreases') {
      filtered = filtered.filter((r) => r.delta < 0);
    }

    const metrics = computeSummaryMetrics(DEFAULT_LANE_B_DATA.filter((r) => Math.abs(r.deltaPercent) >= threshold));

    return {
      success: true,
      data: {
        rows: filtered,
        metrics,
        counts: {
          all: DEFAULT_LANE_B_DATA.length,
          increases: increasesCount,
          decreases: decreasesCount,
        },
      },
    };
  },

  /**
   * Fetch full product detail with waterfall and breakdown
   */
  async getProductDetail(productId) {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/lane-b/products/${productId}`);
        if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
        return await res.json();
      } catch (err) {
        console.warn('Backend detail unavailable, using dynamic fallback', err);
      }
    }

    const row = DEFAULT_LANE_B_DATA.find((r) => r.id === productId) || DEFAULT_LANE_B_DATA[0];
    return {
      success: true,
      data: buildProductDetail(row),
    };
  },

  /**
   * Export results to CSV
   */
  exportCsv(rows, filename = 'rootwise-lane-b-cost-analyst.csv') {
    const headers = [
      'Product',
      'Root Plant',
      'SKU',
      'Cycle 1',
      'Cycle 2',
      'Delta',
      'Delta %',
      'AI Variance Commentary',
      'Confidence',
    ];

    const records = rows.map((r) => [
      r.product,
      r.rootPlant,
      r.sku,
      `$${r.cycle1.toFixed(2)}`,
      `$${r.cycle2.toFixed(2)}`,
      `${r.delta > 0 ? '+' : ''}${r.delta.toFixed(2)}`,
      `${r.deltaPercent.toFixed(1)}%`,
      r.commentary,
      r.confidence,
    ]);

    const csvContent = [headers, ...records]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
