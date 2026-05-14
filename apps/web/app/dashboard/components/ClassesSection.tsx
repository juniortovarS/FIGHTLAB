"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClassItem, Reservation, mockClasses, Sede } from "./data";
import { Search, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import ClassCard from "./ClassCard";

interface ClassesSectionProps {
  reservations: Reservation[];
  onReserve: (item: ClassItem) => void;
}

export default function ClassesSection({ reservations, onReserve }: ClassesSectionProps) {
  const [sedeFilter, setSedeFilter] = useState<Sede | "Todas">("Todas");
  const [search, setSearch] = useState("");

  const filteredClasses = mockClasses.filter(c => {
    const matchesSede = sedeFilter === "Todas" || c.sede === sedeFilter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                         c.coach.toLowerCase().includes(search.toLowerCase());
    return matchesSede && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/5 rounded-2xl">
          {["Todas", "Primavera", "La Mar"].map((s) => (
            <button
              key={s}
              onClick={() => setSedeFilter(s as any)}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all tracking-widest ${
                sedeFilter === s 
                  ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por clase o coach..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClasses.map((item, i) => {
          const isReserved = reservations.some(r => r.classItem.id === item.id && r.status === "Confirmada");
          return (
            <div key={item.id} className="relative">
              <ClassCard 
                item={item} 
                index={i} 
                onReserve={onReserve} 
                isReserved={isReserved}
              />
              
              <AnimatePresence>
                {isReserved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 z-10 glass-gold rounded-[2rem] flex flex-col items-center justify-center gap-3 pointer-events-none"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                      <ArrowRight size={20} className="rotate-[-45deg]" />
                    </div>
                    <span className="text-xs font-black text-[#D4AF37] tracking-[0.2em] uppercase">Misión Reservada</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {filteredClasses.length === 0 && (
        <div className="py-20 text-center glass rounded-3xl border-dashed border-white/5">
          <MapPin className="mx-auto mb-4 text-gray-700" size={40} />
          <h3 className="text-lg font-bold text-gray-400">No se encontraron misiones</h3>
          <p className="text-sm text-gray-600 mt-1">Intenta ajustando los filtros de búsqueda o sede.</p>
        </div>
      )}
    </div>
  );
}
