// =============================================================================
// OAuth callback route: GET /auth/callback?code=...
// -----------------------------------------------------------------------------
// Supabase redirects here after Google sign-in. We exchange the one-time
// `code` for a user session (stored in cookies), then return to the home page.
// =============================================================================
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // If "next" was stored as a query param before OAuth, honor it (defaults to "/").
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("exchangeCodeForSession failed:", error.message);
  }

  // Auth failed — bounce back home with an error flag the UI can show.
  return NextResponse.redirect(`${origin}/?auth_error=1`);
}
