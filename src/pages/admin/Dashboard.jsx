import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    async function fetchStats() {
      try {
        const [usersRes, projectsRes, plansRes, contactsRes] = await Promise.all([
          supabase.from("user_profiles").select("id", { count: "exact", head: true }),
          supabase.from("projects").select("id", { count: "exact", head: true }),
          supabase.from("plans").select("id", { count: "exact", head: true }),
          supabase.from("contacts").select("id", { count: "exact", head: true }),
        ]);

        setStats({
          users: usersRes.count ?? 0,
          projects: projectsRes.count ?? 0,
          plans: plansRes.count ?? 0,
          contacts: contactsRes.count ?? 0,
        });

        const { data: contacts } = await supabase
          .from("contacts")
          .select("name, email, created_at")
          .order("created_at", { ascending: false })
          .limit(5);
        setRecentContacts(contacts ?? []);
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

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
