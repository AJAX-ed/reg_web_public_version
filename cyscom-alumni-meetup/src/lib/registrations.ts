// =============================================================================
// Registration data access layer (client-side, anon key + user session).
// RLS in Postgres guarantees a user can only touch their own row.
// Add new queries here as the app grows — keep components free of DB details.
// =============================================================================
import { createClient } from "@/lib/supabaseClient";

/** Shape of a row in the public.registrations table. */
export interface RegistrationRecord {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  graduation_year: string;
  degree_department: string;
  company: string | null;
  job_title: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** Form values collected by <RegistrationForm />. */
export interface RegistrationInput {
  full_name: string;
  email: string;
  phone: string;
  graduation_year: string;
  degree_department: string;
  company?: string;
  job_title?: string;
  notes?: string;
}

/**
 * Fetch the signed-in user's existing registration, if any.
 * Returns null when not registered yet or on network/auth errors.
 */
export async function getMyRegistration(
  userId: string
): Promise<RegistrationRecord | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("getMyRegistration:", error.message);
    return null;
  }
  return data as RegistrationRecord | null;
}

/**
 * Insert (or update) the signed-in user's registration.
 * The row is always linked to `userId`; RLS rejects mismatched ids.
 */
export async function upsertRegistration(
  userId: string,
  input: RegistrationInput
): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = createClient();

  const row = {
    user_id: userId, // links the submission to the authenticated user
    full_name: input.full_name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    graduation_year: input.graduation_year,
    degree_department: input.degree_department.trim(),
    company: input.company?.trim() || null,
    job_title: input.job_title?.trim() || null,
    notes: input.notes?.trim() || null,
  };

  const { error } = await supabase.from("registrations").upsert(row, {
    onConflict: "user_id", // relies on the unique index in the SQL migration
  });

  if (error) {
    console.error("upsertRegistration:", error.message);
    return { ok: false, message: error.message };
  }
  return { ok: true };
}
