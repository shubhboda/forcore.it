import { ExternalLink, LayoutGrid } from "lucide-react";
import { projects } from "../data/projects";

export default function Projects() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-2xl mx-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden hover:border-cyan-400/30"
            >
              <div className="aspect-video bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                <LayoutGrid className="w-16 h-16 text-cyan-400/30" />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-cyan-400/10 text-cyan-400">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold text-white mb-2">{project.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                <a href="#contact" className="inline-flex items-center gap-2 text-sm text-cyan-400">
                  View Project
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
