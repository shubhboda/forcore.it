import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, BarChart3, Users, Layout, Smartphone } from "lucide-react";

export default function FeatureSection() {
  const metrics = [
    { label: "Positive Business Impact", value: "10.5%", icon: TrendingUp },
    { label: "Happy Clients Worldwide", value: "2k+", icon: Users },
    { label: "Market Leadership Position", value: "26%", icon: BarChart3 },
    { label: "Successful Projects Done", value: "10k+", icon: Layout },
  ];

  return (
    <section className="relative py-24 bg-[#0a0a0f] overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              We elevate your <br />
              <span className="text-cyan-400">business</span> to new levels.
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed">
              Your problems aren’t generic—neither are our builds. We pair modern stack choices with clear ownership so you scale with confidence, not guesswork.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-16">
              <a 
                href="#contact" 
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all active:scale-95 inline-block"
              >
                Get Started
              </a>
            </div>

            <div>
              <p className="text-gray-500 text-sm font-medium mb-6 uppercase tracking-wider">
                Trusted by 1,000+ leading companies worldwide.
              </p>
              <div className="flex flex-wrap gap-8 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2 text-white font-bold text-lg">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Content - Visual Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center items-center"
          >
            {/* Main Phone Mockup */}
            <div className="relative z-20 w-full max-w-[280px] sm:max-w-[320px] aspect-[9/19] bg-[#1a1a2e] rounded-[2.5rem] md:rounded-[3rem] border-[6px] md:border-[8px] border-white/5 shadow-2xl overflow-hidden">
              <div className="p-6 h-full bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a]">
                <div className="flex justify-between items-center mb-8">
                  <div className="w-12 h-2 bg-white/10 rounded-full" />
                  <div className="w-4 h-4 bg-cyan-500/20 rounded-full" />
                </div>
                <div className="space-y-4">
                  <div className="h-32 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 p-4">
                    <p className="text-[10px] text-cyan-400 font-bold uppercase mb-1">Total Income</p>
                    <p className="text-xl font-bold text-white">$50.3 M</p>
                    <div className="mt-4 flex gap-1 items-end h-8">
                      {[40, 70, 50, 90, 60, 80].map((h, i) => (
                        <div key={i} className="flex-1 bg-cyan-500/20 rounded-t-sm" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-white/5 rounded-xl border border-white/5 flex items-center px-4 gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/10" />
                        <div className="flex-1 h-2 bg-white/10 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards - Hidden on small mobile */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 -left-4 md:-left-12 z-30 p-3 md:p-4 bg-purple-500 rounded-2xl shadow-xl max-w-[140px] md:max-w-[160px] hidden sm:block"
            >
              <p className="text-[9px] md:text-[10px] font-bold text-white/70 uppercase mb-1">Opportunity</p>
              <p className="text-xs md:text-sm font-bold text-white mb-2">User-Friendly</p>
              <p className="text-[9px] md:text-[10px] text-white/60">Connect user-friendly telehealth platform.</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 -right-4 md:-right-8 z-30 p-3 md:p-4 bg-white rounded-2xl shadow-xl max-w-[140px] md:max-w-[160px] hidden sm:block"
            >
              <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase mb-1">Overview</p>
              <div className="h-12 md:h-16 w-full bg-gray-100 rounded-lg flex items-end p-2 gap-1">
                {[30, 50, 80, 40].map((h, i) => (
                  <div key={i} className="flex-1 bg-cyan-500 rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Metrics Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/10">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#0d0d1a] p-10 flex flex-col items-center text-center group hover:bg-white/[0.03] transition-colors"
            >
              <metric.icon className="w-8 h-8 text-cyan-400 mb-6 group-hover:scale-110 transition-transform" />
              <p className="text-4xl font-bold text-white mb-4">{metric.value}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
