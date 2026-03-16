import { useCallback, useEffect, useState } from 'react';
import { resolveUserLocation } from '../services/geolocationService';
import { getWeatherBundle } from '../services/weatherService';
import { buildAstronomyBundle } from '../services/astronomyService';
import { readDashboardCache, saveDashboardCache } from '../services/persistedCache';

const initialState = {
  loading: true,
  refreshing: false,
  error: null,
  source: 'live',
  cachedAt: null,
  location: null,
  weather: null,
  astronomy: null,
};

export function useAstronomyDashboard() {
  const [state, setState] = useState(initialState);

  const loadDashboard = useCallback(async ({ silent = false } = {}) => {
    setState((prev) => ({
      ...prev,
      loading: !silent && !prev.weather,
      refreshing: silent || Boolean(prev.weather),
      error: null,
    }));

    try {
      const location = await resolveUserLocation();
      const [weather, astronomy] = await Promise.all([
        getWeatherBundle(location),
        buildAstronomyBundle(location),
      ]);

      const payload = { location, weather, astronomy };
      saveDashboardCache(payload);

      setState({
        loading: false,
        refreshing: false,
        error: location.reason || null,
        source: location.isFallback ? 'fallback-live' : 'live',
        cachedAt: new Date().toISOString(),
        ...payload,
      });
    } catch (error) {
      const cached = readDashboardCache();
      if (cached?.payload) {
        setState({
          loading: false,
          refreshing: false,
          error: error?.message || 'Live refresh failed. Showing cached data instead.',
          source: 'cached',
          cachedAt: cached.savedAt,
          ...cached.payload,
        });
        return;
      }

      setState({
        ...initialState,
        loading: false,
        error: error?.message || 'Unable to build the astronomy dashboard.',
      });
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    ...state,
    refresh: () => loadDashboard({ silent: true }),
  };
}
