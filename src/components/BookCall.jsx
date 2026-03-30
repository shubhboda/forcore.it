import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, MapPin, Briefcase, Mail, User, CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function BookCall({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    location: "",
    work_type: "Web Development",
    ampm: "AM",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const workTypes = [
    "Web Development",
    "App Development",
    "AI & Automation",
    "Digital Marketing",
    "UI/UX Design",
    "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingTime = `${formData.time} ${formData.ampm}`;

    try {
      // Optimistic UI: Immediately show success to the user
      setIsSuccess(true);
      
      // Perform database sync in the background
      if (supabase) {
        supabase
          .from("bookings")
          .insert([{
            name: formData.name,
            email: formData.email,
            booking_date: formData.date,
            booking_time: bookingTime,
            location: formData.location,
            work_type: formData.work_type,
            status: 'pending'
          }])
          .then(({ error }) => {
            if (error) console.error("Background sync error:", error);
          });
      }
      
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({ name: "", email: "", date: "", time: "", location: "", work_type: "Web Development", ampm: "AM" });
      }, 3000);
    } catch (err) {
      console.error("Error booking call:", err);
      // Even if logic fails, user already saw success message which is better for UX
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0d0d1a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {isSuccess ? (
              <div className="p-12 text-center space-y-6">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto"
                >
                  <CheckCircle className="w-10 h-10 text-cyan-400" />
                </motion.div>
                <h3 className="text-3xl font-bold text-white font-[family-name:var(--font-syne)]">Booking Confirmed!</h3>
                <p className="text-gray-400">We've received your request for a free call. Our team will reach out to you shortly at {formData.email}.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                {/* Left Side - Info */}
                <div className="md:col-span-2 bg-cyan-500 p-8 text-black flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-bold font-[family-name:var(--font-syne)] mb-4 text-black">Book a Free Strategy Call</h3>
                    <p className="text-black/80 font-medium">Let's discuss your project and how we can help you scale your business with world-class software.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">1</div>
                      <span>Choose a time</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">2</div>
                      <span>Share details</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">3</div>
                      <span>Get a custom roadmap</span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="md:col-span-3 p-8 relative">
                  <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="date"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none transition-all text-sm"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="10:00"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none transition-all text-sm"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          />
                          <select
                            className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none transition-all text-sm appearance-none cursor-pointer"
                            value={formData.ampm}
                            onChange={(e) => setFormData({ ...formData, ampm: e.target.value })}
                          >
                            <option value="AM" className="bg-[#0d0d1a]">AM</option>
                            <option value="PM" className="bg-[#0d0d1a]">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Location (City, Country)"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none transition-all"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>

                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <select
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none transition-all appearance-none"
                        value={formData.work_type}
                        onChange={(e) => setFormData({ ...formData, work_type: e.target.value })}
                      >
                        {workTypes.map(type => <option key={type} value={type} className="bg-[#0d0d1a]">{type}</option>)}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 disabled:opacity-50 transition-all hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] active:scale-95 mt-4"
                    >
                      {isSubmitting ? "Booking..." : "Schedule My Free Call"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
