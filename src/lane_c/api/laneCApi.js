/**
 * Lane C (Alternative Path: Failed Run / FX Rate Missing) - API & Workflow Service Layer
 * 
 * Supports workflow sequence:
 *   Image 1 (Setup / Year-over-year) -> Run Comparison 
 *   -> Image 2 (Running / FX Restatement) 
 *   -> FX Rate Missing / Failure 
 *   -> Image 3 (Failed at Prepare / 2027 FBP FX rates not found in BDC)
 * 
 * Ready to connect to backend:
 *   Set `VITE_API_URL` to point to the live pipeline execution API.
 */

const API_BASE_URL = import.meta.env?.VITE_API_URL || '';

export const LANE_C_DEFAULT_PARAMS = {
  baseline: 'GCC 2026',
  baselineDetail: 'Final · group cost output · 1,253 combinations',
  comparison: 'GCC 2027',
  comparisonDetail: 'Final · group cost output · 1,244 combinations',
  comparisonType: 'Year over year',
  comparisonTypeDetail: 'e.g. 2027 vs 2026',
  measure: 'Total group cost',
  threshold: 10,
};

export const LANE_C_ERROR_DETAILS = {
  failedStage: 'Prepare',
  failedDuration: '34 s',
  errorCode: 'FX_RATE_NOT_FOUND',
  errorMessage: '2027 FBP FX rates not found in BDC',
  title: 'The run stopped before anything was compared',
  description:
    'Year-over-year runs need both cycles on the same FX basis. Rootwise could not read the 2027 FBP FX rates, so nothing was flagged and no commentary was written. No data was changed.',
};

/**
 * Dynamic API service for Lane C workflow
 */
export const laneCApi = {
  /**
   * Start a new comparison run
   */
  async startRun(params = LANE_C_DEFAULT_PARAMS) {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/lane-c/runs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        if (!res.ok) throw new Error(`Backend run error: ${res.statusText}`);
        return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, using dynamic Lane C simulation', err);
      }
    }

    // Dynamic local run simulation
    return {
      success: true,
      runId: `run-yoy-${Date.now()}`,
      status: 'running',
      params,
      stage: 'prepare',
      elapsedSeconds: 0,
      prepareProgress: {
        current: 741,
        total: 1231,
        phase: 'Restating 2026 at 2027 FBP rates',
      },
    };
  },

  /**
   * Check run status
   */
  async getRunStatus(runId, shouldSimulateFailure = true) {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/lane-c/runs/${runId}`);
        if (!res.ok) throw new Error(`Status error: ${res.statusText}`);
        return await res.json();
      } catch (err) {
        console.warn('Backend status unavailable, using simulation', err);
      }
    }

    if (shouldSimulateFailure) {
      return {
        success: true,
        runId,
        status: 'failed',
        error: LANE_C_ERROR_DETAILS,
      };
    }

    return {
      success: true,
      runId,
      status: 'running',
      elapsedSeconds: 42,
      stage: 'prepare',
      prepareProgress: {
        current: 741,
        total: 1231,
        phase: 'Restating 2026 at 2027 FBP rates',
      },
    };
  },

  /**
   * Cancel active run
   */
  async cancelRun(runId) {
    if (API_BASE_URL) {
      try {
        await fetch(`${API_BASE_URL}/api/lane-c/runs/${runId}/cancel`, { method: 'POST' });
      } catch (err) {
        console.warn('Backend cancel failed', err);
      }
    }
    return { success: true, status: 'cancelled' };
  },

  /**
   * Retry failed run
   */
  async retryRun(params = LANE_C_DEFAULT_PARAMS) {
    return this.startRun(params);
  },
};
