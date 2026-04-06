import { motion } from "framer-motion";
// import PayNow from "./PayNow";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen min-h-[100dvh] flex items-center justify-center pt-24 pb-12 sm:pt-20 sm:pb-0 overflow-x-hidden bg-[#0a0a0f]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#0a0a0f] to-[#0a0a0f]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" aria-hidden />
      
      {/* Futuristic Orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[min(100vw,36rem)] h-[min(100vw,36rem)] sm:w-[600px] sm:h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">

        <h1 className="font-[family-name:var(--font-syne)] text-[1.65rem] min-[400px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.15] sm:leading-tight mb-5 sm:mb-6">
          We Build <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient-x">
            Futuristic
          </span>
          <br />
          Software.
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 px-1">
          From polished web experiences to full AI-native products — we design, build, and ship
          dependable software for teams that refuse to settle for average.
        </p>

        {/* <PayNow /> */}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
    </section>
  );
}
