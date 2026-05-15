"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Activity, 
  Bell, 
  CreditCard, 
  User, 
  LogOut,
  ChevronLeft,
  Search,
  Command,
  LayoutDashboard,
  CalendarClock,
  Users,
  Settings,
  LifeBuoy
} from "lucide-react";
import { NavSection } from "./data";

interface SidebarProps {
  active: NavSection;
  onNav: (s: NavSection) => void;
  userName: string;
  userEmail: string;
  onLogout: () => void;
  isOpen?: boolean;
  setIsOpen?: (b: boolean) => void;
  isAdmin?: boolean;
}

const menuItems: { key: NavSection; label: string; icon: any; adminOnly?: boolean }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: true },
  { key: "planner", label: "Planner", icon: CalendarClock, adminOnly: true },
  { key: "usuarios", label: "Usuarios", icon: Users, adminOnly: true },
  { key: "reservar", label: "Clases", icon: Activity },
  { key: "mis-reservas", label: "Mis reservas", icon: Calendar },
  { key: "anuncios", label: "Anuncios", icon: Bell },
  { key: "membresias", label: "Membresía", icon: CreditCard },
  { key: "perfil", label: "Perfil", icon: User },
  { key: "configuracion", label: "Configuración", icon: Settings, adminOnly: true },
  { key: "soporte", label: "Soporte", icon: LifeBuoy },
];

export default function Sidebar({ active, onNav, userName, userEmail, onLogout, isOpen, setIsOpen, isAdmin }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  const filteredItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  const searchResults = searchTerm.trim() 
    ? filteredItems.filter(item => 
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.key.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen?.(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        className={`fixed left-0 top-0 h-screen z-[60] bg-[#0B0B0B] border-r border-white/10 flex flex-col w-72 lg:w-64 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-black font-black text-lg shadow-[0_0_25px_rgba(212,175,55,0.4)]">
              F
            </div>
            <span className="font-black text-lg tracking-tighter text-white">FIGHT<span className="text-[#D4AF37]">LAB</span></span>
          </div>
          <button className="lg:hidden p-2 text-gray-400 hover:text-white" onClick={() => setIsOpen?.(false)}>
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* Search Bar (Functional) */}
        <div className="px-4 mb-6 relative">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-gray-500 text-xs hover:bg-white/[0.05] transition-all focus-within:border-[#D4AF37]/50 focus-within:bg-white/[0.06]">
            <Search size={14} className={searchTerm ? "text-[#D4AF37]" : ""} />
            <input 
              type="text"
              placeholder="Buscar acción..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-gray-600"
            />
            <div className="flex items-center gap-0.5 opacity-50">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showResults && searchTerm.trim() !== "" && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowResults(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-4 right-4 mt-2 bg-[#121212] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-2"
                >
                  {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => {
                          onNav(item.key);
                          setSearchTerm("");
                          setShowResults(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#D4AF37]/10 text-gray-400 hover:text-white text-xs transition-colors group"
                      >
                        <item.icon size={14} className="group-hover:text-[#D4AF37]" />
                        <span>{item.label}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-[10px] text-gray-600 uppercase tracking-widest text-center">
                      Sin resultados
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNav(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group relative ${
                  isActive 
                    ? "bg-white/[0.06] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-4 bg-[#D4AF37] rounded-r-full"
                  />
                )}
                <Icon size={18} className={isActive ? "text-[#D4AF37]" : "group-hover:text-gray-300"} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User / Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-all cursor-pointer mb-2">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold text-xs">
              {userName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-[10px] text-gray-500 truncate">{userEmail}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={16} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
