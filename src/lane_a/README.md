# Rootwise Lane A - GVC Analyst Results ("View Ready Rows")

Implementation of the **GVC Analyst Results** screen with live in-progress commentary (*"View ready rows"*), built with **Johnson Display** typography, custom color tokens, dynamic calculations, and pre-flexible backend integration.

---

## 1. Visual Specification & Placements

### Typography
- **Headings & Titles**: `Johnson Display` (with fallback to `'Playfair Display', Georgia, serif`)
- **Body & Controls**: `Johnson Text` (with fallback to `Inter, ui-sans-serif, system-ui, sans-serif`)

### Exact Palette & Gradients
- **Coral Brand Accent**: `#DC2626` / `#E23A22` (Active sidebar tab icon, active row left border, red badges, in-progress dots)
- **Soft Rose / Coral Light**: `#FFF5F4` background, `#FEE2E2` border (In-progress notification banner)
- **Amber Warning**: `#F59E0B` (Cost increases dot)
- **Emerald Green**: `#0EA969` / `#059669` (Cost decreases, decrease gauge bars, sync status dot `#10B981`)
- **Purple / Violet**: `#8B5CF6` (Largest mover dot & agent icon badge)
- **Dark Charcoal / Black**: `#12141A` (`GA` profile badge, `Export` button, `💬 Diagnostic` tag `#111827`)
- **Canvas Background**: `radial-gradient(ellipse at 50% 0%, rgba(215, 235, 255, 0.42), transparent 45%), #F5F6F9`

---

## 2. Layout Structure & Placements

1. **Fixed Sidebar (`68px`)**:
   - Squircle Rootwise logo mark
   - Nav icons: Home, Plus (+), Workflow, **Table (Active: white pill with coral icon)**, Film, Settings
2. **Top Bar**:
   - Breadcrumb: `Comparisons / GCC April → May 2027 / Results`
   - Sync pill: `● SAP BDC · GVC outputs synced 09:12`
   - Perspective switch: `Viewing as` `● GVC Analyst` (active) | `Cost Analyst`
   - Notifications bell & Profile badge `GA`
3. **Header Section**:
   - Small kicker: `RESULTS` (coral red uppercase)
   - Title: `6 of 1,284 combinations flagged` (`Johnson Display`)
   - 4-Agent pill: `[DB] [Flag] [Tree] [Chat]` `Explain agent still writing · 2 of 6`
   - Configuration pills: `Same-year cycles`, `Total group cost`, `Threshold ≥ 10%`
   - Right buttons: `✎ Threshold ≥ 10%`, `⤓ Export`
4. **4 Metric Summary Cards**:
   - `FLAGGED`: `6` (`of 1,284 combinations compared`)
   - `COST INCREASES`: `4` (`↗ +$6.08 per unit, combined`)
   - `COST DECREASES`: `2` (`↘ -$3.48 per unit, combined`)
   - `LARGEST MOVER`: `Product A` (`↗ 21.9% · $10.50 → $12.80`)
5. **Flagged Combinations Card**:
   - Filter tabs: `All 6`, `Increases 4`, `Decreases 2`
   - Search bar: `🔍 Search product, SKU or plant`
   - In-progress banner: `● 2 of 6 written` `Commentary is still being written. Costs and deltas are final, so you can review them now.`
   - Table:
     - Headers: `ROOT PLANT / SKU`, `CYCLE 1`, `CYCLE 2`, `DELTA`, `DELTA %`, `AI VARIANCE COMMENTARY [💬 Diagnostic]`, `CONFIDENCE`
     - **Product A**: Active 3px red indicator on left border, avatar `A`, full diagnostic commentary, `High` confidence with 3 filled signal bars.
     - **Product E**: Avatar `E`, full diagnostic commentary, `High` confidence with 3 filled signal bars.
     - **Products C, D, F, G**: Shimmering skeleton bars, `● Explain agent writing` badge, `Pending` confidence.

---

## 3. Workflow & Route Architecture

- **Default Route**: `screen === '04a'`
- **Query Parameter Support**:
  - `?screen=04a`
  - `?readyRows=true` or `?ready=1`
  - `?angle=GVC+Analyst`
- **Navigation Triggers**:
  - From **Agent Run** (`03a.4` Explain stage): clicking **"View ready rows (2)"** routes to `04a`.
  - From **Lane B Results** (`04b`): clicking **"GVC Analyst"** in the top bar switches to `04a`.
  - From **Lane A Results** (`04a`): clicking **"Cost Analyst"** in the top bar switches to `04b`.
  - Clicking any row (e.g. **Product A**) opens the variance detail view (`05a` / `05b`).

---

## 4. Backend Flexibility (`laneAApi.js`)

Configure `VITE_API_URL` in `.env`:
```env
VITE_API_URL=https://api.yourdomain.com/api/v1
```

### Endpoints:
```http
GET /api/v1/comparisons/results?angle=GVC+Analyst&threshold=10&measure=Total+group+cost&writtenCount=2
Response:
{
  "rows": [...],
  "counts": { "all": 6, "increases": 4, "decreases": 2 },
  "metrics": {
    "flaggedCount": 6,
    "totalCompared": 1284,
    "increasesCount": 4,
    "decreasesCount": 2,
    "combinedIncrease": 6.08,
    "combinedDecrease": 3.48,
    "largestMover": {
      "product": "Product A",
      "percent": "21.9",
      "cycle1": "10.50",
      "cycle2": "12.80",
      "direction": "up"
    },
    "writtenCount": 2,
    "totalToExplain": 6
  },
  "status": {
    "syncTime": "09:12",
    "explainStage": "Explain agent still writing · 2 of 6",
    "bannerText": "Commentary is still being written. Costs and deltas are final, so you can review them now.",
    "bannerPill": "2 of 6 written"
  }
}
```
When offline or before the backend is deployed, the client uses the dynamic local mock store with live aggregations.
