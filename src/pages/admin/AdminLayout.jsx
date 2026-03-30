import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  CreditCard,
  Users,
  MessageCircle,
  Calendar,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import LogoIcon from "../../components/LogoIcon";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/messages", icon: MessageCircle, label: "Messages" },
  { to: "/admin/bookings", icon: Calendar, label: "Free Calls" },
  { to: "/admin/projects", icon: Briefcase, label: "Our Work" },
  { to: "/admin/plans", icon: CreditCard, label: "Pricing Plans" },
  { to: "/admin/users", icon: Users, label: "Users" },
];

export default function AdminLayout() {
  const { user, signOut, profile } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("AdminLayout: Sign out button clicked");
    
    try {
      // Set a local flag for hard reload fallback
      localStorage.setItem("signing_out", "true");
      
      await signOut();
      
      // If signOut doesn't redirect, force it
      setTimeout(() => {
        if (localStorage.getItem("signing_out") === "true") {
          localStorage.clear();
          window.location.href = "/login";
        }
      }, 1000);
    } catch (err) {
      console.error("AdminLayout: Sign out error:", err);
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0d0d1a] border-r border-white/5 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2">
              <LogoIcon className="w-8 h-8" />
              <span className="font-[family-name:var(--font-syne)] font-bold text-white tracking-tight">
                forcore<span className="text-[#3D87F5]">.it</span> Admin
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5 shrink-0">
            <div className="flex items-center gap-3 px-4 py-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <span className="text-sm font-bold text-cyan-400">
                  {user?.email?.[0]?.toUpperCase() || "A"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                <p className="text-xs text-cyan-400">{(profile?.role || "admin").toString()}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-[#0a0a0f]/90 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-[family-name:var(--font-syne)] font-bold text-white flex-1">
            forcore.it Admin
          </h1>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
