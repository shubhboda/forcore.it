import { Sparkles } from "lucide-react";

const stats = [
  { value: "100%", label: "Client Satisfaction" },
  { value: "4", label: "Countries Served" },
  { value: null, icon: Sparkles, label: "AI-First Approach" },
];

const testimonials = [
  { name: "Sarah Mitchell", country: "🇺🇸 USA", rating: 5, quote: "Exceptional work on our AI chatbot. Delivered ahead of schedule with zero compromise on quality." },
  { name: "James Chen", country: "🇬🇧 UK", rating: 5, quote: "The team understood our vision perfectly. Highly recommend for any tech project." },
  { name: "Emma Foster", country: "🇦🇺 Australia", rating: 5, quote: "Professional, responsive, and skilled. Our dashboard is exactly what we needed." },
];

export default function Stats() {
  return (
    <section className="py-24 px-6 bg-[#0d0d1a]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Numbers that speak for themselves — and clients who vouch for us.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
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
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
