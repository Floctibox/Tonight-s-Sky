export function formatDateTime(value, options = {}) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    ...options,
  }).format(date);
}

export function formatShortTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatDayLabel(value) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatPercent(value, digits = 0) {
  return `${Number(value || 0).toFixed(digits)}%`;
}

export function formatVisibilityKm(valueKm) {
  const numeric = Number(valueKm || 0);
  return `${numeric >= 10 ? numeric.toFixed(0) : numeric.toFixed(1)} km`;
}

export function formatTemperature(valueC) {
  return `${Math.round(Number(valueC || 0))}°C`;
}

export function formatWind(valueKmh) {
  return `${Math.round(Number(valueKmh || 0))} km/h`;
}

export function titleCase(value) {
  return String(value || '')
    .replace(/[_-]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}
