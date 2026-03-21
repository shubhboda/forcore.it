import { ArrowRight } from "lucide-react";
import { services } from "../data/services";

export default function Services() {
  return (
    <section id="services" className="py-24 px-6 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-bold text-white mb-4">
            What We Build
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            End-to-end tech solutions from AI to design — tailored for your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/30"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm text-cyan-400"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
