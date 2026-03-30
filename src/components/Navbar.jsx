import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import LogoIcon from "./LogoIcon";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5"
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <LogoIcon className="w-8 h-8" />
          <span className="font-[family-name:var(--font-syne)] font-bold text-xl text-white tracking-tight">
            forcore<span className="text-[#3D87F5]">.it</span>
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

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-4 py-2 text-sm font-medium text-cyan-400 border border-cyan-400/50 rounded-lg hover:bg-cyan-400/10"
                >
                  Admin
                </Link>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-400 hover:text-cyan-400"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-cyan-400 border border-cyan-400/50 rounded-lg hover:bg-cyan-400/10"
              >
                Sign Up
              </Link>
            </>
          )}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0d0d1a] border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6 flex flex-col items-center text-center">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-gray-300 hover:text-cyan-400 w-full py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-6 w-full flex flex-col gap-4">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full px-6 py-3 text-center font-bold text-cyan-400 border border-cyan-400/50 rounded-xl bg-cyan-400/5"
                      >
                        Go to Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full px-6 py-3 text-center font-medium text-gray-400 hover:text-white"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full px-6 py-3 text-center font-medium text-gray-300 hover:text-cyan-400"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full px-6 py-3 text-center font-bold text-cyan-400 border border-cyan-400/50 rounded-xl bg-cyan-400/5 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full px-6 py-4 text-center font-bold bg-cyan-500 text-black rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                >
                  Book a Strategy Call
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
