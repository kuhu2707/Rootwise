# Lane B (Cost Analyst) - Rootwise

This folder implements **Lane B (Cost Analyst Results)** for Rootwise, built to match the design with:
- **Font**: Johnson Display (with high-contrast editorial serif fallbacks)
- **Colors**: Exact Rootwise corporate palette (Coral `#DC4A2D`, Amber `#F59E0B`, Green `#0EA969`, Violet `#8B5CF6`, Dark Charcoal `#12141A`, and Canvas `#F5F6F9`)
- **Gradients**: Multi-step linear gradients for agent stack badges and brand marks
- **Dynamic & Backend-Ready**: Pre-fitted API client and dynamic aggregations ready to connect to any backend service.

---

## Folder Structure

```text
src/lane_b/
├── api/
│   └── laneBApi.js          # API client, dynamic aggregations, & mock backend engine
├── components/
│   ├── AgentStackBadge.jsx   # 4-agent status icons (SAP, PowerBI, Bot, Shield) + timer
│   ├── DeltaGaugeBar.jsx     # Directional variance arrow, value, & proportional mini gauge
│   ├── LaneBFilterBar.jsx    # Filter tags (Same-year, Total group cost, Threshold) & action buttons
│   ├── LaneBMetricCards.jsx  # 4 Key metrics cards (Flagged, Increases, Decreases, Largest Mover)
│   ├── LaneBSidebar.jsx      # Navigation rail with brandmark and icon items
│   ├── LaneBTable.jsx        # Flagged combinations table with tabs, search, and selection
│   ├── LaneBTopBar.jsx       # Top navigation, sync status, and perspective switcher
│   └── SignalConfidence.jsx  # 3-bar signal confidence indicator (High / Medium)
├── laneB.css                 # Dedicated CSS styles and Johnson Display typography
├── LaneBResultsPage.jsx      # Main orchestrating view component
└── index.js                  # Clean exports
```

---

## Backend Integration Guide

When the backend API is created:

1. **Set Environment Variable**:
   In `.env` or `.env.local`:
   ```bash
   VITE_API_URL=https://api.your-backend-domain.com
   ```

2. **Expected Endpoint**:
   `GET /api/lane-b/results`

   **Query Parameters**:
   - `perspective`: `"cost-analyst"`
   - `threshold`: `number` (e.g. `10`)
   - `measure`: `string` (e.g. `"Total group cost"`)
   - `search`: `string` (optional search query)
   - `filter`: `"All" | "Increases" | "Decreases"`

   **Expected Response Payload**:
   ```json
   {
     "success": true,
     "data": {
       "rows": [
         {
           "id": "A-100245",
           "product": "Product A",
           "letter": "A",
           "tone": "coral",
           "rootPlant": "RP-01",
           "sku": "100245",
           "cycle1": 10.50,
           "cycle2": 12.80,
           "delta": 2.30,
           "deltaPercent": 21.9,
           "direction": "up",
           "commentary": "Cost up 21.9%, driven by higher manufacturing cost and a 35% rise in API cost from supplier price changes and tighter supply.",
           "commentaryBadge": "Management",
           "confidence": "High",
           "confidenceScore": 3
         }
       ],
       "metrics": {
         "flaggedCount": 6,
         "totalCompared": 1284,
         "costIncreasesCount": 4,
         "costIncreasesCombined": 6.08,
         "costDecreasesCount": 2,
         "costDecreasesCombined": -3.48,
         "largestMover": {
           "product": "Product A",
           "percent": 21.9,
           "cycle1": 10.50,
           "cycle2": 12.80,
           "direction": "up"
         }
       },
       "counts": {
         "all": 6,
         "increases": 4,
         "decreases": 2
       }
     }
   }
   ```

If no backend is provided, `laneBApi` automatically processes, filters, searches, and computes statistics dynamically in-memory.
