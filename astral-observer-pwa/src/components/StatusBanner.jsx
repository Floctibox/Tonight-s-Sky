import { formatDateTime } from '../utils/format';
import { Badge } from './ui/Badge';

export function StatusBanner({ source, cachedAt, location, error }) {
  const isCached = source === 'cached';
  const isFallback = source === 'fallback-live';

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <Badge tone={isCached ? 'amber' : isFallback ? 'violet' : 'emerald'}>
          {isCached ? 'Cached mode' : isFallback ? 'Fallback location' : 'Live data'}
        </Badge>
        <p className="leading-6 text-slate-300">
          {isCached
            ? `Showing the last successful dashboard refresh from ${formatDateTime(cachedAt)}.`
            : isFallback
              ? `Geolocation was unavailable, so the app is using ${location?.label || 'the fallback observing site'} with live weather and astronomy calculations.`
              : `Live weather and local astronomy calculations are active for ${location?.label || 'your current position'}.`}
        </p>
      </div>

      {error ? <p className="text-xs text-slate-400">Note: {error}</p> : null}
    </div>
  );
}
