// =============================================================================
// Footer — organizer contact + small print. (TODO: update in src/config/event.ts)
// =============================================================================
import { EVENT_CONFIG } from "@/config/event";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 px-4 py-10 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted">
        {EVENT_CONFIG.name}
      </p>
      <p className="mt-2 text-xs text-text-muted">
        Questions? Contact the organizers at{" "}
        <a
          href={`mailto:${EVENT_CONFIG.contactEmail}`}
          className="text-accent hover:underline"
        >
          {EVENT_CONFIG.contactEmail}
        </a>
      </p>
      <p className="mt-4 text-[11px] text-text-muted/70">
        © {new Date().getFullYear()} CYSCOM Alumni Association · Free event · Built with Next.js + Supabase
      </p>
    </footer>
  );
}
