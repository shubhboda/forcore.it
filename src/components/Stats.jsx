import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { value: "100%", label: "Client Satisfaction" },
  { value: "4", label: "Countries Served" },
  { value: null, icon: Sparkles, label: "AI-First Approach" },
];

const testimonials = [
  { name: "Sarah Mitchell", country: "🇺🇸 USA", rating: 5, quote: "Our AI assistant shipped early and runs like production infrastructure—not a demo. Rare blend of product thinking and engineering rigor." },
  { name: "James Chen", country: "🇬🇧 UK", rating: 5, quote: "They internalized our roadmap faster than most agencies—we moved from concept to shipped feature set without drama." },
  { name: "Emma Foster", country: "🇦🇺 Australia", rating: 5, quote: "The dashboard finally matches how our team works: fast, clear, and ready to grow with us." },
];

export default function Stats() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0d0d1a] overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full min-w-0">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-[family-name:var(--font-syne)] text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-2">
            Outcomes we stand behind—and partners who trust us with their next bold build.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              key={index} 
              className="text-center"
            >
              {stat.value !== null ? (
                <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">{stat.value}</div>
              ) : (
                <div className="flex justify-center mb-2">
                  {(() => {
                    const Icon = stat.icon;
                    return <Icon className="w-12 h-12 text-cyan-400" />;
                  })()}
                </div>
              )}
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              key={index} 
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/30 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 text-sm mb-4 italic">&quot;{testimonial.quote}&quot;</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{testimonial.name}</span>
                <span className="text-gray-500">{testimonial.country}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
