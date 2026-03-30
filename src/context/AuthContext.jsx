import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { ADMIN_EMAIL } from "../constants/auth";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const isAdmin = (user?.email || "").toLowerCase() === ADMIN_EMAIL.toLowerCase();

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
        const { data: profileData, error: fetchErr } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", sessionUser.id)
          .maybeSingle();

        if (fetchErr) {
          console.error("AuthContext: Error fetching profile on state change:", fetchErr);
        }

        if (
          gen === profileLoadGeneration &&
          !profileData &&
          (event === "SIGNED_IN" || event === "INITIAL_SESSION")
        ) {
          console.log("AuthContext: Attempting to create user profile...");
          const { error: upsertErr } = await supabase.from("user_profiles").upsert(
            {
              id: sessionUser.id,
              email: sessionUser.email,
              full_name:
                sessionUser.user_metadata?.full_name ||
                sessionUser.email?.split("@")[0] ||
                "User",
              avatar_url: sessionUser.user_metadata?.avatar_url || "",
              role:
                (sessionUser.email || "").toLowerCase() === ADMIN_EMAIL.toLowerCase()
                  ? "admin"
                  : "user",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

          if (upsertErr) {
            console.error("AuthContext: UPSERT ERROR creating profile:", upsertErr);
          } else {
            console.log("AuthContext: Successfully created profile inline");
          }
        }

        if (gen !== profileLoadGeneration) return;

        const { data: updated } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", sessionUser.id)
          .maybeSingle();
        if (gen === profileLoadGeneration) {
          setProfile(updated ?? null);
        }
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
          let { data: prof, error: fetchErr } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          if (fetchErr) {
            console.error("AuthContext: Error fetching profile on initial load:", fetchErr);
          }

          if (!prof) {
            console.log("AuthContext: No profile found on initial session load. Attempting upsert...");
            const { error: upsertErr } = await supabase.from("user_profiles").upsert(
              {
                id: session.user.id,
                email: session.user.email,
                full_name:
                  session.user.user_metadata?.full_name ||
                  session.user.email?.split("@")[0] ||
                  "User",
                avatar_url: session.user.user_metadata?.avatar_url || "",
                role:
                  (session.user.email || "").toLowerCase() ===
                  ADMIN_EMAIL.toLowerCase()
                    ? "admin"
                    : "user",
                updated_at: new Date().toISOString(),
              },
              { onConflict: "id" }
            );

            if (upsertErr) {
              console.error("AuthContext: UPSERT ERROR creating profile on initial load:", upsertErr);
            }

            const res = await supabase
              .from("user_profiles")
              .select("*")
              .eq("id", session.user.id)
              .maybeSingle();
            prof = res.data;
          }

          setProfile(prof ?? null);
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
  }, []);

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
