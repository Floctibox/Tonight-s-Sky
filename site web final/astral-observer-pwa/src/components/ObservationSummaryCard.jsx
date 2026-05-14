import { formatShortTime, formatTemperature, formatVisibilityKm, formatWind } from '../utils/format';
import { Badge } from './ui/Badge';
import { CloudIcon, CompassIcon, EyeIcon, MoonIcon } from './ui/icons';
import { SectionCard } from './ui/SectionCard';

const toneByRating = {
  Excellent: 'emerald',
  Good: 'cyan',
  Fair: 'amber',
  Poor: 'rose',
  Daylight: 'amber',
};

export function ObservationSummaryCard({ className = '', weather, astronomy }) {
  const today = weather.daily[0];
  const bestWindow = weather.summary.bestWindow;

  return (
    <SectionCard
      className={className}
      eyebrow="Observation status"
      title="Current sky quality"
      icon={<CompassIcon className="h-5 w-5" />}
    >
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-5xl font-semibold text-white">{weather.summary.score}</div>
            <p className="mt-1 text-sm text-slate-400">out of 100</p>
          </div>

          <Badge tone={toneByRating[weather.summary.rating] || 'slate'}>
            {weather.summary.rating}
          </Badge>
        </div>

        <p className="max-w-sm text-sm leading-6 text-slate-300">
          {weather.summary.insight}
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="stat-chip">
            <CloudIcon className="h-4 w-4 text-cyan-200" />
            Clouds {Math.round(weather.current.cloudCover)}%
          </span>
          <span className="stat-chip">
            <EyeIcon className="h-4 w-4 text-cyan-200" />
            Visibility {formatVisibilityKm(weather.current.visibilityKm)}
          </span>
          <span className="stat-chip">
            <CompassIcon className="h-4 w-4 text-cyan-200" />
            Wind {formatWind(weather.current.windSpeedKmh)}
          </span>
          <span className="stat-chip">
            <MoonIcon className="h-4 w-4 text-cyan-200" />
            Moonlight {astronomy.moon.illuminationPercent}%
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Now</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-semibold text-white">{formatTemperature(weather.current.temperature)}</p>
                <p className="mt-1 text-sm text-slate-400">{weather.current.isDay ? 'Daylight sky' : 'Night sky'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Solar window</p>
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-4">
                <span>Sunrise</span>
                <strong className="font-medium text-white">{formatShortTime(today.sunrise)}</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Sunset</span>
                <strong className="font-medium text-white">{formatShortTime(today.sunset)}</strong>
              </div>
            </div>
          </div>
        </div>

        {bestWindow ? (
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.08] p-4 text-sm text-cyan-50">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/80">Best near-term observing slot</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-medium">{formatShortTime(bestWindow.time)}</span>
              <span>Score {bestWindow.score}</span>
              <span>{Math.round(bestWindow.cloudCover)}% cloud cover</span>
              <span>{formatVisibilityKm(bestWindow.visibilityKm)} visibility</span>
            </div>
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}
