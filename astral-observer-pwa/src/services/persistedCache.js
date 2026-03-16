const DASHBOARD_CACHE_KEY = 'astral-observer-cache-v1';

export function readDashboardCache() {
  try {
    const raw = localStorage.getItem(DASHBOARD_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDashboardCache(payload) {
  try {
    localStorage.setItem(
      DASHBOARD_CACHE_KEY,
      JSON.stringify({
        savedAt: new Date().toISOString(),
        payload,
      }),
    );
  } catch {
    // Local storage is optional. Ignore quota/private mode failures.
  }
}
