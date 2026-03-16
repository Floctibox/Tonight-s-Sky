import { Badge } from './ui/Badge';
import { SparkIcon } from './ui/icons';
import { SectionCard } from './ui/SectionCard';

export function TransitCard({ className = '', transits }) {
  return (
    <SectionCard
      className={className}
      eyebrow="Astrological transits"
      title="Current planetary positions"
      icon={<SparkIcon className="h-5 w-5" />}
      footer={transits.disclaimer}
    >
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {transits.positions.map((planet) => (
            <div key={planet.body} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">{planet.body}</h3>
                  <p className="mt-1 text-sm text-slate-300">
                    {planet.degreeInSign.toFixed(1)}° {planet.sign}
                  </p>
                </div>
                {planet.retrograde ? <Badge tone="rose">Rx</Badge> : <Badge tone="slate">Direct</Badge>}
              </div>
            </div>
          ))}
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-slate-400">Closest major aspects</p>
          <div className="space-y-3">
            {transits.aspects.map((aspect) => (
              <div key={aspect.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-white">{aspect.bodies}</p>
                  <p className="text-slate-400">{aspect.aspect}</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                  Orb {aspect.orb.toFixed(1)}°
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
