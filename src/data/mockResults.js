export const datasetOptions = [
  'GCC April 2027',
  'GCC May 2027',
  'GCC April 2026',
  'GCC May 2026',
  'GCC May 2027 · Preliminary',
];

export const comparisonTypes = ['Same-year cycles', 'Year over year', 'Final vs preliminary'];
export const measures = ['Total group cost', 'Total legal standard cost'];

export const flaggedRows = [
  {
    id: 'A-100245', product: 'Product A', rootPlant: 'RP-01', sku: '100245',
    letter: 'A', letterBg: 'rgba(254, 242, 242, 1)', letterColor: 'rgba(226, 23, 0, 1)',
    deltaPercent: 21.9, deltaColor: 'rgba(226, 23, 0, 1)',
    totalGroupCost: { cycle1: 10.5, cycle2: 12.8 },
    totalLegalStandardCost: { cycle1: 9.8, cycle2: 11.1 },
    diagnosticCommentary: 'Material +18%, led by API +35%. Manufacturing +28% at the same node. Verify the API price and activity rates in cycle 2.',
    managementCommentary: 'Material and manufacturing account for almost all of the increase. API pricing rose 35%, while the manufacturing node is unchanged.',
    confidence: 'High',
    detailSummary: 'Product A rose 21.9% ($10.50 → $12.80). Two cost elements explain almost all of it. Check both before the cycle is used.',
    focusAreas: [
      { title: 'Manufacturing +28%', detail: 'Same node, no BOM change. Compare cycle 2 activity rates with April. Largest driver, +$1.29.' },
      { title: 'API price +35%', detail: 'Confirm the cycle 2 API price matches the supplier price. Far above Packaging (+12%).' },
      { title: 'Logistics +5%', detail: 'Small in value (+$0.02). Not a likely error. Structure unchanged.' },
    ],
    managementFocusAreas: [
      { title: 'Material +$0.99', detail: 'API pricing accounts for most of the material movement between cycles.' },
      { title: 'Manufacturing +$1.29', detail: 'Manufacturing is the largest contributor while the production node stays the same.' },
      { title: 'Logistics +$0.02', detail: 'A small contribution to the total movement; the supply route is unchanged.' },
    ],
    breakdown: [
      { name: 'Material', cycle1: 5.48, cycle2: 6.47, percent: 18, level: 0, marker: '2' },
      { name: 'API', cycle1: 2.21, cycle2: 2.99, percent: 35, level: 1 },
      { name: 'Packaging', cycle1: 1.27, cycle2: 1.42, percent: 12, level: 1 },
      { name: 'Excipients', cycle1: 2.00, cycle2: 2.06, percent: 3, level: 1 },
      { name: 'Manufacturing', cycle1: 4.62, cycle2: 5.91, percent: 28, level: 0, marker: '1' },
      { name: 'Logistics', cycle1: 0.40, cycle2: 0.42, percent: 5, level: 0, marker: '3' },
    ],
    checks: ['Manufacturing node unchanged', 'BOM version unchanged', 'Supply route unchanged'],
    drivers: [
      { name: 'Material', delta: 0.99, percent: 18, detail: 'API price increased 35%.' },
      { name: 'Manufacturing', delta: 1.29, percent: 28, detail: 'Same node; compare activity rates.' },
      { name: 'Logistics', delta: 0.02, percent: 5, detail: 'Small movement; route unchanged.' },
    ],
  },
  {
    id: 'E-102310', product: 'Product E', rootPlant: 'RP-02', sku: '102310',
    letter: 'E', letterBg: 'rgba(239, 246, 255, 1)', letterColor: 'rgba(37, 99, 235, 1)',
    deltaPercent: 14.5, deltaColor: 'rgba(226, 23, 0, 1)',
    totalGroupCost: { cycle1: 7.85, cycle2: 8.99 },
    totalLegalStandardCost: { cycle1: 7.24, cycle2: 8.08 },
    diagnosticCommentary: 'Freight component increased 41% after a supply route change. Check the new route and freight rate applied.',
    managementCommentary: 'A route change drove the freight increase. Confirm the new shipping lane and whether the higher rate is expected to continue.',
    confidence: 'High',
    drivers: [{ name: 'Freight', delta: 0.68, percent: 41, detail: 'A new supply route was used in cycle 2.' }, { name: 'Material', delta: 0.31, percent: 7, detail: 'Within the expected range.' }],
  },
  {
    id: 'C-100512', product: 'Product C', rootPlant: 'RP-03', sku: '100512',
    letter: 'C', letterBg: 'rgba(236, 253, 245, 1)', letterColor: 'rgba(16, 185, 129, 1)',
    deltaPercent: 13.0, deltaColor: 'rgba(16, 185, 129, 1)',
    totalGroupCost: { cycle1: 4.2, cycle2: 4.75 },
    totalLegalStandardCost: { cycle1: 3.85, cycle2: 3.45 },
    diagnosticCommentary: 'Manufacturing node changed from RP-03 to RP-05; conversion cost is lower. Confirm the node change is intended.',
    managementCommentary: 'A move from RP-03 to RP-05 lowered conversion cost. The reduction appears tied to the manufacturing location change.',
    confidence: 'High',
    drivers: [{ name: 'Manufacturing', delta: -0.58, percent: -13.8, detail: 'Production moved to RP-05.' }],
  },
  {
    id: 'D-101077', product: 'Product D', rootPlant: 'RP-01', sku: '101077',
    letter: 'D', letterBg: 'rgba(255, 247, 237, 1)', letterColor: 'rgba(234, 88, 12, 1)',
    deltaPercent: 12.8, deltaColor: 'rgba(226, 23, 0, 1)',
    totalGroupCost: { cycle1: 18.4, cycle2: 20.75 },
    totalLegalStandardCost: { cycle1: 16.72, cycle2: 18.64 },
    diagnosticCommentary: 'A new BOM version in cycle 2 adds one component. Check that the BOM is complete and has no duplicate lines.',
    managementCommentary: 'The new BOM version adds a component, which explains most of the increase. Validate the component and its expected ongoing cost.',
    confidence: 'High',
    drivers: [{ name: 'Materials', delta: 1.88, percent: 16, detail: 'One additional BOM component.' }, { name: 'Manufacturing', delta: 0.47, percent: 4, detail: 'Within the expected range.' }],
  },
  {
    id: 'F-100988', product: 'Product F', rootPlant: 'RP-04', sku: '100988',
    letter: 'F', letterBg: 'rgba(253, 242, 248, 1)', letterColor: 'rgba(219, 39, 119, 1)',
    deltaPercent: 12.4, deltaColor: 'rgba(226, 23, 0, 1)',
    totalGroupCost: { cycle1: 2.1, cycle2: 2.36 },
    totalLegalStandardCost: { cycle1: 1.95, cycle2: 2.19 },
    diagnosticCommentary: 'Packaging material increased 22%. No structural change was found; likely a price update.',
    managementCommentary: 'Packaging material pricing explains the increase. There is no corresponding structure change in the BOM.',
    confidence: 'High',
    drivers: [{ name: 'Packaging', delta: 0.26, percent: 22, detail: 'Unit price increased; quantity is stable.' }],
  },
  {
    id: 'G-103402', product: 'Product G', rootPlant: 'RP-02', sku: '103402',
    letter: 'G', letterBg: 'rgba(240, 253, 250, 1)', letterColor: 'rgba(13, 148, 136, 1)',
    deltaPercent: 11.3, deltaColor: 'rgba(16, 185, 129, 1)',
    totalGroupCost: { cycle1: 25.6, cycle2: 28.5 },
    totalLegalStandardCost: { cycle1: 23.14, cycle2: 21.3 },
    diagnosticCommentary: 'An excipient line is missing from the cycle 2 BOM. Possible missing structure; check before cycle close.',
    managementCommentary: 'The lower total may reflect a missing excipient line in the cycle 2 BOM rather than a true saving. Check the structure before close.',
    confidence: 'Medium',
    drivers: [{ name: 'Materials', delta: -2.9, percent: -14.2, detail: 'One excipient line is absent from the cycle 2 BOM.' }],
  },
];

export function getCost(row, measure) {
  return measure === 'Total legal standard cost' ? row.totalLegalStandardCost : row.totalGroupCost;
}

export function getDelta(row, measure) {
  const costs = getCost(row, measure);
  return Number((costs.cycle2 - costs.cycle1).toFixed(2));
}

export function getPercentChange(row, measure) {
  const costs = getCost(row, measure);
  return ((costs.cycle2 - costs.cycle1) / costs.cycle1) * 100;
}

export function getFlaggedRows(threshold, measure) {
  return flaggedRows.filter((row) => Math.abs(getPercentChange(row, measure)) >= threshold);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}
