import { Search, Palette, Code, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { id: 1, icon: Search, title: "Discovery & Requirement Analysis", description: "We dig deep into your goals, users, and constraints to define a clear roadmap." },
  { id: 2, icon: Palette, title: "Design & Planning", description: "Wireframes, prototypes, and architecture — everything mapped before we code." },
  { id: 3, icon: Code, title: "Development & Testing", description: "Agile sprints with regular demos. Quality-first with thorough testing." },
  { id: 4, icon: Rocket, title: "Delivery & Support", description: "Launch, handover, and ongoing support. We stay with you post-launch." },
];

export default function Process() {
  return (
    <section id="process" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0d0d1a] overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full min-w-0">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-[family-name:var(--font-syne)] text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 px-2">
            Our Process
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-2">
            Idea to launch with predictable milestones—structured discovery, visible progress, and zero mystery in delivery.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  key={step.id} 
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="relative z-10 w-16 h-16 rounded-full bg-[#0a0a0f] border-2 border-cyan-400/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:border-cyan-400">
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-500 text-black text-xs font-bold flex items-center justify-center">
                      {step.id}
                    </span>
                    <Icon className="w-7 h-7 text-cyan-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">{step.title}</h3>
                  <p className="text-gray-400 text-sm max-w-[240px]">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
