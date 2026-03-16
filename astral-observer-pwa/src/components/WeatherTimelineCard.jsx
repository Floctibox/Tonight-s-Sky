import { formatShortTime, formatVisibilityKm } from '../utils/format';
import { CloudIcon, EyeIcon } from './ui/icons';
import { SectionCard } from './ui/SectionCard';

export function WeatherTimelineCard({ className = '', weather }) {
  // Filter to show hours until next sunrise
  const now = new Date();
  const today = weather.daily?.[0];
  const tomorrow = weather.daily?.[1];

  // Use tomorrow's sunrise if today is already past sunrise, otherwise use today's
  let nextSunrise = null;
  if (today?.sunrise) {
    const todaySunrise = new Date(today.sunrise);
    if (todaySunrise > now) {
      nextSunrise = todaySunrise; // Today sunrise hasn't happened yet
    } else if (tomorrow?.sunrise) {
      nextSunrise = new Date(tomorrow.sunrise); // Use tomorrow's sunrise
    }
  }

  const displayHours = nextSunrise
    ? weather.hourly.filter(hour => hour.date >= now && hour.date <= nextSunrise)
    : weather.hourly.filter(hour => hour.date > now).slice(0, 12);

  // Fallback if no hours to display
  if (displayHours.length === 0) {
    return (
      <SectionCard
        className={className}
        eyebrow="Next 12 hours"
        title="Visibility timeline"
        icon={<CloudIcon className="h-5 w-5" />}
        footer="Times come from Open-Meteo and are returned in the forecast location’s local timezone."
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
            <p>No upcoming hours available in the forecast data.</p>
          </div>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      className={className}
      eyebrow={`Until ${nextSunrise ? formatShortTime(nextSunrise) : 'next'} sunrise`}
      title="Visibility timeline"
      icon={<CloudIcon className="h-5 w-5" />}
      footer="Times come from Open-Meteo and are returned in the forecast location’s local timezone."
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
          <p>Track how cloud cover and transparency evolve before the next observing window.</p>
          {weather.summary.bestWindow ? (
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
              Best: {formatShortTime(weather.summary.bestWindow.time)}
            </div>
          ) : null}
        </div>

        <div className="scrollbar-subtle flex gap-3 overflow-x-auto pb-2">
          {displayHours.map((hour) => (
            <div
              key={hour.time}
              className={`min-w-[128px] rounded-2xl border p-4 ${hour.isDay ? 'border-white/[0.08] bg-white/[0.03]' : 'border-cyan-400/15 bg-cyan-400/[0.05]'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-white">{formatShortTime(hour.time)}</p>
                <span className={`h-2.5 w-2.5 rounded-full ${hour.isDay ? 'bg-amber-300' : 'bg-cyan-300'}`} />
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-300">
                <div>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1"><CloudIcon className="h-3.5 w-3.5" /> Clouds</span>
                    <strong className="font-medium text-white">{Math.round(hour.cloudCover)}%</strong>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300/80 to-violet-300/70"
                      style={{ width: `${Math.min(Math.max(hour.cloudCover, 2), 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1"><EyeIcon className="h-3.5 w-3.5" /> Visibility</span>
                  <strong className="font-medium text-white">{formatVisibilityKm(hour.visibilityKm)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
