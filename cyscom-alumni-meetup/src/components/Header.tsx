"use client";

// =============================================================================
// Header — sticky top bar with event wordmark + auth button (client component).
// Owns its own lightweight session listener so login state shows instantly.
// =============================================================================
import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { EVENT_CONFIG } from "@/config/event";
import AuthButton from "@/components/AuthButton";

export default function Header() {
  // We don't need the user object here, but AuthButton requires a callback.
  const [, setUser] = useState<User | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <a href="#" className="flex items-center gap-2 no-underline">
          {/* Simple blue monogram */}
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-deep font-black text-accent ring-1 ring-accent/40">
            C
          </span>
          <span className="hidden text-sm font-bold uppercase tracking-[0.18em] text-text sm:block">
            {EVENT_CONFIG.name}
          </span>
        </a>
        <AuthButton onUserChange={setUser} />
      </div>
    </header>
  );
}
