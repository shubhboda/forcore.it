import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import LogoIcon from "./LogoIcon";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

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
          {user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-4 py-2 text-sm font-medium text-cyan-400 border border-cyan-400/50 rounded-lg hover:bg-cyan-400/10 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-gray-400 text-left w-full"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 py-2 text-gray-300 hover:text-cyan-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-2 py-2 text-gray-300 hover:text-cyan-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserPlus className="w-4 h-4" /> Sign Up
              </Link>
            </>
          )}
          <a
            href="#contact"
            className="px-4 py-2 text-sm font-medium text-cyan-400 border border-cyan-400/50 rounded-lg hover:bg-cyan-400/10 text-center mt-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get a Free Quote
          </a>
        </div>
      )}
    </motion.header>
  );
}
