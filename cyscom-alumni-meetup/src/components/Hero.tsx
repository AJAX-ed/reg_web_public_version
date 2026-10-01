// =============================================================================
// Hero — event title, tagline, date/venue badges, and a CTA.
// All copy comes from src/config/event.ts (placeholder content for now).
// =============================================================================
import { EVENT_CONFIG } from "@/config/event";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-20 text-center sm:pt-28">
      {/* Decorative glow orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12rem] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-accent-deep/40 blur-[120px]" />
        <div className="absolute right-[-6rem] top-24 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-deep/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        {EVENT_CONFIG.isFree ? "Free Entry · Limited Seats" : "Alumni Event"}
      </p>

      <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
        <span className="gradient-text glow-text">{EVENT_CONFIG.name}</span>
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-base text-text-muted sm:text-lg">
        {EVENT_CONFIG.tagline}
      </p>

      {/* Date / Venue badges (placeholder values — edit in src/config/event.ts) */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
        <span className="card px-4 py-2.5">
          📅 <span className="font-semibold">{EVENT_CONFIG.dateLabel}</span>
        </span>
        <span className="card px-4 py-2.5">
          🕓 <span className="font-semibold">{EVENT_CONFIG.timeLabel}</span>
        </span>
        <span className="card px-4 py-2.5">
          📍 <span className="font-semibold">{EVENT_CONFIG.venueName}</span>
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
