import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { supabase } from "../../lib/supabase";

const BUCKET = "project-images";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ name: "", description: "", tags: "", image_url: "" });

  useEffect(() => {
    if (!supabase) return;
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase
      ?.from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error) setProjects(data ?? []);
    setLoading(false);
  }

  const openAdd = () => {
    setEditing("new");
    setForm({ name: "", description: "", tags: "", image_url: "" });
  };

  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      tags: (p.tags ?? []).join(", "),
      image_url: p.image_url ?? "",
    });
  };

  const closeModal = () => setEditing(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
      setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
    } catch (err) {
      alert(err.message || "Upload failed. Create bucket 'project-images' in Supabase Storage.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = {
      name: form.name,
      description: form.description || null,
      tags,
      image_url: form.image_url || null,
    };

    if (editing === "new") {
      const { error } = await supabase.from("projects").insert(payload);
      if (!error) {
        closeModal();
        fetchProjects();
      } else alert(error.message);
    } else {
      const { error } = await supabase.from("projects").update(payload).eq("id", editing);
      if (!error) {
        closeModal();
        fetchProjects();
      } else alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) fetchProjects();
    else alert(error.message);
  };

  if (!supabase) {
    return (
      <div className="p-6 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
        Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Our Work</h2>
          <p className="text-gray-400">Manage projects shown on the site</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-black font-medium hover:bg-cyan-400"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden"
            >
              <div className="aspect-video bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-gray-600">📁</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white mb-2">{p.name}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{p.description}</p>
                <div className="flex gap-2">
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
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={closeModal}>
          <div
            className="w-full max-w-lg rounded-2xl bg-[#0d0d1a] border border-white/10 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">
                {editing === "new" ? "Add Project" : "Edit Project"}
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
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="Web, AI, UI/UX"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Project Image</label>
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-cyan-400/30"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                    placeholder="Or paste URL"
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500"
                  />
                </div>
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="mt-2 w-full h-24 object-cover rounded-lg border border-white/10"
                  />
                )}
              </div>
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
