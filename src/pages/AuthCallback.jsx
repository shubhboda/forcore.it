import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ADMIN_EMAIL } from "../constants/auth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Completing sign in...");

  const hasSupabase = useMemo(() => !!supabase, []);

  useEffect(() => {
    let cancelled = false;

    async function finish() {
      if (!supabase) {
        setMessage("Supabase not configured.");
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const email = (data?.session?.user?.email || "").toLowerCase();
        if (!email) {
          setMessage("No session found. Please try signing in again.");
          setTimeout(() => navigate("/login", { replace: true }), 600);
          return;
        }

        if (cancelled) return;
        navigate(email === ADMIN_EMAIL.toLowerCase() ? "/admin" : "/", { replace: true });
      } catch (e) {
        if (cancelled) return;
        setMessage(e?.message || "Sign in failed. Please try again.");
        setTimeout(() => navigate("/login", { replace: true }), 800);
      }
    }

    finish();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/[0.03] border border-white/10 p-8 shadow-xl shadow-black/20">
        <div className="text-white text-lg font-semibold">Signing you in</div>
        <div className="mt-2 text-sm text-gray-400">{message}</div>
        {!hasSupabase && (
          <div className="mt-4 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            Add Supabase keys in <code className="bg-black/30 px-1 rounded">.env</code> and restart dev server.
          </div>
        )}
      </div>
    </div>
  );
}

