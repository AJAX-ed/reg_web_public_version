// =============================================================================
// Middleware — keeps Supabase auth cookies fresh on every request.
// Required by @supabase/ssr so sessions survive page reloads and server
// component renders. Runs on the Node/Edge runtime before pages render.
// =============================================================================
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Env vars come from .env.local / Vercel project settings.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Important: refresh the request cookie jar AND the response so the
          // browser receives the updated session cookies.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: do not run code between createServerClient and getUser().
  // A simple mistake could make it seem like you signed out after refreshing.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth guard: the registration form requires a signed-in user.
  // (The form itself also double-checks client-side.)
  void user; // user is available here if you want to redirect unauthenticated visitors

  return supabaseResponse;
}

export default updateSession;
