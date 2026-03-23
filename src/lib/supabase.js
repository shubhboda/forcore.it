import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

const isValidKey = supabaseAnonKey.length > 50 && !supabaseAnonKey.includes("your_");
const isValidUrl = supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("your-project");

let supabase = null;
if (isValidUrl && isValidKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn("Supabase init failed:", err.message);
  }
}

export { supabase };
