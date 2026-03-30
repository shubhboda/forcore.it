import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Briefcase, CreditCard, MessageCircle, ArrowRight } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    plans: 0,
    contacts: 0,
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async (cancelledRef) => {
    if (!supabase) {
      return;
    }

    try {
      setError("");

      // Supabase free projects can be slow/cold-start; keep this generous.
      const timeoutMs = 30000;
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Dashboard request timed out (30s)")), timeoutMs)
      );

      const load = async () => {
        console.log("Dashboard: Starting stats load...");
        const results = await Promise.allSettled([
          supabase.from("user_profiles").select("id", { count: "exact", head: true }),
          supabase.from("projects").select("id", { count: "exact", head: true }),
          supabase.from("plans").select("id", { count: "exact", head: true }),
          supabase.from("contacts").select("id", { count: "exact", head: true }),
        ]);

        console.log("Dashboard: Raw results from allSettled:", results);

        const toValue = (r) => (r.status === "fulfilled" ? r.value : null);
        const usersRes = toValue(results[0]);
        const projectsRes = toValue(results[1]);
        const plansRes = toValue(results[2]);
        const contactsRes = toValue(results[3]);

        if (usersRes?.error) console.warn("Dashboard: user_profiles fetch error:", usersRes.error);
        if (projectsRes?.error) console.warn("Dashboard: projects fetch error:", projectsRes.error);
        if (plansRes?.error) console.warn("Dashboard: plans fetch error:", plansRes.error);
        if (contactsRes?.error) console.warn("Dashboard: contacts fetch error:", contactsRes.error);

        if (!cancelledRef.current) {
          setStats({
            users: usersRes?.count ?? 0,
            projects: projectsRes?.count ?? 0,
            plans: plansRes?.count ?? 0,
            contacts: contactsRes?.count ?? 0,
          });
        }

        const { data: contacts, error: contactsErr } = await supabase
          .from("contacts")
          .select("name, email, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (contactsErr) {
          console.error("Dashboard: contacts fetch error (recent):", contactsErr);
          throw contactsErr;
        }
        if (!cancelledRef.current) {
          console.log("Dashboard: Recent contacts fetched:", contacts?.length || 0);
          setRecentContacts(contacts ?? []);
        }
      };

      await Promise.race([load(), timeout]);
    } catch (err) {
      console.error("Dashboard stats error:", err);
      const msg =
        err?.message ||
        (typeof err === "string" ? err : "") ||
        "Failed to load dashboard data.";
      if (!cancelledRef.current) setError(msg);
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cancelledRef = { current: false };
    fetchStats(cancelledRef);
    return () => {
      cancelledRef.current = true;
    };
  }, [fetchStats]);

  const cards = [
    { label: "Total Users", value: stats.users, icon: Users },
    { label: "Projects", value: stats.projects, icon: Briefcase },
    { label: "Plans", value: stats.plans, icon: CreditCard },
    { label: "Messages Received", value: stats.contacts, icon: MessageCircle },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-pulse text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Dashboard</h2>
        <p className="text-gray-400">Overview of your forcore.it site</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
          <div className="mt-2 text-xs text-gray-400">
            This is usually a Supabase RLS/policy issue. Re-run the latest admin-policy SQL for
            <span className="text-gray-300"> shubhboda@gmail.com</span>.
          </div>
          <button
            type="button"
            onClick={() => fetchStats({ current: false })}
            className="mt-3 inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:border-cyan-400/30 hover:text-white text-xs"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className="w-8 h-8 text-cyan-400" />
              <span className="text-3xl font-bold text-white">{card.value}</span>
            </div>
            <p className="text-gray-400 text-sm">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Recent Messages</h3>
            <p className="text-sm text-gray-400 mt-1">User inquiries from the contact form</p>
          </div>
          <Link
            to="/admin/messages"
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentContacts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No submissions yet</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Name</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Email</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.map((c, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3 px-6 text-white">{c.name}</td>
                    <td className="py-3 px-6 text-gray-400">{c.email}</td>
                    <td className="py-3 px-6 text-gray-500 text-sm">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
