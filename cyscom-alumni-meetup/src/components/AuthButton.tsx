"use client";

// =============================================================================
// AuthButton — "Sign in with Google" / signed-in user chip + Sign out.
// Listens to Supabase auth state changes so the whole page reacts to login.
// =============================================================================
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabaseClient";
import { signInWithGoogle } from "@/lib/auth";
import GoogleIcon from "./GoogleIcon";

interface AuthButtonProps {
  /** Called whenever the session user changes (null = signed out). */
  onUserChange: (user: User | null) => void;
}

export default function AuthButton({ onUserChange }: AuthButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore session + subscribe to auth changes.
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      onUserChange(data.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      onUserChange(u);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSignIn() {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle(); // browser redirects to Google
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed. Try again.");
      setSigningIn(false);
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    // onAuthStateChange fires -> user becomes null automatically.
  }

  if (loading) {
    return <div className="h-10 w-36 animate-pulse rounded-xl bg-surface-2" />;
  }

  if (user) {
    // Basic Google profile info captured at sign-in (name + email).
    const name =
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      user.email?.split("@")[0] ??
      "Alumnus";
    const initials = name
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-deep text-xs font-bold text-accent ring-1 ring-accent/40">
            {initials}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-text-muted">{user.email}</p>
          </div>
        </div>
        <button onClick={handleSignOut} className="btn-ghost">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button onClick={handleSignIn} disabled={signingIn} className="btn-primary">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
          <GoogleIcon className="h-4 w-4" />
        </span>
        {signingIn ? "Redirecting…" : "Sign in with Google"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
