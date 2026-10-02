"use client";

// =============================================================================
// RegistrationForm — shown only when a Supabase user is signed in.
// Submits to the `registrations` table via src/lib/registrations.ts.
// RLS guarantees the row can only belong to the signed-in user (user_id).
// =============================================================================
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { EVENT_CONFIG, DEGREE_SUGGESTIONS } from "@/config/event";
import {
  getMyRegistration,
  upsertRegistration,
  type RegistrationInput,
} from "@/lib/registrations";

interface Props {
  user: User;
}

type Status = "loading" | "editing" | "saving" | "success" | "error";

export default function RegistrationForm({ user }: Props) {
  // Pre-fill name/email from the Google profile captured by Supabase Auth.
  const googleName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    "";

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const [form, setForm] = useState<RegistrationInput>({
    full_name: googleName,
    email: user.email ?? "",
    phone: "",
    graduation_year: "",
    degree_department: "",
    company: "",
    job_title: "",
    notes: "",
  });

  // Graduation year options for the dropdown (newest first).
  const years = useMemo(() => {
    const list: string[] = [];
    for (let y = EVENT_CONFIG.graduationYearEnd; y >= EVENT_CONFIG.graduationYearStart; y--) {
      list.push(String(y));
    }
    return list;
  }, []);

  // Load an existing registration (if any) so users can review/edit it.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const existing = await getMyRegistration(user.id);
      if (cancelled) return;
      if (existing) {
        setForm({
          full_name: existing.full_name,
          email: existing.email,
          phone: existing.phone,
          graduation_year: existing.graduation_year,
          degree_department: existing.degree_department,
          company: existing.company ?? "",
          job_title: existing.job_title ?? "",
          notes: existing.notes ?? "",
        });
        setAlreadyRegistered(true);
      }
      setStatus("editing");
    })();
    return () => {
      cancelled = true;
    };
  }, [user.id]);

  function set<K extends keyof RegistrationInput>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage(null);

    const result = await upsertRegistration(user.id, form);

    if (result.ok) {
      setStatus("success");
      setAlreadyRegistered(true);
      window.setTimeout(
        () => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }),
        0
      );
    } else {
      setStatus("error");
      setMessage(result.message);
    }
  }

  if (status === "loading") {
    return (
      <div className="card p-8 text-center text-text-muted">
        Loading your details…
      </div>
    );
  }

  // ------------------------------------------------------------------ SUCCESS
  if (status === "success") {
    return (
      <div className="card p-8 text-center sm:p-12">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-deep/60 ring-2 ring-accent/40">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-accent" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-text">You&apos;re registered!</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-muted">
          Thanks, {form.full_name.split(" ")[0] || "friend"}. Your spot at{" "}
          <span className="text-text">{EVENT_CONFIG.name}</span> is saved. A confirmation
          will be sent to <span className="text-accent">{form.email}</span>.
        </p>
        <button onClick={() => setStatus("editing")} className="btn-ghost mt-6">
          Edit my registration
        </button>
      </div>
    );
  }

  // --------------------------------------------------------------------- FORM
  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-10">
      {alreadyRegistered && (
        <p className="mb-6 rounded-lg border border-accent/30 bg-accent-deep/20 px-4 py-3 text-xs text-accent">
          You already have a registration saved. Submitting again will update it.
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div className="sm:col-span-1">
          <label htmlFor="full_name" className="label">Full Name *</label>
          <input id="full_name" required value={form.full_name}
                 onChange={(e) => set("full_name", e.target.value)}
                 className="input" placeholder="Jane Perera" autoComplete="name" />
        </div>

        {/* Email (pre-filled from Google) */}
        <div className="sm:col-span-1">
          <label htmlFor="email" className="label">Email *</label>
          <input id="email" type="email" required value={form.email}
                 onChange={(e) => set("email", e.target.value)}
                 className="input" placeholder="you@example.com" autoComplete="email" />
          <p className="mt-1 text-[11px] text-text-muted">Pre-filled from your Google account.</p>
        </div>

        {/* Phone */}
        <div className="sm:col-span-1">
          <label htmlFor="phone" className="label">Phone Number *</label>
          <input id="phone" type="tel" required value={form.phone}
                 onChange={(e) => set("phone", e.target.value)}
                 className="input" placeholder="+94 77 123 4567" autoComplete="tel" />
        </div>

        {/* Graduation Year */}
        <div className="sm:col-span-1">
          <label htmlFor="graduation_year" className="label">Graduation Year *</label>
          <select id="graduation_year" required value={form.graduation_year}
                  onChange={(e) => set("graduation_year", e.target.value)}
                  className="input appearance-none">
            <option value="" disabled>Select year…</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Degree / Department */}
        <div className="sm:col-span-2">
          <label htmlFor="degree_department" className="label">Degree / Department *</label>
          <input id="degree_department" required list="degree-options"
                 value={form.degree_department}
                 onChange={(e) => set("degree_department", e.target.value)}
                 className="input" placeholder="e.g. B.Sc. Computer Science" />
          <datalist id="degree-options">
            {DEGREE_SUGGESTIONS.map((d) => <option key={d} value={d} />)}
          </datalist>
        </div>

        {/* Company */}
        <div className="sm:col-span-1">
          <label htmlFor="company" className="label">Current Company / Organization</label>
          <input id="company" value={form.company ?? ""}
                 onChange={(e) => set("company", e.target.value)}
                 className="input" placeholder="e.g. Acme Corp" autoComplete="organization" />
        </div>

        {/* Job Title */}
        <div className="sm:col-span-1">
          <label htmlFor="job_title" className="label">Current Job Title</label>
          <input id="job_title" value={form.job_title ?? ""}
                 onChange={(e) => set("job_title", e.target.value)}
                 className="input" placeholder="e.g. Software Engineer" autoComplete="organization-title" />
        </div>

        {/* Notes */}
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="label">Additional Notes / Comments (optional)</label>
          <textarea id="notes" rows={4} value={form.notes ?? ""}
                    onChange={(e) => set("notes", e.target.value)}
                    className="input resize-y"
                    placeholder="Dietary requirements, plus-ones, messages for the organizers…" />
        </div>
      </div>

      {status === "error" && message && (
        <p className="mt-5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Something went wrong while saving: {message}
        </p>
      )}

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-xs text-text-muted">
          By registering you agree to be contacted about the event. Free entry — no payment needed.
        </p>
        <button type="submit" disabled={status === "saving"} className="btn-primary w-full sm:w-auto">
          {status === "saving" ? "Saving…" : alreadyRegistered ? "Update Registration" : "Complete Registration"}
        </button>
      </div>
    </form>
  );
}
