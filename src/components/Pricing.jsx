import { useEffect, useState } from "react";
import { Sparkles, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import BookCall from "./BookCall";

const fallbackPlans = [
  { 
    id: 1, 
    name: "Web & UI/UX", 
    tagline: "Custom websites & modern designs", 
    price: "$100 – $3000+", 
    features: [
      "Basic ($100-$400): Simple website, basic design",
      "Standard ($400-$1000): Custom UI, responsive, SEO",
      "Premium ($1000-$3000+): Advanced UI, animations, integrations"
    ], 
    cta: "Start Web Project", 
    popular: false 
  },
  { 
    id: 2, 
    name: "AI & Automation", 
    tagline: "Smart AI agents & n8n workflows", 
    price: "$200 – $7000+", 
    features: [
      "Basic ($200-$600): Simple chatbot / automation",
      "Standard ($600-$2000): AI chatbot + workflows + APIs",
      "Premium ($2000-$7000+): Custom AI tools, LLM, SaaS-level"
    ], 
    cta: "Build AI System", 
    popular: true 
  },
  { 
    id: 3, 
    name: "Android & iOS Apps", 
    tagline: "High-performance mobile solutions", 
    price: "$500 – $8000+", 
    features: [
      "Basic ($500-$1500): Simple MVP / Utility App",
      "Standard ($1500-$4000): Full App + Backend + Play Store",
      "Premium ($4000-$8000+): Scalable App, Custom Features, Support"
    ], 
    cta: "Build My App", 
    popular: false 
  },
  { 
    id: 4, 
    name: "Video Editing", 
    tagline: "Professional cinematic storytelling", 
    price: "$50 – $1500+", 
    features: [
      "Basic ($50-$200): Simple cuts, basic transitions",
      "Standard ($200-$600): Color grading, audio sync, titles",
      "Premium ($600-$1500+): Complex VFX, motion graphics, 4K"
    ], 
    cta: "Start My Video", 
    popular: false 
  },
  { 
    id: 5, 
    name: "Digital Marketing", 
    tagline: "Full-scale brand growth & strategy", 
    price: "$200 – $5000+", 
    features: [
      "Basic ($200-$700): Social media setup, basic SEO",
      "Standard ($700-$2000): Ads management, content strategy",
      "Premium ($2000-$5000+): Growth funnels, full-funnel ads"
    ], 
    cta: "Scale My Business", 
    popular: false 
  },
];

export default function Pricing() {
  const [plans, setPlans] = useState(fallbackPlans);
  const [loading, setLoading] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    async function fetchPlans() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("plans")
          .select("*")
          .order("sort_order", { ascending: true });
        
        // If we have data in Supabase (even if just one plan), show it
        if (!error && data && data.length > 0) {
          setPlans(data.map((p) => ({
            id: p.id,
            name: p.name,
            tagline: p.tagline,
            price: p.price,
            features: Array.isArray(p.features) ? p.features : [],
            cta: p.cta ?? "Get Started",
            popular: p.popular ?? false,
          })));
        } else if (error) {
          console.error("Supabase error:", error.message);
        }
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0a0a0f] relative overflow-x-hidden">
      <BookCall isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <div className="max-w-7xl mx-auto w-full min-w-0">
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-syne)] text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Our Pricing Plans
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-2">
            Transparent tiers, serious outcomes—investment that maps to scope and value. Figures shown in USD.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl p-6 md:p-8 border flex flex-col h-full ${
                plan.popular 
                  ? "bg-cyan-500/5 border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.1)]" 
                  : "bg-white/[0.02] border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-black text-xs font-bold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.tagline}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {(plan.features || []).map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setIsBookingOpen(true)}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Book Free Call
                <Calendar className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
