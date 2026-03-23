import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Process from "../components/Process";
import Projects from "../components/Projects";
import Pricing from "../components/Pricing";
import Team from "../components/Team";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] w-full">
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <Projects />
      <Pricing />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}
