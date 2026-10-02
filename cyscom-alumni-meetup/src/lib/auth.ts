// =============================================================================
// Auth helper — starts the Google OAuth flow via Supabase Auth.
// Called from the "Sign in with Google" button (client component).
// =============================================================================
import { createClient } from "@/lib/supabaseClient";

export async function signInWithGoogle() {
  const supabase = createClient();

  // Where Supabase should send the browser after Google approves the login.
  // This route handler exchanges the OAuth code for a session cookie.
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google", // must be enabled in Supabase Dashboard -> Auth -> Providers
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
      queryParams: {
        // Ask Google to re-prompt so users can switch accounts easily.
        prompt: "select_account",
      },
    },
  });

  if (error) {
    console.error("Google sign-in error:", error.message);
    throw error;
  }
  // On success the browser is redirected to Google's consent screen.
}
