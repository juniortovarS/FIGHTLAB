"use client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Activity, 
  Bell, 
  CreditCard, 
  User, 
  History, 
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
  const filteredItems = menuItems.filter(item => !item.adminOnly || isAdmin);

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

      {/* Search Bar (Linear Style) */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-gray-500 text-xs cursor-pointer hover:bg-white/[0.05] transition-all">
          <Search size={14} />
          <span className="flex-1">Buscar acción...</span>
          <div className="flex items-center gap-0.5 opacity-50">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
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
            {userName[0]}
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
