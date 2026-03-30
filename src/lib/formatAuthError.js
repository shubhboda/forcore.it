/**
 * Human-readable copy for Supabase Auth errors (OAuth, etc.).
 */
export function formatAuthError(err) {
  if (!err) return "Something went wrong.";
  let text = err.message ?? (typeof err === "string" ? err : "");
  if (!text && err.msg) text = String(err.msg);

  try {
    const parsed = JSON.parse(text);
    if (parsed?.msg) text = String(parsed.msg);
  } catch {
    /* keep text */
  }

  if (/missing OAuth secret|missing oauth secret/i.test(text)) {
    return "Google Client secret is missing in Supabase. Open Authentication → Providers → Google, paste the Client secret from Google Cloud Console (Credentials → your OAuth client), then click Save.";
  }

  if (/provider is not enabled/i.test(text)) {
    return "Google login is turned off in Supabase. Open Authentication → Providers → Google, enable it, and paste Client ID and Client secret.";
  }

  if (/Unsupported provider/i.test(text)) {
    return "Google OAuth setup in Supabase is incomplete. Check Authentication → Providers → Google: Client ID, Client secret (required), and Save.";
  }

  return text || "Request failed.";
}

/** Dashboard URL for Auth providers (from VITE_SUPABASE_URL project ref). */
export function supabaseAuthProvidersDashboardUrl() {
  const u = (import.meta.env.VITE_SUPABASE_URL || "").trim();
  const m = u.match(/^https:\/\/([a-z0-9-]+)\.supabase\.co\/?$/i);
  if (m) return `https://supabase.com/dashboard/project/${m[1]}/auth/providers`;
  return "https://supabase.com/dashboard/project/_/auth/providers";
}
