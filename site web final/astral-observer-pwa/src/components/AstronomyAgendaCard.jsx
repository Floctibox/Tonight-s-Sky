import { useState } from 'react';
import { formatDateTime } from '../utils/format';
import { Badge } from './ui/Badge';
import { CalendarIcon } from './ui/icons';
import { SectionCard } from './ui/SectionCard';
import { useAuth } from '../hooks/useAuth';

const toneByType = {
  Eclipse: 'violet',
  'Meteor shower': 'cyan',
  'Lunar event': 'amber',
  Conjunction: 'emerald',
};

export function AstronomyAgendaCard({ className = '', agenda, onSaveEvent }) {
  const { isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSaveEvent = (event) => {
    if (onSaveEvent) {
      // Convert event data to the format expected by SaveEventModal
      const eventDate = new Date(event.date);
      // Format for datetime-local input: YYYY-MM-DDTHH:MM
      // Use toISOString to avoid timezone issues, then replace time with 00:00
      const formattedDate = eventDate.toISOString().split('T')[0] + 'T00:00';
      
      const eventData = {
        title: event.title,
        eventType: event.type.toLowerCase().replace(' ', '_'), // Convert "Meteor shower" to "meteor_shower"
        description: event.detail,
        eventDate: formattedDate,
        notes: '',
        reminderEnabled: true,
      };
      onSaveEvent(eventData);
      // Auto-collapse after saving
      setIsExpanded(false);
      // Re-expand after 2 seconds
      setTimeout(() => setIsExpanded(true), 2000);
    }
  };

  return (
    <SectionCard
      className={className}
      eyebrow="Astronomy agenda"
      title="Upcoming celestial events"
      icon={<CalendarIcon className="h-5 w-5" />}
      isExpanded={isExpanded}
      onToggleExpand={() => setIsExpanded(!isExpanded)}
    >
      {isExpanded && (
        <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
          {agenda.map((event) => (
            <article key={event.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2 flex-1">
                  <Badge tone={toneByType[event.type] || 'slate'}>{event.type}</Badge>
                  <h3 className="text-base font-semibold text-white">{event.title}</h3>
                  <p className="text-sm leading-6 text-slate-300">{event.detail}</p>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-200">
                    {formatDateTime(event.date)}
                  </div>
                  {isAuthenticated && onSaveEvent && (
                    <button
                      onClick={() => handleSaveEvent(event)}
                      className="text-xs px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white transition whitespace-nowrap"
                    >
                      📌 Save
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </SectionCard>
  );
}