import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

const notReady = () => ({ error: { message: "Authentication is not ready yet. Refresh the page." } });

/**
 * Fallback when context is missing (HMR reorder, duplicate React copies, or mount edge cases).
 * Never throw from here — throwing blanks the UI below the provider.
 */
const missingProviderFallback = {
  user: null,
  profile: null,
  loading: false,
  isAdmin: false,
  isSupabaseConfigured: false,
  signInWithGoogle: async () => notReady(),
  signUp: async () => notReady(),
  signIn: async () => notReady(),
  signOut: async () => {},
  refreshProfile: async () => notReady(),
  updateProfile: async () => notReady(),
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx) return ctx;

  console.warn(
    "[useAuth] AuthProvider missing — using read-only fallback. If this persists, check main.jsx wraps the app with <AuthProvider>."
  );
  return missingProviderFallback;
}
