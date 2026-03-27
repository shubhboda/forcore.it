import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

const isValidKey = supabaseAnonKey.length > 50 && !supabaseAnonKey.includes("your_");
const isValidUrl = supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("your-project");

let supabase = null;
if (isValidUrl && isValidKey) {
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
      },
    });
  } catch (err) {
    console.warn("Supabase init failed:", err.message);
  }
}

export { supabase };
