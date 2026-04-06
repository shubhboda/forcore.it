import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ADMIN_EMAIL } from "../constants/auth";

function readOAuthErrorFromUrl() {
  try {
    const u = new URL(window.location.href);
    const fromSearch =
      u.searchParams.get("error_description") || u.searchParams.get("error");
    if (fromSearch) {
      return decodeURIComponent(fromSearch.replace(/\+/g, " "));
    }
    if (u.hash?.length > 1) {
      const hp = new URLSearchParams(u.hash.slice(1));
      const fromHash = hp.get("error_description") || hp.get("error");
      if (fromHash) return decodeURIComponent(fromHash.replace(/\+/g, " "));
    }
  } catch {
    /* ignore */
  }
  return null;
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Completing sign in...");
  const didNavigate = useRef(false);

  const hasSupabase = useMemo(() => !!supabase, []);

  useEffect(() => {
    let cancelled = false;

    if (!supabase) {
      setMessage("Supabase not configured.");
      return undefined;
    }

    const go = (session) => {
      if (cancelled || didNavigate.current || !session?.user) return;
      const email = (session.user.email || "").toLowerCase();
      if (!email) return;
      didNavigate.current = true;
      navigate(email === ADMIN_EMAIL.toLowerCase() ? "/admin" : "/profile", { replace: true });
    };

    async function finish() {
      const urlError = readOAuthErrorFromUrl();
      if (urlError) {
        setMessage(urlError);
        setTimeout(() => {
          if (cancelled || didNavigate.current) return;
          navigate("/login", { replace: true });
        }, 2000);
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        go(data?.session ?? null);
        if (!cancelled && !didNavigate.current && !data?.session) {
          setMessage("No session found. Please try signing in again.");
          setTimeout(() => {
            if (cancelled || didNavigate.current) return;
            navigate("/login", { replace: true });
          }, 1200);
        }
      } catch (e) {
        if (cancelled) return;
        setMessage(e?.message || "Sign in failed. Please try again.");
        setTimeout(() => {
          if (cancelled || didNavigate.current) return;
          navigate("/login", { replace: true });
        }, 1500);
      }
    }

    const { data: subData } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        go(session);
      }
    });

    void finish();

    const failSafe = setTimeout(() => {
      if (cancelled || didNavigate.current) return;
      void supabase.auth.getSession().then(({ data }) => {
        if (cancelled || didNavigate.current) return;
        if (data?.session) go(data.session);
        else {
          setMessage("Sign in timed out. Try again.");
          navigate("/login", { replace: true });
        }
      });
    }, 15000);

    return () => {
      cancelled = true;
      clearTimeout(failSafe);
      subData?.subscription?.unsubscribe?.();
    };
  }, [navigate]);

  return (
    <div className="min-h-[100dvh] min-h-screen w-full bg-[#0a0a0f] flex items-center justify-center px-4 py-8 sm:p-6 overflow-x-hidden">
      <div className="w-full max-w-md min-w-0 rounded-2xl bg-white/[0.03] border border-white/10 p-5 sm:p-8 shadow-xl shadow-black/20">
        <div className="text-white text-base sm:text-lg font-semibold">Signing you in</div>
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

