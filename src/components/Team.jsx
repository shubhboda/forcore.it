import { useState, useEffect, useRef } from "react";
import { ExternalLink, ChevronLeft, ChevronRight, Linkedin, Mail } from "lucide-react";
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
    <section id="team" ref={sectionRef} className="relative min-h-screen min-h-[100dvh] bg-[#0a0a0f] flex items-start lg:items-center justify-center overflow-x-hidden overflow-y-visible py-16 sm:py-20 px-4 sm:px-6">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full min-w-0 relative z-10">
        <div className="text-center mb-8 sm:mb-12 px-1">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-[family-name:var(--font-syne)] text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2"
          >
            The Minds Behind <span className="text-cyan-400">forcore.it</span>
          </motion.h2>
          <p className="text-gray-500 uppercase tracking-[0.12em] sm:tracking-[0.2em] text-[11px] sm:text-sm font-medium max-w-md mx-auto leading-relaxed">
            Builders who own delivery—from strategy to shipped software
          </p>
        </div>

        <div className="relative w-full max-w-full lg:min-h-[550px] lg:h-[550px] rounded-2xl sm:rounded-[32px] overflow-x-clip overflow-y-visible lg:overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
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
              className="relative w-full lg:absolute lg:inset-0 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start lg:items-center py-4 sm:py-8 pb-10 sm:pb-12 lg:pb-8"
            >
              {/* Image Side */}
              <div className="flex justify-center lg:justify-end order-1 lg:order-1">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-500/30 transition-colors duration-500" />
                  <div className="relative w-[16.25rem] h-[16.25rem] sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl mx-auto">
                    {member.photoFallback === null ? (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                        <span className="text-7xl sm:text-8xl font-bold text-cyan-400">{member.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                    ) : (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          member.imageZoom == null ? "group-hover:scale-110" : ""
                        }`}
                        style={{
                          objectPosition: member.imagePosition || "center",
                          ...(member.imageZoom != null
                            ? {
                                transform: `scale(${member.imageZoom})`,
                                transformOrigin:
                                  member.imageTransformOrigin || "center center",
                              }
                            : {}),
                        }}
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
              <div className="text-center lg:text-left order-2 lg:order-2 flex flex-col gap-6">
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
                    className="font-[family-name:var(--font-syne)] text-2xl min-[400px]:text-4xl md:text-6xl font-bold text-white mb-3 sm:mb-4 break-words"
                  >
                    {member.name}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-400 text-sm sm:text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 text-balance"
                  >
                    {member.bio}
                  </motion.p>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="order-2 flex flex-wrap gap-4 sm:gap-6 justify-center lg:order-3 lg:justify-start"
                >
                  {member.portfolio && (
                    <a
                      href={member.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 sm:gap-2 w-full min-[480px]:w-auto min-h-10 sm:min-h-11 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3.5 rounded-lg sm:rounded-xl bg-cyan-500 text-black text-xs sm:text-sm md:text-base font-bold hover:bg-cyan-400 transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] active:scale-95 shrink-0"
                    >
                      View Portfolio
                      <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 shrink-0" />
                    </a>
                  )}
                  <div className="flex items-center justify-center gap-4 w-full min-[480px]:w-auto min-[480px]:justify-start">
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

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="order-3 flex flex-wrap gap-3 justify-center lg:order-2 lg:justify-start"
                >
                  {member.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm">
                      {skill}
                    </span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mt-10 sm:mt-16 md:mt-24 px-2">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous team member"
            className="min-h-12 min-w-12 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all touch-manipulation"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-[85vw] sm:max-w-none">
            {teamMembers.map((_, idx) => (
              <button
                type="button"
                key={idx}
                aria-label={`Show team member ${idx + 1}`}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-2.5 min-w-2.5 sm:h-2 transition-all duration-300 rounded-full touch-manipulation ${
                  idx === currentIndex ? "w-8 bg-cyan-400" : "w-2 sm:w-2 bg-white/20"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next team member"
            className="min-h-12 min-w-12 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all touch-manipulation"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
