import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Maximum number of automatic retries before giving up and showing an error.
 * Exported so the UI can display "attempt X of MAX_AUTO_RETRIES+1".
 */
export const MAX_AUTO_RETRIES = 3;

/**
 * Delay in milliseconds between each automatic retry attempt.
 * Index 0 = delay before attempt 1, index 1 = before attempt 2, etc.
 * Total wait time: 5s + 10s + 15s = 30 seconds — enough for Render to wake up.
 */
const RETRY_DELAYS_MS = [5000, 10000, 15000];

/**
 * useRetryableFetch — Custom hook for GET requests that may fail temporarily.
 *
 * WHY THIS EXISTS:
 * The backend is hosted on Render's free tier, which puts the server to
 * sleep after 15 minutes of inactivity. The first request after sleeping
 * fails with a network error. This hook retries automatically so the user
 * sees a loading spinner instead of an immediate error.
 *
 * SAFETY RULE (read this!):
 * Only pass GET request functions to this hook.
 * Never pass POST / PUT / PATCH / DELETE functions — retrying those
 * could create duplicate records or cause unintended data changes.
 *
 * WHAT GETS RETRIED:
 * - Network errors (no response from server) -- isNetworkError === true
 * - Server errors (5xx HTTP status codes)
 *
 * WHAT IS NOT RETRIED:
 * - Client errors (4xx) -- these are caused by bad requests, not a sleeping server
 *
 * @param {Function} fetchFn   An async function that performs the GET request.
 *                             Example: dashboardService.getSummary
 * @returns {{
 *   data:       any,          The successful response data, or null if not yet loaded
 *   loading:    boolean,      True while the initial fetch or any retry is in progress
 *   error:      Error|null,   Set when all retries are exhausted
 *   retryCount: number,       How many automatic retries have occurred (0 on first attempt)
 *   retry:      Function,     Call this to manually restart from attempt 0
 * }}
 */
export function useRetryableFetch(fetchFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * retryCount tracks which automatic retry we are on.
   * 0 = first attempt (not a retry yet)
   * 1 = first retry (second attempt overall)
   * Exposed so the loading spinner can say "Retrying (1/3)..."
   */
  const [retryCount, setRetryCount] = useState(0);

  // Prevents state updates after the component has unmounted.
  // Without this, a delayed retry could call setState on an unmounted component.
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * execute() is the core fetch-and-retry logic.
   * It is called recursively via setTimeout for each retry.
   *
   * @param {number} attempt   Which attempt this is (0-indexed). 0 = first try.
   */
  const execute = useCallback(
    async (attempt = 0) => {
      if (!isMountedRef.current) return;

      // On the very first attempt, reset all state to a clean loading state.
      if (attempt === 0) {
        setLoading(true);
        setError(null);
        setRetryCount(0);
      }

      try {
        const result = await fetchFn();
        if (!isMountedRef.current) return;

        // Success -- update data and stop loading.
        setData(result);
        setError(null);
        setLoading(false);
      } catch (err) {
        if (!isMountedRef.current) return;

        // Decide whether this error is worth retrying.
        // - isNetworkError: server did not respond (sleeping / starting up) => retry
        // - statusCode >= 500: server responded with an internal error => retry
        // - statusCode 4xx: bad request / not found (our bug) => do NOT retry
        const isRetryable =
          err.isNetworkError === true ||
          (typeof err.statusCode === 'number' && err.statusCode >= 500);

        if (isRetryable && attempt < MAX_AUTO_RETRIES) {
          // Schedule the next retry after a delay.
          // Keep loading=true so the spinner stays visible during the wait.
          const delayMs = RETRY_DELAYS_MS[attempt] ?? 15000;
          setRetryCount(attempt + 1);

          setTimeout(() => {
            if (isMountedRef.current) {
              execute(attempt + 1);
            }
          }, delayMs);
        } else {
          // All automatic retries exhausted (or non-retryable error).
          // Surface the error to the component so it can show a Retry button.
          setError(err);
          setLoading(false);
        }
      }
    },
    [fetchFn]
  );

  // Kick off the very first fetch when the component mounts.
  useEffect(() => {
    execute(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * retry() -- call this when the user clicks "Retry Now".
   * Resets retryCount to 0 and starts fresh, giving MAX_AUTO_RETRIES
   * more automatic retries before failing again.
   */
  const retry = useCallback(() => execute(0), [execute]);

  return { data, loading, error, retryCount, retry };
}
