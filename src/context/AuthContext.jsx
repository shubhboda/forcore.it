import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "support.forcor.it@gmail.com";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let subscription;
    try {
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const { data: profileData } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (!profileData && event === "SIGNED_IN") {
            await supabase.from("user_profiles").upsert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name,
              avatar_url: session.user.user_metadata?.avatar_url,
              role: session.user.email === "support.forcor.it@gmail.com" ? "admin" : "user",
            }, { onConflict: "id" });
          }
          const { data: updated } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          setProfile(updated ?? null);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );
      subscription = sub;
    } catch (err) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        let { data } = await supabase.from("user_profiles").select("*").eq("id", session.user.id).single();
        if (!data) {
          await supabase.from("user_profiles").upsert({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
            role: session.user.email === "support.forcor.it@gmail.com" ? "admin" : "user",
          }, { onConflict: "id" });
          const res = await supabase.from("user_profiles").select("*").eq("id", session.user.id).single();
          data = res.data;
        }
        setProfile(data ?? null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => { subscription?.unsubscribe?.(); };
  }, []);

  const signInWithGoogle = async () => {
    if (!supabase) throw new Error("Supabase not configured");
    return supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const signUp = async (email, password, metadata = {}) => {
    if (!supabase) throw new Error("Supabase not configured");
    return supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
  };

  const signIn = async (email, password) => {
    if (!supabase) throw new Error("Supabase not configured");
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setUser(null);
      setProfile(null);
      // Absolute nuclear cleanup: clear all local storage
      localStorage.clear();
      // Force a hard reload to the login page to guarantee state is wiped from memory
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
