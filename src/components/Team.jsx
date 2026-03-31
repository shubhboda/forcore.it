import { useState, useEffect, useRef } from "react";
import { ExternalLink, ChevronLeft, ChevronRight, Globe, Linkedin, Mail } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { teamMembers } from "../data/team";

export default function Team() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });
  const AUTO_SLIDE_MS = 6000;

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "105%" : "-105%",
      opacity: 0.35,
      scale: 0.96,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? "105%" : "-105%",
      opacity: 0.35,
      scale: 0.96,
    }),
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  useEffect(() => {
    if (!isInView || teamMembers.length <= 1) return undefined;

    const timer = window.setTimeout(() => {
      nextSlide();
    }, AUTO_SLIDE_MS);

    return () => window.clearTimeout(timer);
  }, [currentIndex, isInView]);

  const member = teamMembers[currentIndex];

  return (
    <section id="team" ref={sectionRef} className="relative min-h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden py-20 px-6">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-[family-name:var(--font-syne)] text-3xl md:text-5xl font-bold text-white mb-2"
          >
            The Minds Behind <span className="text-cyan-400">forcore.it</span>
          </motion.h2>
          <p className="text-gray-500 uppercase tracking-[0.2em] text-sm font-medium">Meet Our Leadership Team</p>
        </div>

        <div className="relative min-h-[700px] md:min-h-[550px] lg:h-[550px] w-full flex items-center overflow-hidden rounded-[32px]">
          <AnimatePresence initial={false} custom={direction} mode="sync">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 180, damping: 24, mass: 0.8 },
                opacity: { duration: 0.22, ease: "easeOut" },
                scale: { duration: 0.3, ease: "easeOut" },
              }}
              className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8"
            >
              {/* Image Side */}
              <div className="flex justify-center lg:justify-end order-1 lg:order-1">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-500/30 transition-colors duration-500" />
                  <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                    {member.photoFallback === null ? (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                        <span className="text-6xl font-bold text-cyan-400">{member.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                    ) : (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ objectPosition: member.imagePosition || "center" }}
                        crossOrigin="anonymous"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = member.photoFallback || "";
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="text-center lg:text-left order-2 lg:order-2 space-y-6">
                <div>
                  <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold tracking-wider uppercase mb-4"
                  >
                    {member.role}
                  </motion.span>
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-[family-name:var(--font-syne)] text-4xl md:text-6xl font-bold text-white mb-4"
                  >
                    {member.name}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0"
                  >
                    {member.bio}
                  </motion.p>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-3 justify-center lg:justify-start"
                >
                  {member.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm">
                      {skill}
                    </span>
                  ))}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4"
                >
                  {member.portfolio && (
                    <a
                      href={member.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] active:scale-95"
                    >
                      View Portfolio
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  <div className="flex items-center gap-4">
                    {member.linkedin && member.linkedin !== "#" && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all">
                        <Linkedin className="w-6 h-6" />
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all">
                        <Mail className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-8 mt-16 md:mt-24">
          <button
            onClick={prevSlide}
            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex gap-3">
            {teamMembers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-2 transition-all duration-300 rounded-full ${
                  idx === currentIndex ? "w-8 bg-cyan-400" : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
