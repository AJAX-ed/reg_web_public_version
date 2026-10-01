"use client";

// =============================================================================
// RegisterSection — the auth-gated area of the single page.
//   • Signed out  -> "Sign in with Google" prompt card.
//   • Signed in   -> <RegistrationForm /> (linked to user.id, stored in Supabase).
// =============================================================================
import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import AuthButton from "./AuthButton";
import RegistrationForm from "./RegistrationForm";
import GoogleIcon from "./GoogleIcon";
import { EVENT_CONFIG } from "@/config/event";

export default function RegisterSection() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <section id="register" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-14">
      <h2 className="mb-2 text-center text-2xl font-bold tracking-tight sm:text-3xl">
        Reserve Your <span className="gradient-text">Spot</span>
      </h2>
      <p className="mb-8 text-center text-sm text-text-muted">
        Sign in with Google, then complete the short registration form. It takes under a minute.
      </p>

      {/* One shared AuthButton instance so header-less layouts still show it */}
      {!user ? (
        // ------------------------------------------------ Signed-out state ----
        <div className="card flex flex-col items-center gap-6 p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 ring-1 ring-border">
            <GoogleIcon className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Sign in to register</h3>
            <p className="mt-2 text-sm text-text-muted">
              We use your Google account to verify you&apos;re a CYSCOM alumnus and to save
              your details securely. No password to remember — and{" "}
              {EVENT_CONFIG.name} is completely free.
            </p>
          </div>
          <AuthButton onUserChange={setUser} />
        </div>
      ) : (
        // -------------------------------------------------- Signed-in state ---
        <div className="mb-6 rounded-xl border border-border bg-surface/60 px-5 py-3 text-sm text-text-muted">
          ✓ Signed in as <span className="font-medium text-text">{user.email}</span> — complete
          the form below to confirm your attendance.
        </div>
      )}

      {user && <RegistrationForm key={user.id} user={user} />}
    </section>
  );
}
