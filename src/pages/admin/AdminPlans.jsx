import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    price: "",
    features: "",
    cta: "Get Started",
    popular: false,
  });

  useEffect(() => {
    if (!supabase) return;
    fetchPlans();
  }, []);

  async function fetchPlans() {
    setLoading(true);
    const { data, error } = await supabase
      ?.from("plans")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error) setPlans(data ?? []);
    setLoading(false);
  }

  const openAdd = () => {
    setEditing("new");
    setForm({
      name: "",
      tagline: "",
      price: "",
      features: "",
      cta: "Get Started",
      popular: false,
    });
  };

  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name,
      tagline: p.tagline ?? "",
      price: p.price ?? "",
      features: Array.isArray(p.features) ? p.features.join("\n") : "",
      cta: p.cta ?? "Get Started",
      popular: p.popular ?? false,
    });
  };

  const closeModal = () => setEditing(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const features = form.features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
    const payload = {
      name: form.name,
      tagline: form.tagline || null,
      price: form.price,
      features,
      cta: form.cta || "Get Started",
      popular: form.popular,
    };

    if (editing === "new") {
      const { error } = await supabase.from("plans").insert(payload);
      if (!error) {
        closeModal();
        fetchPlans();
      } else alert(error.message);
    } else {
      const { error } = await supabase.from("plans").update(payload).eq("id", editing);
      if (!error) {
        closeModal();
        fetchPlans();
      } else alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this plan?")) return;
    const { error } = await supabase.from("plans").delete().eq("id", id);
    if (!error) fetchPlans();
    else alert(error.message);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Pricing Plans</h2>
          <p className="text-gray-400">Manage plans shown on the site</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-black font-medium hover:bg-cyan-400"
        >
          <Plus className="w-4 h-4" /> Add Plan
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`rounded-2xl p-6 border ${
                p.popular
                  ? "bg-cyan-500/5 border-cyan-400/50"
                  : "bg-white/[0.02] border-white/5"
              }`}
            >
              {p.popular && (
                <span className="inline-block px-3 py-0.5 rounded-full bg-cyan-500 text-black text-xs font-semibold mb-4">
                  Popular
                </span>
              )}
              <h3 className="font-bold text-white text-lg mb-1">{p.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{p.tagline}</p>
              <p className="text-2xl font-bold text-cyan-400 mb-4">{p.price}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openEdit(p)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-cyan-400 hover:bg-cyan-500/10"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={closeModal}>
          <div
            className="w-full max-w-lg rounded-2xl bg-[#0d0d1a] border border-white/10 p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">
                {editing === "new" ? "Add Plan" : "Edit Plan"}
              </h3>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="Starter"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                  placeholder="Best for small projects"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Price</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  required
                  placeholder="$2K+ or Contact Us"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Features (one per line)
                </label>
                <textarea
                  value={form.features}
                  onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
                  rows={5}
                  placeholder="Feature 1&#10;Feature 2"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={form.cta}
                  onChange={(e) => setForm((f) => ({ ...f, cta: e.target.value }))}
                  placeholder="Get Started"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.popular}
                  onChange={(e) => setForm((f) => ({ ...f, popular: e.target.checked }))}
                  className="rounded border-white/20"
                />
                <span className="text-gray-300">Mark as Popular</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-cyan-500 text-black font-medium hover:bg-cyan-400"
                >
                  {editing === "new" ? "Add" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-white/20 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
