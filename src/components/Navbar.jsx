import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
  { href: "#pricing", label: "Pricing" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#0a0a0f] border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-[family-name:var(--font-syne)] font-bold text-lg text-white">
            Madhav
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 hover:text-cyan-400"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a
            href="#contact"
            className="px-4 py-2 text-sm font-medium text-cyan-400 border border-cyan-400/50 rounded-lg hover:bg-cyan-400/10"
          >
            Get a Free Quote
          </a>
        </div>

        <button
          className="md:hidden p-2 text-gray-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0f] border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-cyan-400 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="px-4 py-2 text-sm font-medium text-cyan-400 border border-cyan-400/50 rounded-lg hover:bg-cyan-400/10 text-center mt-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get a Free Quote
          </a>
        </div>
      )}
    </header>
  );
}
