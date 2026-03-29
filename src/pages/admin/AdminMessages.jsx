import { useEffect, useState } from "react";
import { MessageCircle, Mail, User, MapPin, DollarSign, FileText } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  async function fetchMessages() {
    setError("");
    try {
      if (!supabase) {
        setMessages([]);
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log("AdminMessages: Session active:", !!session);

      const { data, error: err } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("AdminMessages: Fetched data count:", data?.length || 0);

      if (err) {
        console.error("AdminMessages: Fetch error details:", err);
        throw err;
      }
      setMessages(data ?? []);
    } catch (e) {
      console.error("AdminMessages: Error caught:", e);
      setError(e?.message || "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchMessages();

    if (!supabase) return;

    // Real-time subscription for contacts
    const channel = supabase
      .channel("contacts-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contacts" },
        (payload) => {
          console.log("Real-time update received for contacts:", payload);
          fetchMessages(); // Refresh list on any change
        }
      )
      .subscribe((status) => {
        console.log("Contacts subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
        <h2 className="text-2xl font-bold text-white">Messages</h2>
        <p className="text-gray-400">User messages from the contact form (updates in real-time)</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
          <button
            type="button"
            onClick={fetchMessages}
            className="ml-3 inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:border-cyan-400/30 hover:text-white text-xs"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto">
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 text-center text-gray-500">
              No messages yet
            </div>
          ) : (
            messages.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  selected?.id === m.id
                    ? "bg-cyan-500/10 border-cyan-400/30"
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white truncate">{m.name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-400 truncate">{m.email}</p>
                {m.message && (
                  <p className="text-sm text-gray-500 truncate mt-1">{m.message}</p>
                )}
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                  <p className="text-cyan-400 text-sm mt-1">
                    {new Date(selected.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-cyan-400 shrink-0" />
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-gray-300 hover:text-cyan-400"
                  >
                    {selected.email}
                  </a>
                </div>
                {selected.country && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span className="text-gray-400">{selected.country}</span>
                  </div>
                )}
                {selected.project_type && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span className="text-gray-400">{selected.project_type}</span>
                  </div>
                )}
                {selected.budget && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span className="text-gray-400">{selected.budget}</span>
                  </div>
                )}
                {selected.message && (
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-sm text-gray-400 mb-2">Message</p>
                    <p className="text-white whitespace-pre-wrap">{selected.message}</p>
                  </div>
                )}
              </div>
              <a
                href={`mailto:${selected.email}?subject=Re: Your inquiry to forcore.it`}
                className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg bg-cyan-500 text-black font-medium hover:bg-cyan-400"
              >
                <Mail className="w-4 h-4" /> Reply via Email
              </a>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-12 text-center text-gray-500">
              Select a message to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
