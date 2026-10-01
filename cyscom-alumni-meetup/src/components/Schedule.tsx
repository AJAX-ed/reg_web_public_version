// =============================================================================
// Schedule — placeholder run-of-show list. Edit items in src/config/event.ts.
// Hide this section later by removing it from page.tsx if not needed.
// =============================================================================
import { EVENT_CONFIG } from "@/config/event";

export default function Schedule() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h2 className="mb-6 text-center text-2xl font-bold tracking-tight sm:text-3xl">
        Event <span className="gradient-text">Schedule</span>
        <span className="ml-2 align-middle text-xs font-normal uppercase tracking-widest text-text-muted">
          (preliminary)
        </span>
      </h2>

      <ol className="card divide-y divide-border">
        {EVENT_CONFIG.schedule.map((slot) => (
          <li key={slot.time} className="flex items-baseline gap-4 px-5 py-4 sm:px-7">
            <span className="w-20 shrink-0 font-mono text-sm font-semibold text-accent">
              {slot.time}
            </span>
            <span className="text-sm text-text sm:text-base">{slot.item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
