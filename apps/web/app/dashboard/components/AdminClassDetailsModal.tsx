"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Mail, Phone, Calendar, Clock, Search } from "lucide-react";
import { ClassItem, UserItem, Reservation } from "./data";
import { useEffect, useState, useRef } from "react";

interface AdminClassDetailsModalProps {
  item: ClassItem | null;
  users: UserItem[];
  onClose: () => void;
}

export default function AdminClassDetailsModal({ item, users, onClose }: AdminClassDetailsModalProps) {
  const [search, setSearch] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Bloqueo Quirúrgico de Scroll del Body
  useEffect(() => {
    if (!item) return;

    const preventDefault = (e: Event) => {
      // Si el toque NO es dentro de la zona de scroll, bloqueamos
      if (scrollAreaRef.current && !scrollAreaRef.current.contains(e.target as Node)) {
        if (e.cancelable) e.preventDefault();
      }
    };

    // Bloqueamos scroll en el body
    document.body.style.overflow = "hidden";
    
    // Bloqueamos touchmove en el documento (solo fuera del área de scroll)
    document.addEventListener("touchmove", preventDefault, { passive: false });
    document.addEventListener("wheel", preventDefault, { passive: false });

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("touchmove", preventDefault);
      document.removeEventListener("wheel", preventDefault);
    };
  }, [item]);

  if (!item) return null;

  const attendees = users.filter(u => {
    try {
      const resList: Reservation[] = u.reservations ? JSON.parse(u.reservations) : [];
      return resList.some(r => 
        r.status === "Confirmada" && 
        (r.classItem.id === item.id || (r.classItem.name === item.name && r.classItem.date === item.date && r.classItem.time === item.time))
      );
    } catch (e) { return false; }
  });

  const filteredAttendees = attendees.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] flex justify-center items-center p-4 md:p-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-md" 
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm md:max-w-xl bg-[#0B0B0B] rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden"
          style={{ height: "65vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`relative h-24 flex-shrink-0 bg-gradient-to-br ${item.gradient} p-5 flex items-end justify-between`}>
            <div className="relative z-10">
              <h2 className="text-xl font-black text-white uppercase truncate">{item.name}</h2>
              <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest mt-1">Gestión Admin</p>
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white border border-white/10">
              <X size={14} />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 bg-[#0B0B0B] border-b border-white/5 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input 
                type="text" 
                placeholder="Buscar Fighter..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-[10px] text-white focus:outline-none"
              />
            </div>
          </div>

          {/* ZONA DE SCROLL - Única zona permitida */}
          <div 
            ref={scrollAreaRef}
            className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3 bg-[#0B0B0B] overscroll-contain"
            style={{ 
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-y" 
            }}
          >
            {filteredAttendees.length > 0 ? (
              filteredAttendees.map((user, idx) => (
                <div 
                  key={user.id}
                  className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-sm font-black text-[#D4AF37]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12px] font-black text-white truncate">{user.name}</h4>
                    <p className="text-[9px] text-gray-500 font-bold truncate">{user.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center opacity-30 text-[10px] font-black uppercase tracking-widest">
                Vacío
              </div>
            )}
            <div className="h-10" />
          </div>

          {/* Footer */}
          <div className="p-4 bg-black border-t border-white/5 flex-shrink-0">
            <button 
              onClick={onClose}
              className="w-full py-3 bg-white/5 rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-widest"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
