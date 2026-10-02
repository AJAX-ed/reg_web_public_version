// =============================================================================
// Hero — event title, tagline, date/venue badges, and a CTA.
// All copy comes from src/config/event.ts (placeholder content for now).
// =============================================================================
import { EVENT_CONFIG } from "@/config/event";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-20 text-center sm:pt-28">
      {/* Subtle decorative background wash (no heavy neon glow) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-14rem] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-accent-deep/20 blur-[140px]" />
      </div>

      <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-accent-blue/30 bg-accent-deep/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent-blue">
        {/* Online event badge */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        Online Event{EVENT_CONFIG.isFree ? " · Free Entry" : ""}
      </p>

      <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
        <span className="gradient-text">{EVENT_CONFIG.name}</span>
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-base text-text-muted sm:text-lg">
        {EVENT_CONFIG.tagline}
      </p>

      {/* Date / Time / Format badges (placeholder values — edit in src/config/event.ts) */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
        <span className="card px-4 py-2.5">
          📅 <span className="font-semibold">{EVENT_CONFIG.dateLabel}</span>
        </span>
        <span className="card px-4 py-2.5">
          🕓 <span className="font-semibold">{EVENT_CONFIG.timeLabel}</span>
        </span>
        <span className="card px-4 py-2.5">
          💻 <span className="font-semibold">{EVENT_CONFIG.venueName}</span>
        </span>
      </div>

      <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-text-muted">
        {EVENT_CONFIG.description}
      </p>

      <a href="#register" className="btn-primary mt-9 no-underline">
        Register Now →
      </a>
    </section>
  );
}
