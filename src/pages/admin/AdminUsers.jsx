import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      if (!supabase) {
        setUsers([]);
        return;
      }
      const { data, error: err } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setUsers(data ?? []);
    } catch (e) {
      setError(e?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  if (!supabase) {
    return (
      <div className="p-6 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
        Supabase is not configured.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Users</h2>
        <p className="text-gray-400">All registered users</p>
      </div>

      <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
        {error && (
          <div className="m-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
            <button
              type="button"
              onClick={fetchUsers}
              className="ml-3 inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:border-cyan-400/30 hover:text-white text-xs"
            >
              Retry
            </button>
          </div>
        )}
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No users yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Email</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Name</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Role</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Joined</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3 px-6 text-white">{u.email}</td>
                    <td className="py-3 px-6 text-gray-400">{u.full_name || "—"}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "bg-white/10 text-gray-400"
                        }`}
                      >
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-gray-500 text-sm">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3 px-6 text-gray-500 text-sm">
                      {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
