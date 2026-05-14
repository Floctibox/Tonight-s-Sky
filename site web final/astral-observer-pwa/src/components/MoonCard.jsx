import { formatDateTime } from '../utils/format';
import { MoonIcon } from './ui/icons';
import { SectionCard } from './ui/SectionCard';

export function MoonCard({ className = '', moon }) {
  return (
    <SectionCard
      className={className}
      eyebrow="Lunar state"
      title="Moon phase"
      icon={<MoonIcon className="h-5 w-5" />}
    >
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-slate-50/20 to-slate-400/10 text-slate-100 shadow-inner shadow-white/5">
            <MoonIcon className="h-9 w-9" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Current phase</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{moon.phaseName}</h3>
            <p className="mt-1 text-sm text-slate-400">{moon.illuminationPercent}% illuminated · lunar age {moon.ageDays} days</p>
          </div>
        </div>

        <div className="grid gap-3">
          {moon.upcomingPhases.map((phase) => (
            <div key={`${phase.name}-${phase.date}`} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-white">{phase.name}</p>
                <p className="text-xs text-slate-400">{formatDateTime(phase.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
