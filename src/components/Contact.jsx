import { useState } from "react";
import { Send, Mail, MessageCircle, Zap, Calendar } from "lucide-react";
import { supabase } from "../lib/supabase";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

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

      // Send Email to Admin (Site Owner)
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
          {
            from_name: formData.name,
            from_email: formData.email,
            country: formData.country || "Not specified",
            project_type: formData.projectType || "Not specified",
            budget: formData.budget || "Not specified",
            message: formData.message || "No message provided",
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      } catch (adminMailError) {
        console.error("Failed to send admin email:", adminMailError);
      }

      // Send Auto-Reply Email to User (Sender)
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_USER_TEMPLATE_ID,
          {
            to_name: formData.name,
            to_email: formData.email,
            project_type: formData.projectType || "Project inquiry",
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      } catch (userMailError) {
        console.error("Failed to send user auto-reply:", userMailError);
      }

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
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-bold text-white mb-4">
            Let&apos;s Build Something Together
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tell us about your project. We reply within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.form 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit} 
            className="space-y-4"
          >
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all" />
            <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all" />
            <select name="projectType" value={formData.projectType} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all appearance-none">
              <option value="" className="bg-[#0a0a0f]">Project Type</option>
              {projectTypes.map((type) => <option key={type} value={type} className="bg-[#0a0a0f]">{type}</option>)}
            </select>
            <select name="budget" value={formData.budget} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all appearance-none">
              <option value="" className="bg-[#0a0a0f]">Budget Range</option>
              {budgetRanges.map((range) => <option key={range} value={range} className="bg-[#0a0a0f]">{range}</option>)}
            </select>
            <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 resize-none transition-all" />
            <button type="submit" disabled={loading} className="w-full py-4 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors">
              {loading ? "Sending..." : "Send Message"}
              <Send className="w-4 h-4" />
            </button>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            {submitted && <p className="text-cyan-400 text-sm text-center">✓ Message sent! We&apos;ll get back to you within 24 hours.</p>}
          </motion.form>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-medium">Email</span>
              </div>
              <a href="mailto:support.forcor.it@gmail.com" className="text-gray-400 hover:text-cyan-400 transition-colors">support.forcor.it@gmail.com</a>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-medium">WhatsApp</span>
              </div>
              <a href="https://wa.me/916354823011" className="text-gray-400 hover:text-cyan-400 transition-colors">+91 6354823011</a>
            </div>
            <div className="flex items-center gap-2 text-cyan-400">
              <Zap className="w-5 h-5" />
              <span>We reply within 24 hours</span>
            </div>
            <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 transition-colors">
              <Calendar className="w-5 h-5" />
              Book a Free Call
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
