"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClassItem, Reservation, mockClasses, Sede } from "./data";
import { Search, MapPin, CheckCircle2, Users } from "lucide-react";
import ClassCard from "./ClassCard";
import BookingModal from "./BookingModal";

interface ClassesSectionProps {
  reservations: Reservation[];
  onReserve: (item: ClassItem) => void;
}

export default function ClassesSection({ reservations, onReserve }: ClassesSectionProps) {
  const [sedeFilter, setSedeFilter] = useState<Sede | "Todas">("Todas");
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

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
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all tracking-widest ${sedeFilter === s
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredClasses.map((item, i) => {
          const isReserved = reservations.some(r => r.classItem.id === item.id && r.status === "Confirmada");
          return (
            <div key={item.id} className="relative group">
              <ClassCard
                item={item}
                index={i}
                onReserve={(clase) => setSelectedClass(clase)}
                isReserved={isReserved}
              />

              <AnimatePresence>
                {isReserved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="absolute inset-0 z-20 rounded-[2.5rem] overflow-hidden pointer-events-none"
                  >
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-[6px]" />
                    <div className="absolute inset-0 border-[3px] border-[#D4AF37] rounded-[2.5rem] shadow-[inset_0_0_80px_rgba(212,175,55,0.4)]" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        className="bg-[#D4AF37] text-black px-10 py-4 rounded-full shadow-[0_0_50px_rgba(212,175,55,0.6)] flex items-center gap-3 border-2 border-white/20"
                      >
                        <CheckCircle2 size={24} strokeWidth={3} />
                        <span className="text-sm font-black uppercase tracking-[0.2em]">Clase Reservada</span>
                      </motion.div>

                      {/* Contador de cupos dinámico */}
                      <div className="mt-8 flex flex-col items-center gap-2">
                        <div className="flex items-center gap-3 text-[#D4AF37]">
                          <Users size={16} />
                          <span className="text-xs font-black uppercase tracking-[0.3em]">Cupos disponibles</span>
                        </div>
                        <p className="text-4xl font-black text-white tracking-tighter">
                          {item.spots}<span className="text-[#D4AF37]/50 text-xl"> / {item.totalSpots}</span>
                        </p>
                      </div>

                      <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mt-8 opacity-40 italic">FightLab</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Popup con cierre inteligente */}
      <BookingModal
        item={selectedClass}
        onClose={() => setSelectedClass(null)}
        onConfirm={(item) => {
          onReserve(item);
          setSelectedClass(null);
        }}
      />

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
