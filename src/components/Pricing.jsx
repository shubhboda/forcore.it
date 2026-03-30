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
    name: "Mobile & Ads", 
    tagline: "Apps & Digital Growth", 
    price: "$300 – $5000+", 
    features: [
      "Basic ($300-$800): Simple app / ads setup",
      "Standard ($800-$2000): App + ads + analytics",
      "Premium ($2000-$5000+): Custom App & High-level ads"
    ], 
    cta: "Scale My Brand", 
    popular: false 
  },
];

export default function Pricing() {
  const [plans, setPlans] = useState(fallbackPlans);
  const [loading, setLoading] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    async function fetchPlans() {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 5000)
      );

      try {
        const fetchPromise = supabase
          .from("plans")
          .select("*")
          .order("sort_order", { ascending: true });

        const { data, error } = await Promise.race([fetchPromise, timeout]);
        
        if (!error && data?.length) {
          setPlans(data.map((p) => ({
            id: p.id,
            name: p.name,
            tagline: p.tagline,
            price: p.price,
            features: Array.isArray(p.features) ? p.features : [],
            cta: p.cta ?? "Get Started",
            popular: p.popular ?? false,
          })));
        }
      } catch (err) {
        console.error("Failed to fetch plans or timed out:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  return (
    <section id="pricing" className="py-24 px-6 bg-[#0a0a0f] relative overflow-hidden">
      <BookCall isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-bold text-white mb-4">
            Our Pricing Plans
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Affordable solutions for your digital success. All prices in USD.
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
