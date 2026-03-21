import { motion } from "framer-motion";
import { Search, Palette, Code, Rocket } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: Search,
    title: "Discovery & Requirement Analysis",
    description: "We dig deep into your goals, users, and constraints to define a clear roadmap.",
  },
  {
    id: 2,
    icon: Palette,
    title: "Design & Planning",
    description: "Wireframes, prototypes, and architecture — everything mapped before we code.",
  },
  {
    id: 3,
    icon: Code,
    title: "Development & Testing",
    description: "Agile sprints with regular demos. Quality-first with thorough testing.",
  },
  {
    id: 4,
    icon: Rocket,
    title: "Delivery & Support",
    description: "Launch, handover, and ongoing support. We stay with you post-launch.",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 px-6 bg-[#0d0d1a]/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-bold text-white mb-4">
            Our Process
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From idea to launch — a proven workflow that keeps projects on track.
          </p>
        </motion.div>

        <div className="relative">
          {/* Desktop: horizontal timeline with connecting line */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 w-16 h-16 rounded-full bg-[#0a0a0f] border-2 border-cyan-400/50 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-500 text-black text-xs font-bold flex items-center justify-center">
                      {step.id}
                    </span>
                    <Icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm max-w-[240px]">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
