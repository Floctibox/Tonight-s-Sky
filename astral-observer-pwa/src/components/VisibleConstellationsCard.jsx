import { formatDayLabel } from '../utils/format';
import { Badge } from './ui/Badge';
import { EyeIcon } from './ui/icons';
import { SectionCard } from './ui/SectionCard';

function ConstellationCluster({ label, items, date }) {
  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{label}</h3>
          <p className="text-xs text-slate-400">Reference time: 22:00 local · {formatDayLabel(date)}</p>
        </div>
        <Badge tone="cyan">{items.length} visible</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.slice(0, 10).map((item) => (
          <span key={item.id} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/40 px-3 py-1.5 text-xs text-slate-200">
            <span className="font-medium text-white">{item.name}</span>
            <span className="text-slate-400">{Math.round(item.altitude)}°</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function VisibleConstellationsCard({ className = '', constellations }) {
  return (
    <SectionCard
      className={className}
      eyebrow="Skywatching targets"
      title="Visible constellations"
      icon={<EyeIcon className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-slate-300">
          The list below surfaces the highest-elevation constellations around the late-evening sky. Use the map panel for the interactive full-sky view.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <ConstellationCluster
            label="Tonight"
            items={constellations.tonight.visible}
            date={constellations.tonight.date}
          />
          <ConstellationCluster
            label="Tomorrow night"
            items={constellations.tomorrow.visible}
            date={constellations.tomorrow.date}
          />
        </div>
      </div>
    </SectionCard>
  );
}
