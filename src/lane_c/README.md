# Lane C (Alternative Path: Failed Run / FX Rate Missing)

This folder implements **Lane C**, covering the failed comparison run path:
- **Image 1: Setup**: Year-over-year comparison (`GCC 2026` vs `GCC 2027`) with dynamic FX restatement banner
- **Image 2: Agent Run Running**: Prepare stage restating FX rates with live timer and pulsing progress indicator
- **Image 3: Agent Run Failed**: Prepare failure (`2027 FBP FX rates not found in BDC`) with full root-cause explanation and recovery actions (`Retry run`, `Change datasets`)

---

## Workflow & Event Actions

```text
[Image 1: Setup]
  │
  ├── Action: Click "Run comparison →"
  ▼
[Image 2: Agent Pipeline Running]
  │
  ├── State: Prepare agent active (FX restatement: 741 of 1,231)
  ├── Event: FX rate not found in BDC (auto-trigger or click "Simulate FX Rate Missing")
  ▼
[Image 3: Agent Pipeline Failed]
  │
  ├── State: Prepare marked with red ✖ ("2027 FBP FX rates not found in BDC")
  ├── Alert: "The run stopped before anything was compared"
  │
  ├── Action: Click "Retry run" ───────────────► Transitions back to Image 2 (Running)
  └── Action: Click "Change datasets" / "Back" ─► Transitions back to Image 1 (Setup)
```

---

## Backend Flexibility & Integration

- Service layer in `src/lane_c/api/laneCApi.js`:
  - `laneCApi.startRun(params)`: Sends `POST /api/lane-c/runs` when `VITE_API_URL` is configured.
  - `laneCApi.getRunStatus(runId)`: Polls or listens for WebSocket/SSE pipeline updates.
  - `laneCApi.retryRun(params)`: Re-triggers pipeline execution.
  - If backend is offline, simulates the live progression and failure path in-memory.
