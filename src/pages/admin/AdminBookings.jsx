import { useEffect, useState } from "react";
import { Calendar, Mail, User, MapPin, Clock, FileText, Trash2, CheckCircle2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  async function fetchBookings() {
    setError("");
    try {
      if (!supabase) {
        setBookings([]);
        return;
      }
      
      // Explicitly check for session
      const { data: { session } } = await supabase.auth.getSession();
      console.log("AdminBookings: Current session:", session ? "Active" : "None");

      const { data, error: err } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      
      console.log("AdminBookings: Fetched data length:", data?.length || 0);
      if (err) {
        console.error("AdminBookings: Fetch error details:", err);
        throw err;
      }
      setBookings(data ?? []);
    } catch (e) {
      console.error("AdminBookings: Catch error:", e);
      setError(e?.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchBookings();

    if (!supabase) return;

    // Real-time subscription for bookings
    const channel = supabase
      .channel("bookings-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        (payload) => {
          console.log("Real-time update received for bookings:", payload);
          fetchBookings(); // Refresh list on any change
        }
      )
      .subscribe((status) => {
        console.log("Bookings subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      const { error: err } = await supabase.from("bookings").delete().eq("id", id);
      if (err) throw err;
      setBookings(bookings.filter((b) => b.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (e) {
      alert(e.message);
    }
  };

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
        <h2 className="text-2xl font-bold text-white">Free Strategy Calls</h2>
        <p className="text-gray-400">Scheduled bookings from the &quot;Book Free Call&quot; form</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
          <button
            type="button"
            onClick={fetchBookings}
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
          ) : bookings.length === 0 ? (
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 text-center text-gray-500">
              No bookings yet
            </div>
          ) : (
            bookings.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelected(b)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  selected?.id === b.id
                    ? "bg-cyan-500/10 border-cyan-400/30"
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white truncate">{b.name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(b.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{b.date}</span>
                  <span className="text-gray-600">|</span>
                  <Clock className="w-3 h-3" />
                  <span>{b.time}</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{selected.name}</h3>
                  <p className="text-gray-400 text-sm">Booking ID: {selected.id}</p>
                </div>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Delete booking"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                      <p>{selected.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Location</p>
                      <p>{selected.location || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Scheduled Date</p>
                      <p>{selected.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Time Slot</p>
                      <p>{selected.time}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <FileText className="w-5 h-5" />
                  <span className="font-bold uppercase text-xs tracking-widest">Type of Work / Inquiry</span>
                </div>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selected.work_type || "No specific details provided."}
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-4">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex-1 py-3 px-6 rounded-xl bg-cyan-500 text-black font-bold text-center hover:bg-cyan-400 transition-colors"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 rounded-2xl bg-white/[0.01] border border-dashed border-white/5 text-gray-500">
              <Calendar className="w-12 h-12 mb-4 opacity-20" />
              <p>Select a booking to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
