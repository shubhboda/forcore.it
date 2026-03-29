import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

const notReady = () => ({ error: { message: "Authentication is not ready yet. Refresh the page." } });

/** Dev-only fallback avoids a blank screen when Vite Fast Refresh reloads modules out of order. */
const devFallback = {
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isSupabaseConfigured: false,
  signInWithGoogle: async () => notReady(),
  signUp: async () => notReady(),
  signIn: async () => notReady(),
  signOut: async () => {},
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx) return ctx;

  if (import.meta.env.DEV) {
    console.warn(
      "[useAuth] AuthProvider is missing (often a brief HMR glitch). If this persists, check main.jsx wraps the app with AuthProvider."
    );
    return devFallback;
  }

  throw new Error("useAuth must be used within AuthProvider");
}
