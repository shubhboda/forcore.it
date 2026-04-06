import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Star, Globe } from "lucide-react";
import { supabase } from "../lib/supabase";

const initialTestimonials = [
  { id: 1, name: "Alex Rivera", country: "USA", content: "Their AI automation reshaped how we operate—clear architecture, measurable ROI, and a partner who actually owns outcomes.", rating: 5 },
  { id: 2, name: "Siddharth Mehta", country: "India", content: "Enterprise-grade delivery: crisp communication, disciplined timelines, and code we’re confident scaling in production.", rating: 5 },
  { id: 3, name: "Sarah Johnson", country: "UK", content: "Outstanding UX craft paired with engineering depth—the product looks world-class and performs like it.", rating: 5 },
  { id: 4, name: "Chen Wei", country: "China", content: "Rapid execution without cutting corners on AI integration. Already planning our next phase together.", rating: 5 },
  { id: 5, name: "Elena Petrova", country: "Russia", content: "The team you want for a real MVP: strategic, fast, and obsessed with shipping something users actually keep.", rating: 5 },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", country: "", content: "", rating: 5 });

  useEffect(() => {
    async function fetchTestimonials() {
      if (!supabase) {
        return;
      }

      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 5000)
      );

      try {
        const fetchPromise = supabase
          .from("testimonials")
          .select("*")
          .order("created_at", { ascending: false });

        const { data, error } = await Promise.race([fetchPromise, timeout]);
        
        if (!error && data?.length) {
          setTestimonials([...data, ...initialTestimonials]);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials or timed out:", err);
      }
    }
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Create a copy of the data
    const submissionData = { ...formData, id: Date.now() };

    // 2. Immediately update the UI (No waiting!)
    setTestimonials([submissionData, ...testimonials]);
    setIsModalOpen(false);
    
    // 3. Background DB submission
    if (supabase) {
      // Fire and forget to avoid hanging UI
      supabase
        .from("testimonials")
        .insert([{
          name: submissionData.name,
          country: submissionData.country,
          content: submissionData.content,
          rating: submissionData.rating
        }])
        .then(({ error }) => {
          if (error) console.error("Background sync failed:", error);
        })
        .catch(err => console.error("Network error during sync:", err));
    }

    // 4. Reset form for next time
    setFormData({ name: "", country: "", content: "", rating: 5 });
  };

  return (
    <section className="py-10 sm:py-12 bg-[#0d0d1a] overflow-x-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 sm:mb-8 flex flex-col md:flex-row justify-between items-stretch sm:items-center gap-4 w-full min-w-0">
        <div className="text-center md:text-left min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-syne)]">User Feedback</h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">What our clients say from around the globe.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 w-full md:w-auto min-h-12 px-6 py-3 rounded-lg bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-all active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.3)] text-sm touch-manipulation"
        >
          <MessageSquare className="w-4 h-4" />
          Give Feedback
        </button>
      </div>

      {/* Scrolling Ticker */}
      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee whitespace-nowrap py-4">
          {[...testimonials, ...testimonials].map((item, idx) => (
            <div
              key={idx}
              className="inline-block mx-2 sm:mx-4 p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 min-w-[min(88vw,300px)] max-w-[400px] whitespace-normal hover:border-cyan-400/30 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-semibold text-sm">{item.name}</h4>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Globe className="w-3 h-3" />
                    {item.country}
                  </div>
                </div>
                <div className="flex text-yellow-500">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed italic">
                "{item.content}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto" onClick={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto bg-[#0d0d1a] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-syne)] text-center">Submit Feedback</h3>
              <p className="text-gray-400 text-center text-sm mb-6">We value your opinion!</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Your Country"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
                <textarea
                  placeholder="Your Message"
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none resize-none transition-colors"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
                
                <div className="flex flex-col items-center gap-3 py-2 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">Select Rating</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="transition-transform active:scale-90 hover:scale-110"
                        onClick={() => setFormData({ ...formData, rating: star })}
                      >
                        <Star
                          className={`w-8 h-8 ${star <= formData.rating ? "text-yellow-500 fill-current" : "text-gray-600"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-all hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] active:scale-95 mt-2"
                >
                  Post Review
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
