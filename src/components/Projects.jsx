import { useEffect, useState } from "react";
import { ExternalLink, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { projects as fallbackProjects } from "../data/projects";

export default function Projects() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    async function fetchProjects() {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 5000)
      );

      try {
        const fetchPromise = supabase
          .from("projects")
          .select("*")
          .order("sort_order", { ascending: true });

        const { data, error } = await Promise.race([fetchPromise, timeout]);
        
        if (!error && data?.length) {
          setProjects(data.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            tags: p.tags ?? [],
            image: p.image_url,
          })));
        }
      } catch (err) {
        console.error("Failed to fetch projects or timed out:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-24 px-6 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-bold text-white mb-4">
            Our Work
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Projects we&apos;ve built for our clients.
          </p>
        </div>

        {loading && projects.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-white/[0.02] border border-white/5 aspect-video animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                whileHover={{ y: -10, rotateX: 2, rotateY: -2, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 transition-all shadow-[0_0_0_rgba(34,211,238,0)] hover:shadow-[0_20px_40px_-10px_rgba(34,211,238,0.3)] hover:border-cyan-400/50"
                style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
              >
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    />
                  ) : (
                    <LayoutGrid className="w-16 h-16 text-cyan-400/30 group-hover:scale-110 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent opacity-80" />
                </div>
                <div className="p-6 relative">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(project.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-[family-name:var(--font-syne)] text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    View Project <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
