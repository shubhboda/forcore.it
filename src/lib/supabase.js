import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

const isValidKey = supabaseAnonKey.length > 50 && !supabaseAnonKey.includes("your_");

function isConfiguredSupabaseUrl(url) {
  if (!url || url.includes("your-project")) return false;
  try {
    const u = new URL(url);
    if (u.protocol === "https:") return true;
    if (
      u.protocol === "http:" &&
      (u.hostname === "localhost" || u.hostname === "127.0.0.1")
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

const isValidUrl = isConfiguredSupabaseUrl(supabaseUrl);

let supabase = null;
// Never call createClient with empty strings — it throws "supabaseKey is required" and whites out the app.
if (
  isValidUrl &&
  isValidKey &&
  supabaseUrl.length > 8 &&
  supabaseAnonKey.length > 50
) {
  try {
    const fetchWithTimeout = (input, init) => {
      const controller = new AbortController();
      const timeoutMs = 30000;
      const id = setTimeout(() => controller.abort(), timeoutMs);

      const mergedInit = {
        ...(init || {}),
        signal: controller.signal,
      };

      return fetch(input, mergedInit).finally(() => clearTimeout(id));
    };

    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: fetchWithTimeout,
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // Hosted Supabase OAuth returns ?code= (PKCE). Default client flow is implicit and breaks Google login.
        flowType: "pkce",
      },
    });
  } catch (err) {
    console.warn("Supabase init failed:", err.message);
  }
}

export { supabase };
