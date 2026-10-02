// =============================================================================
// Supabase SSR clients (server components / route handlers / middleware)
// -----------------------------------------------------------------------------
// Uses @supabase/ssr so auth cookies are read/written correctly on the server.
// Env vars come from .env.local — see .env.local.example.
// =============================================================================
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Client component tree variant: can READ cookies, cannot modify them. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            // Server Components cannot set cookies — safely ignore.
            // Middleware / route handlers refresh tokens instead.
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — token refresh handled by middleware.
          }
        },
      },
    }
  );
}
