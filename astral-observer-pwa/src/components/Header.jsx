import { LocationIcon, RefreshIcon, SparkIcon } from './ui/icons';

export function Header({ location, onRefresh, refreshing }) {
  return (
    <header className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.2em] text-cyan-100 uppercase">
          <SparkIcon className="h-4 w-4" />
          Installable astronomy PWA
        </div>

        <div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            <span className="text-gradient">Astral Observer</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            Real-time skywatching conditions, visible constellations, celestial events, and locally calculated astrological transits from your current coordinates.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
          <LocationIcon className="h-4 w-4 text-cyan-200" />
          <div>
            <p className="font-medium text-white">{location?.label || 'Resolving coordinates...'}</p>
            <p className="text-xs text-slate-400">
              {location ? `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}` : 'Browser geolocation + fallback mode'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-cyan-300/40 hover:bg-white/[0.08]"
        >
          <RefreshIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing' : 'Refresh'}
        </button>
      </div>
    </header>
  );
}
