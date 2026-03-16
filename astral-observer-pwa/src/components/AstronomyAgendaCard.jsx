import { formatDateTime } from '../utils/format';
import { Badge } from './ui/Badge';
import { CalendarIcon } from './ui/icons';
import { SectionCard } from './ui/SectionCard';

const toneByType = {
  Eclipse: 'violet',
  'Meteor shower': 'cyan',
  'Lunar event': 'amber',
  Conjunction: 'emerald',
};

export function AstronomyAgendaCard({ className = '', agenda }) {
  return (
    <SectionCard
      className={className}
      eyebrow="Astronomy agenda"
      title="Upcoming celestial events"
      icon={<CalendarIcon className="h-5 w-5" />}
      footer="Meteor shower windows use bundled recurring datasets. Eclipses, moon phases, and conjunctions are calculated locally."
    >
      <div className="space-y-3">
        {agenda.map((event) => (
          <article key={event.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <Badge tone={toneByType[event.type] || 'slate'}>{event.type}</Badge>
                <h3 className="text-base font-semibold text-white">{event.title}</h3>
                <p className="text-sm leading-6 text-slate-300">{event.detail}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-200">
                {formatDateTime(event.date)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
