import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { ADMIN_EMAIL } from "../constants/auth";
import { AuthContext } from "./auth-context";

function buildProfilePayload(sessionUser) {
  const email = (sessionUser?.email || "").trim();
  return {
    id: sessionUser.id,
    email,
    full_name:
      sessionUser.user_metadata?.full_name || email.split("@")[0] || "User",
    avatar_url: sessionUser.user_metadata?.avatar_url || "",
    role: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "user",
    last_login_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const isAdmin = (user?.email || "").toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const syncProfileRecord = useCallback(async (sessionUser, options = {}) => {
    if (!supabase || !sessionUser?.id) {
      return { data: null, error: null };
    }

    const { touchLastLogin = false } = options;
    const payload = buildProfilePayload(sessionUser);

    try {
      const { data: existing, error: fetchErr } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", sessionUser.id)
        .maybeSingle();

      if (fetchErr) {
        console.error("AuthContext: Error fetching profile:", fetchErr);
      }

      const shouldUpsert =
        !existing ||
        existing.email !== payload.email ||
        existing.full_name !== payload.full_name ||
        existing.avatar_url !== payload.avatar_url ||
        existing.role !== payload.role ||
        touchLastLogin;

      if (shouldUpsert) {
        const mergedPayload = {
          ...(existing || {}),
          ...payload,
          last_login_at: touchLastLogin
            ? payload.last_login_at
            : existing?.last_login_at || payload.last_login_at,
          updated_at: new Date().toISOString(),
        };

        const { error: upsertErr } = await supabase
          .from("user_profiles")
          .upsert(mergedPayload, { onConflict: "id" });

        if (upsertErr) {
          console.error("AuthContext: Error syncing profile:", upsertErr);
          return { data: existing ?? null, error: upsertErr };
        }
      }

      const { data: refreshed, error: refreshedErr } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", sessionUser.id)
        .maybeSingle();

      if (refreshedErr) {
        console.error("AuthContext: Error reloading profile:", refreshedErr);
        const fallbackProfile = existing ?? {
          ...payload,
          last_login_at: touchLastLogin ? payload.last_login_at : null,
        };
        setProfile(fallbackProfile);
        return { data: fallbackProfile, error: refreshedErr };
      }

      setProfile(refreshed ?? null);
      return { data: refreshed ?? null, error: null };
    } catch (error) {
      console.error("AuthContext: syncProfileRecord failed:", error);
      return { data: null, error };
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) {
      setProfile(null);
      return { data: null, error: null };
    }

    return syncProfileRecord(user, { touchLastLogin: false });
  }, [syncProfileRecord, user]);

  const updateProfile = useCallback(async (updates = {}) => {
    if (!supabase || !user?.id) {
      return { data: null, error: new Error("You must be signed in to update your profile.") };
    }

    const basePayload = buildProfilePayload(user);
    const payload = {
      id: user.id,
      email: user.email,
      full_name: (updates.full_name || profile?.full_name || basePayload.full_name || "User").trim(),
      avatar_url: updates.avatar_url ?? profile?.avatar_url ?? basePayload.avatar_url ?? "",
      role: profile?.role || basePayload.role,
      last_login_at: profile?.last_login_at || basePayload.last_login_at,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(payload, { onConflict: "id" })
      .select("*")
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
    }

    return { data: data ?? null, error: error ?? null };
  }, [profile?.avatar_url, profile?.full_name, profile?.last_login_at, profile?.role, user]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let subscription;
    let profileLoadGeneration = 0;

    // Never let UI hang forever on "Loading..."
    const loadingFailSafe = setTimeout(() => {
      setLoading(false);
    }, 1500); // Reduced from 5000 to 1500 for faster perceived load

    const syncProfileAfterAuthEvent = async (event, sessionUser) => {
      const gen = ++profileLoadGeneration;
      if (!sessionUser?.id) return;

      try {
        await syncProfileRecord(sessionUser, {
          touchLastLogin: event === "SIGNED_IN" || event === "INITIAL_SESSION",
        });
      } finally {
        if (gen === profileLoadGeneration) {
          setLoading(false);
        }
      }
    };

    try {
      // Callback must be synchronous: async + await supabase here deadlocks signOut()
      // (GoTrue holds an exclusive lock until the callback promise settles).
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          profileLoadGeneration += 1;
          setProfile(null);
          setLoading(false);
          return;
        }
        queueMicrotask(() => {
          void syncProfileAfterAuthEvent(event, session.user);
        });
      });
      subscription = sub;
    } catch (err) {
      console.error("AuthContext: Catch block subscription err:", err);
      setLoading(false);
      clearTimeout(loadingFailSafe);
      return;
    }

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const session = data?.session ?? null;
        setUser(session?.user ?? null);

        if (session?.user) {
          await syncProfileRecord(session.user, { touchLastLogin: true });
        } else {
          setProfile(null);
        }
      } catch (e) {
        console.error("AuthContext: getSession/init error:", e);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
        clearTimeout(loadingFailSafe);
      }
    })();

    return () => {
      clearTimeout(loadingFailSafe);
      subscription?.unsubscribe?.();
    };
  }, [syncProfileRecord]);

  const signInWithGoogle = async () => {
    if (!supabase) throw new Error("Supabase not configured");
    const redirectTo = `${window.location.origin}/auth/callback`;
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });
  };

  const signUp = async (email, password, metadata = {}) => {
    if (!supabase) throw new Error("Supabase not configured");
    return supabase.auth.signUp({
      email: (email || "").trim(),
      password,
      options: { data: metadata },
    });
  };

  const signIn = async (email, password) => {
    if (!supabase) throw new Error("Supabase not configured");
    return supabase.auth.signInWithPassword({ email: (email || "").trim(), password });
  };

  const signOut = async () => {
    if (!supabase) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }
    
    try {
      console.log("AuthContext: Starting signOut...");
      await supabase.auth.signOut({ scope: "local" });
    } catch (error) {
      console.error("AuthContext: Sign out error:", error);
    } finally {
      setUser(null);
      setProfile(null);
      
      // Clear flag used by AdminLayout
      localStorage.removeItem("signing_out");
      
      // Absolute nuclear cleanup
      localStorage.clear();
      sessionStorage.clear();
      
      console.log("AuthContext: SignOut complete, redirecting...");
      
      // Force a hard reload
      setTimeout(() => {
        window.location.href = "/login";
      }, 50);
    }
  };

  const value = {
    user,
    profile,
    loading,
    isAdmin,
    isSupabaseConfigured: !!supabase,
    signInWithGoogle,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
