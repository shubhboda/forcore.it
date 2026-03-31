import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Mail, Save, Shield, User } from "lucide-react";
import LogoIcon from "../components/LogoIcon";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user, profile, loading, updateProfile, isAdmin } = useAuth();
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const displayName = useMemo(() => {
    return (
      profile?.full_name ||
      user?.user_metadata?.full_name ||
      user?.email?.split("@")[0] ||
      "User"
    );
  }, [profile?.full_name, user?.email, user?.user_metadata?.full_name]);

  useEffect(() => {
    setFullName(displayName);
  }, [displayName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const { error: updateError } = await updateProfile({
        full_name: fullName,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err?.message || "Profile update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-8 md:py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <LogoIcon className="w-10 h-10" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">My Profile</h1>
              <p className="text-sm text-gray-400">Signed in account details</p>
            </div>
          </div>

          <Link
            to={isAdmin ? "/admin" : "/"}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-cyan-400/30"
          >
            <Home className="w-4 h-4" />
            {isAdmin ? "Go to Admin" : "Back to Home"}
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/20"
          >
            <div className="w-20 h-20 rounded-full bg-cyan-500/15 text-cyan-400 flex items-center justify-center text-3xl font-bold mb-4">
              {displayName?.[0]?.toUpperCase() || "U"}
            </div>
            <h2 className="text-xl font-semibold text-white">{displayName}</h2>
            <p className="text-sm text-gray-400 mt-1 break-all">{user?.email || "No email"}</p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Role: {profile?.role || (isAdmin ? "admin" : "user")}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span className="break-all">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-4 h-4 text-cyan-400" />
                <span>ID: {user?.id?.slice(0, 8) || "—"}...</span>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 shadow-xl shadow-black/20 space-y-5"
          >
            <div>
              <h3 className="text-xl font-semibold text-white">Edit Profile</h3>
              <p className="text-sm text-gray-400 mt-1">
                Your signed-in profile is now connected to this account.
              </p>
            </div>

            {(error || success) && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm ${
                  error
                    ? "border-red-500/30 bg-red-500/10 text-red-300"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                }`}
              >
                {error || success}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Joined</label>
                <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleString() : "Just now"}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Last Login</label>
                <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                  {profile?.last_login_at ? new Date(profile.last_login_at).toLocaleString() : "Current session"}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
