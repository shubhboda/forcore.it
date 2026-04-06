import { useState, useEffect, useRef } from "react";
import { Send, Mail, MessageCircle, Zap, Calendar } from "lucide-react";
import { supabase } from "../lib/supabase";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import BookCall from "./BookCall";

const projectTypes = ["Web Dev", "Mobile App", "AI System", "UI/UX", "Other"];
const budgetRanges = ["<$500", "$500–2K", "$2K–10K", "$10K+"];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", country: "", projectType: "", budget: "", message: "" });
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const messageRef = useRef(null);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#contact" && messageRef.current) {
        setTimeout(() => {
          messageRef.current.focus();
        }, 800); // Wait for scroll to finish
      }
    };

    handleHashChange(); // Initial check
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Optimistic UI: Immediately show success
    setSubmitted(true);
    const currentFormData = { ...formData };
    setFormData({ name: "", email: "", country: "", projectType: "", budget: "", message: "" });

    try {
      if (!supabase) return;

      // Background DB submission
      supabase.from("contacts").insert({
        name: currentFormData.name,
        email: currentFormData.email,
        country: currentFormData.country || null,
        project_type: currentFormData.projectType || null,
        budget: currentFormData.budget || null,
        message: currentFormData.message || null,
      }).then(({ error: insertError }) => {
        if (insertError) console.error("Contact sync error:", insertError);
      });

      // Background Emails
      emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
        {
          from_name: currentFormData.name,
          from_email: currentFormData.email,
          country: currentFormData.country || "Not specified",
          project_type: currentFormData.projectType || "Not specified",
          budget: currentFormData.budget || "Not specified",
          message: currentFormData.message || "No message provided",
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      ).catch(err => console.error("Admin email error:", err));

      emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_USER_TEMPLATE_ID,
        {
          to_name: currentFormData.name,
          to_email: currentFormData.email,
          project_type: currentFormData.projectType || "Project inquiry",
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      ).catch(err => console.error("User email error:", err));

    } catch (err) {
      console.error("Contact form error:", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0a0a0f] overflow-x-hidden">
      <BookCall isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <div className="max-w-7xl mx-auto w-full min-w-0">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-[family-name:var(--font-syne)] text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 px-2">
            Let&apos;s Build Something Together
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-2">
            Share your brief, timeline, and ambition—we respond within one business day with next steps, not filler.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.form 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit} 
            className="space-y-4 order-2 lg:order-1"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-all" />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-all" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-all" />
              <select name="projectType" value={formData.projectType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none transition-all appearance-none">
                <option value="" className="bg-[#0a0a0f]">Project Type</option>
                {projectTypes.map((type) => <option key={type} value={type} className="bg-[#0a0a0f]">{type}</option>)}
              </select>
            </div>
            <select name="budget" value={formData.budget} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none transition-all appearance-none">
              <option value="" className="bg-[#0a0a0f]">Budget Range</option>
              {budgetRanges.map((range) => <option key={range} value={range} className="bg-[#0a0a0f]">{range}</option>)}
            </select>
            <textarea name="message" ref={messageRef} placeholder="Message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-all resize-none" />
            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95">
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
            className="space-y-6 order-1 lg:order-2"
          >
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-medium">Email</span>
              </div>
              <a href="mailto:support.forcor.it@gmail.com" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm break-all sm:break-normal">support.forcor.it@gmail.com</a>
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
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 transition-colors w-fit"
            >
              <Calendar className="w-5 h-5" />
              Book a Free Call
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
