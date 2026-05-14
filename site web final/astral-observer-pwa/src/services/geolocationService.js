import { env } from '../config/env';
import { DEFAULT_LOCATION } from '../data/defaultLocation';

function formatCoordinateLabel(latitude, longitude) {
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lonDir = longitude >= 0 ? 'E' : 'W';
  return `${Math.abs(latitude).toFixed(3)}° ${latDir}, ${Math.abs(longitude).toFixed(3)}° ${lonDir}`;
}

function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported in this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 1000 * 60 * 10,
      ...options,
    });
  });
}

async function reverseGeocode(latitude, longitude) {
  if (!env.openCageApiKey) {
    return null;
  }

  const url = new URL('https://api.opencagedata.com/geocode/v1/json');
  url.searchParams.set('q', `${latitude},${longitude}`);
  url.searchParams.set('key', env.openCageApiKey);
  url.searchParams.set('language', 'en');
  url.searchParams.set('pretty', '0');
  url.searchParams.set('no_annotations', '1');
  url.searchParams.set('limit', '1');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('OpenCage reverse geocoding failed.');
  }

  const data = await response.json();
  const match = data.results?.[0];
  if (!match) {
    return null;
  }

  const components = match.components || {};
  const locality = components.city || components.town || components.village || components.hamlet || components.county;
  const region = components.state || components.province || components.region;
  const country = components.country;
  const label = [locality, region, country].filter(Boolean).join(', ');

  return {
    label: label || match.formatted || null,
  };
}

export async function resolveUserLocation() {
  let location = { ...DEFAULT_LOCATION };
  let reason = null;

  try {
    const position = await getCurrentPosition();
    location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      elevation: position.coords.altitude || 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      label: formatCoordinateLabel(position.coords.latitude, position.coords.longitude),
      source: 'geolocation',
      isFallback: false,
    };
  } catch (error) {
    reason = error?.message || 'Using fallback location because geolocation was unavailable.';
    location = {
      ...DEFAULT_LOCATION,
      label: `${DEFAULT_LOCATION.label} · ${formatCoordinateLabel(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude)}`,
    };
  }

  try {
    const reverse = await reverseGeocode(location.latitude, location.longitude);
    if (reverse?.label) {
      location.label = reverse.label;
    }
  } catch {
    // Optional enhancement only.
  }

  return {
    ...location,
    reason,
  };
}
