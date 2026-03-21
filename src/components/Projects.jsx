import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, LayoutGrid } from "lucide-react";
import { projects } from "../data/projects";

const filters = ["All", "AI", "Web", "Mobile", "Design"];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.tags.includes(activeFilter));

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-bold text-white mb-4">
            Our Work
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            A selection of projects we've built for clients worldwide.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? "bg-cyan-500 text-black"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,212,255,0.08)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-video bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                  <LayoutGrid className="w-16 h-16 text-cyan-400/30" />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-xs bg-cyan-400/10 text-cyan-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold text-white mb-2">
                    {project.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:gap-3 transition-all"
                  >
                    View Project
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
