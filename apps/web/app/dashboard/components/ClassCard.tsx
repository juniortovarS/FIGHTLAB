"use client";
import { motion } from "framer-motion";
import { Clock, MapPin, Users, ArrowRight, UserCircle } from "lucide-react";
import { ClassItem } from "./data";

interface ClassCardProps {
  item: ClassItem;
  onReserve: (item: ClassItem) => void;
  index?: number;
  isReserved?: boolean;
}

export default function ClassCard({ item, onReserve, index = 0, isReserved = false }: ClassCardProps) {
  const isFull = item.spots === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group glass p-1 rounded-[2.5rem] border-white/5 hover:border-[#D4AF37]/40 transition-all duration-500 relative overflow-hidden"
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute -right-20 -top-20 w-64 h-64 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br ${item.gradient}`} />

      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-3xl shadow-2xl shadow-black/40 border border-white/10`}>
            {item.icon}
          </div>
          <span className={`text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg ${
            item.level === "Avanzado" ? "bg-rose-500/20 text-rose-400 border border-rose-500/20" : 
            item.level === "Intermedio" ? "bg-amber-500/20 text-amber-400 border border-amber-500/20" : "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/20"
          }`}>
            {item.level}
          </span>
        </div>

        <h3 className="text-3xl font-black mb-3 tracking-tighter text-white group-hover:text-[#D4AF37] transition-colors duration-300">
          {item.name}
        </h3>
        
        <p className="text-gray-400 text-base font-medium mb-8 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        <div className="space-y-4 mb-10 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-4 text-sm font-bold text-gray-300">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
              <Clock size={16} className="text-[#D4AF37]" />
            </div>
            <span>{item.time} · <span className="text-gray-500">{item.duration} min</span></span>
          </div>
          <div className="flex items-center gap-4 text-sm font-bold text-gray-300">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
              <MapPin size={16} className="text-[#D4AF37]" />
            </div>
            <span>{item.sede}</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-bold text-gray-300">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
              <UserCircle size={16} className="text-[#D4AF37]" />
            </div>
            <div className="flex flex-col">
              <span className="text-white uppercase tracking-widest text-[10px]">Entrenador</span>
              <span>{item.coach}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0B0B0B] bg-gray-800" />
              ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
              {item.spots} Cupos libres
            </span>
          </div>
          <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#D4AF37] transition-all duration-1000" 
              style={{ width: `${(item.spots / 20) * 100}%` }} 
            />
          </div>
        </div>

        <button
          onClick={() => !isFull && onReserve(item)}
          disabled={isFull}
          className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500 group shadow-xl ${
            isFull 
              ? "bg-white/5 text-gray-600 cursor-not-allowed grayscale" 
              : "bg-white text-black hover:bg-[#D4AF37] hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {isFull ? "Clase Completa" : "Reservar cupo"}
          {!isFull && <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />}
        </button>
      </div>
    </motion.div>
  );
}
