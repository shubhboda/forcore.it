import { useEffect, useState } from "react";
import { Check, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

const fallbackPlans = [
  { id: 1, name: "Starter", tagline: "Best for small projects & MVPs", price: "Contact Us", features: ["Up to 5 pages / basic features", "Responsive design", "1 revision round", "Basic SEO setup", "2 weeks delivery"], cta: "Get Started", popular: false },
  { id: 2, name: "Growth", tagline: "Best for growing businesses", price: "$2K+", features: ["Up to 15 pages / advanced features", "AI integration (basic)", "3 revision rounds", "Full SEO + analytics", "Priority support", "4 weeks delivery"], cta: "Start a Project", popular: true },
  { id: 3, name: "Enterprise", tagline: "For large & complex systems", price: "Custom Quote", features: ["Unlimited scope", "Full AI/ML integration", "Custom architecture", "Dedicated team", "Ongoing maintenance", "Custom timeline"], cta: "Get a Custom Quote", popular: false },
];

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      if (supabase) {
        const { data, error } = await supabase
          .from("plans")
          .select("*")
          .order("sort_order", { ascending: true });
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
        } else {
          setPlans(fallbackPlans);
        }
      } else {
        setPlans(fallbackPlans);
      }
      setLoading(false);
    }
    fetchPlans();
  }, []);

  return (
    <section id="pricing" className="py-24 px-6 bg-[#0d0d1a]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Pick the plan that fits your project. No hidden fees.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-white/[0.02] border border-white/5 p-8 h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 ${
                  plan.popular
                    ? "bg-cyan-500/5 border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                    : "bg-white/[0.02] border border-white/5 hover:border-cyan-400/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-1 rounded-full bg-cyan-500 text-black text-sm font-semibold">
                    <Zap className="w-4 h-4" />
                    Most Popular
                  </div>
                )}
                <h3 className="font-[family-name:var(--font-syne)] text-xl font-bold text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-gray-400 text-sm mb-6">{plan.tagline}</p>
                <div className="text-2xl font-bold text-cyan-400 mb-6">{plan.price}</div>
                <ul className="space-y-3 mb-8">
                  {(plan.features || []).map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-gray-300 text-sm">
                      <Check className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`block w-full py-3 rounded-lg text-center font-medium transition-colors ${
                    plan.popular
                      ? "bg-cyan-500 text-black hover:bg-cyan-400"
                      : "border border-white/20 text-white hover:border-cyan-400/50 hover:bg-cyan-400/5"
                  }`}
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
