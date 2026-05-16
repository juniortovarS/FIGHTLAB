"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClassItem, Reservation, Sede, UserItem } from "./data";
import { Search, MapPin, CheckCircle2, Users, Calendar, Clock, User as UserIcon, ChevronRight } from "lucide-react";
import ClassCard from "./ClassCard";
import BookingModal from "./BookingModal";
import AdminClassDetailsModal from "./AdminClassDetailsModal";

interface ClassesSectionProps {
  classes: ClassItem[];
  reservations: Reservation[];
  users: UserItem[];
  isAdmin: boolean;
  onReserve: (item: ClassItem) => void;
}

export default function ClassesSection({ classes, reservations, users, isAdmin, onReserve }: ClassesSectionProps) {
  const [sedeFilter, setSedeFilter] = useState<Sede | "Todas">("Todas");
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [viewingClass, setViewingClass] = useState<ClassItem | null>(null);

  // Generar lista de los próximos 7 días para el filtro
  const availableDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split("T")[0]!);
    }
    return dates;
  }, []);

  const [dateFilter, setDateFilter] = useState(availableDates[0]!);

  const filteredClasses = useMemo(() => {
    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    const todayStr = now.toISOString().split("T")[0]!;

    return classes.filter(c => {
      const matchesSede = sedeFilter === "Todas" || c.sede === sedeFilter;
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.coach.toLowerCase().includes(search.toLowerCase());
      const matchesDate = c.date === dateFilter;

      // Filtrar clases pasadas si es hoy
      let isPast = false;
      if (c.date === todayStr) {
        const [h, m] = c.time.split(":").map(Number);
        const classTimeMinutes = (h ?? 0) * 60 + (m ?? 0);
        if (classTimeMinutes < currentTimeMinutes) {
          isPast = true;
        }
      }

      return matchesSede && matchesSearch && matchesDate && !isPast;
    });
  }, [classes, sedeFilter, search, dateFilter]);

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (dateStr === today.toISOString().split("T")[0]) return "HOY";
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateStr === tomorrow.toISOString().split("T")[0]) return "MAÑANA";

    return d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric" }).toUpperCase();
  };

  return (
    <div className="space-y-10">
      {/* Filters Header */}
      <div className="flex flex-col gap-8">
        {/* Day Selector */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
          <div className="p-1.5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-1.5 md:gap-2 min-w-max">
            {availableDates.map((date) => (
              <button
                key={date}
                onClick={() => setDateFilter(date)}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-black transition-all tracking-[0.1em] md:tracking-[0.2em] whitespace-nowrap ${
                  dateFilter === date
                    ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {formatDateLabel(date)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/5 rounded-2xl">
            {["Todas", "Primavera", "La Mar"].map((s) => (
              <button
                key={s}
                onClick={() => setSedeFilter(s as any)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black transition-all tracking-[0.2em] ${
                  sedeFilter === s
                    ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" size={16} />
            <input
              type="text"
              placeholder="Buscar clase o coach..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-xs focus:outline-none focus:border-[#D4AF37]/50 transition-all font-medium placeholder:text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-8">
        {filteredClasses.map((item, i) => {
          const isReserved = reservations.some(r => 
            r.status === "Confirmada" && 
            (r.classItem.id === item.id || (r.classItem.name === item.name && r.classItem.date === item.date && r.classItem.time === item.time))
          );
          return (
            <div key={item.id} className="relative group">
              <ClassCard
                item={item}
                index={i}
                onReserve={(clase) => setSelectedClass(clase)}
                onViewClass={(clase) => setViewingClass(clase)}
                isReserved={isReserved}
                isAdmin={isAdmin}
              />

              <AnimatePresence>
                {isReserved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="absolute inset-0 z-20 rounded-[2.5rem] overflow-hidden pointer-events-none"
                  >
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-[8px]" />
                    <div className="absolute inset-0 border-[3px] border-[#D4AF37] rounded-[2.5rem] shadow-[inset_0_0_80px_rgba(212,175,55,0.4)]" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        className="bg-[#D4AF37] text-black px-6 md:px-10 py-2.5 md:py-4 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center gap-2 md:gap-3 border-2 border-white/20"
                      >
                        <CheckCircle2 className="w-4 h-4 md:w-6 md:h-6" strokeWidth={3} />
                        <span className="text-[9px] md:text-sm font-black uppercase tracking-[0.15em] md:tracking-[0.2em]">Clase Reservada</span>
                      </motion.div>

                      {/* Contador de cupos dinámico */}
                      <div className="mt-4 md:mt-8 flex flex-col items-center gap-1 md:gap-2">
                        <div className="flex items-center gap-2 md:gap-3 text-[#D4AF37]">
                          <Users className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="text-[8px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Cupos disponibles</span>
                        </div>
                        <p className="text-2xl md:text-4xl font-black text-white tracking-tighter">
                          {item.spots}<span className="text-[#D4AF37]/50 text-base md:text-xl"> / {item.totalSpots}</span>
                        </p>
                      </div>

                      <p className="text-[#D4AF37] text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] mt-4 md:mt-8 opacity-40 italic">FightLab</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {filteredClasses.length === 0 && (
        <div className="py-32 text-center glass rounded-[3rem] border-dashed border-white/10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5">
            <Calendar className="text-gray-700" size={32} />
          </div>
          <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">No hay misiones disponibles</h3>
          <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">No se encontraron clases para los criterios seleccionados en esta fecha.</p>
        </div>
      )}

      <BookingModal
        item={selectedClass}
        onClose={() => setSelectedClass(null)}
        onConfirm={(item) => {
          onReserve(item);
          setSelectedClass(null);
        }}
      />
      <AdminClassDetailsModal
        item={viewingClass}
        users={users}
        onClose={() => setViewingClass(null)}
      />
    </div>
  );
}
