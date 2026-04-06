import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureSection from "../components/FeatureSection";
import Services from "../components/Services";
import Process from "../components/Process";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import Team from "../components/Team";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen min-h-[100dvh] bg-[#0a0a0f] w-full max-w-[100vw] overflow-x-hidden">
      <Navbar />
      <Hero />
      <FeatureSection />
      <Services />
      <Process />
      <Pricing />
      <Testimonials />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}
