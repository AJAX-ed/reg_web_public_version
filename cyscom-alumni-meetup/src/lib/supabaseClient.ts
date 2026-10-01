// =============================================================================
// Supabase browser client (client-side components)
// -----------------------------------------------------------------------------
// Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from
// .env.local — see .env.local.example for where to find these values in the
// Supabase dashboard.
// =============================================================================
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
