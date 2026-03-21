import { useState } from "react";
import { Send, Mail, MessageCircle, Zap, Calendar } from "lucide-react";
import { supabase } from "../lib/supabase";

const projectTypes = ["Web Dev", "Mobile App", "AI System", "UI/UX", "Other"];
const budgetRanges = ["<$500", "$500–2K", "$2K–10K", "$10K+"];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", country: "", projectType: "", budget: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!supabase) {
        setSubmitted(true);
        setFormData({ name: "", email: "", country: "", projectType: "", budget: "", message: "" });
        return;
      }
      const { error: insertError } = await supabase.from("contacts").insert({
        name: formData.name,
        email: formData.email,
        country: formData.country || null,
        project_type: formData.projectType || null,
        budget: formData.budget || null,
        message: formData.message || null,
      });
      if (insertError) throw insertError;
      setSubmitted(true);
      setFormData({ name: "", email: "", country: "", projectType: "", budget: "", message: "" });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-24 px-6 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-bold text-white mb-4">
            Let&apos;s Build Something Together
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tell us about your project. We reply within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30" />
            <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30" />
            <select name="projectType" value={formData.projectType} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30">
              <option value="">Project Type</option>
              {projectTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <select name="budget" value={formData.budget} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30">
              <option value="">Budget Range</option>
              {budgetRanges.map((range) => <option key={range} value={range}>{range}</option>)}
            </select>
            <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 resize-none" />
            <button type="submit" disabled={loading} className="w-full py-4 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? "Sending..." : "Send Message"}
              <Send className="w-4 h-4" />
            </button>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            {submitted && <p className="text-cyan-400 text-sm text-center">✓ Message sent! We&apos;ll get back to you within 24 hours.</p>}
          </form>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-medium">Email</span>
              </div>
              <a href="mailto:hello@madhav.dev" className="text-gray-400 hover:text-cyan-400">hello@madhav.dev</a>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-medium">WhatsApp</span>
              </div>
              <a href="https://wa.me/919876543210" className="text-gray-400 hover:text-cyan-400">+91 98765 43210</a>
            </div>
            <div className="flex items-center gap-2 text-cyan-400">
              <Zap className="w-5 h-5" />
              <span>We reply within 24 hours</span>
            </div>
            <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10">
              <Calendar className="w-5 h-5" />
              Book a Free Call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
