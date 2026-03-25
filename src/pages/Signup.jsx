import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import LogoIcon from "../components/LogoIcon";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signUp, signInWithGoogle, isAdmin, user, loading, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate(isAdmin ? "/admin" : "/", { replace: true });
    }
  }, [user, loading, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data, error: err } = await signUp(email, password, { full_name: fullName });
      if (err) throw err;
      if (data?.user) {
        const isAdminUser = data.user.email === "support.forcor.it@gmail.com";
        navigate(isAdminUser ? "/admin" : "/", { replace: true });
      } else {
        setError("Please check your email to confirm your account.");
      }
    } catch (err) {
      const msg = err.message || "Signup failed";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setSubmitting(true);
    try {
      const { error: err } = await signInWithGoogle();
      if (err) throw err;
    } catch (err) {
      setError(err.message || "Google signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  const showSetupBox = !isSupabaseConfigured || error?.includes("Supabase not configured");

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-8 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2 mb-8">
            <LogoIcon className="w-10 h-10" />
            <span className="font-[family-name:var(--font-syne)] font-bold text-2xl text-white tracking-tight">
              forcore<span className="text-[#3D87F5]">.it</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
          <p className="text-gray-400 text-sm mb-6">Join forcore.it to get started</p>

          <AnimatePresence mode="wait">
            {(showSetupBox || (error && !error.includes("Supabase"))) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className={`mb-4 p-4 rounded-lg text-sm overflow-hidden ${
                  showSetupBox
                    ? "bg-amber-500/10 border border-amber-500/30 text-amber-300"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                {showSetupBox ? "Supabase not configured" : error}
              {error?.includes("Database error") && (
                <div className="mt-3 pt-3 border-t border-red-500/20 space-y-2">
                  <p className="text-xs text-white font-medium">Fix: Supabase Dashboard → SQL Editor → paste & run:</p>
                  <pre className="text-[10px] bg-black/40 p-2 rounded overflow-x-auto text-cyan-300">{`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP POLICY IF EXISTS "Allow insert own profile" ON user_profiles;
CREATE POLICY "Allow insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);`}</pre>
                </div>
              )}
                {showSetupBox && (
                  <div className="mt-3 pt-3 border-t border-amber-500/20 space-y-1.5 text-xs">
                    <p className="font-medium text-white">Setup steps:</p>
                    <ol className="list-decimal list-inside space-y-1 text-gray-400">
                      <li>
                        <a
                          href="https://supabase.com/dashboard/project/gtcxacyuinnuonjjxhwh/settings/api"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline"
                        >
                          Open Supabase API Settings →
                        </a>
                      </li>
                      <li>Copy <strong className="text-amber-300">anon public</strong> key and paste in .env</li>
                      <li>Run <code className="bg-black/30 px-1 rounded">supabase/SETUP_QUERIES.sql</code> in SQL Editor</li>
                      <li>Restart: <code className="bg-black/30 px-1 rounded">npm run dev</code></li>
                    </ol>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {["fullName", "email", "password"].map((field, i) => (
              <motion.div
                key={field}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.3 }}
              >
                {field === "fullName" && (
                  <>
                    <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                      />
                    </div>
                  </>
                )}
                {field === "email" && (
                  <>
                    <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                      />
                    </div>
                  </>
                )}
                {field === "password" && (
                  <>
                    <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        required
                        minLength={6}
                        className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
            <motion.button
              type="submit"
              disabled={submitting || !isSupabaseConfigured}
              whileHover={isSupabaseConfigured ? { scale: 1.01 } : {}}
              whileTap={isSupabaseConfigured ? { scale: 0.99 } : {}}
              className="w-full py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {submitting ? "Creating account..." : "Sign Up"}
            </motion.button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#0c0c14] text-gray-500">or continue with</span>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={handleGoogleSignup}
            disabled={submitting || !isSupabaseConfigured}
            whileHover={isSupabaseConfigured ? { scale: 1.01 } : {}}
            whileTap={isSupabaseConfigured ? { scale: 0.99 } : {}}
            className="w-full py-3 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </motion.button>

          <p className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
