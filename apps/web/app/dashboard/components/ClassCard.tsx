"use client";
import { motion } from "framer-motion";
import { Clock, MapPin, Users, ArrowRight, UserCircle } from "lucide-react";
import { ClassItem } from "./data";

interface ClassCardProps {
  item: ClassItem;
  onReserve: (item: ClassItem) => void;
  onViewClass?: (item: ClassItem) => void;
  index?: number;
  isReserved?: boolean;
  isAdmin?: boolean;
}

export default function ClassCard({ item, onReserve, onViewClass, index = 0, isReserved = false, isAdmin = false }: ClassCardProps) {
  const isFull = item.spots === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group glass p-1 rounded-[1.5rem] md:rounded-[2.5rem] border-white/5 hover:border-[#D4AF37]/40 transition-all duration-500 relative overflow-hidden"
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute -right-20 -top-20 w-64 h-64 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br ${item.gradient}`} />

      <div className="p-4 md:p-8">
        <div className="flex justify-between items-start mb-4 md:mb-8">
          <div className={`w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-xl md:text-3xl shadow-2xl shadow-black/40 border border-white/10`}>
            {item.icon}
          </div>
          <span className={`text-[8px] md:text-[11px] font-black px-2 md:px-4 py-1 md:py-2 rounded-full uppercase tracking-[0.1em] md:tracking-[0.2em] shadow-lg ${
            item.level === "Avanzado" ? "bg-rose-500/20 text-rose-400 border border-rose-500/20" : 
            item.level === "Intermedio" ? "bg-amber-500/20 text-amber-400 border border-amber-500/20" : "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/20"
          }`}>
            {item.level}
          </span>
        </div>

        <h3 className="text-lg md:text-3xl font-black mb-2 md:mb-3 tracking-tighter text-white group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-1">
          {item.name}
        </h3>
        
        <p className="hidden md:block text-gray-400 text-base font-medium mb-8 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        <div className="space-y-2 md:space-y-4 mb-4 md:mb-10 p-3 md:p-6 rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-sm font-bold text-gray-300">
            <Clock size={12} className="text-[#D4AF37] md:hidden" />
            <div className="hidden md:flex w-8 h-8 rounded-lg bg-[#D4AF37]/10 items-center justify-center">
              <Clock size={16} className="text-[#D4AF37]" />
            </div>
            <span>{item.time} <span className="text-gray-500 hidden md:inline">· {item.duration} min</span></span>
          </div>
          <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-sm font-bold text-gray-300">
            <MapPin size={12} className="text-[#D4AF37] md:hidden" />
            <div className="hidden md:flex w-8 h-8 rounded-lg bg-[#D4AF37]/10 items-center justify-center">
              <MapPin size={16} className="text-[#D4AF37]" />
            </div>
            <span className="line-clamp-1">{item.sede}</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-sm font-bold text-gray-300">
            <UserCircle size={12} className="text-[#D4AF37] md:hidden" />
            <div className="hidden md:flex w-8 h-8 rounded-lg bg-[#D4AF37]/10 items-center justify-center">
              <UserCircle size={16} className="text-[#D4AF37]" />
            </div>
            <span className="line-clamp-1">{item.coach}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 md:mb-8 px-1 md:px-2">
          <div className="flex items-center gap-2">
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
              {item.spots} Cupos
            </span>
          </div>
          <div className="h-1 w-12 md:w-20 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#D4AF37] transition-all duration-1000" 
              style={{ width: `${(item.spots / 20) * 100}%` }} 
            />
          </div>
        </div>

        <button
          onClick={() => !isFull && onReserve(item)}
          disabled={isFull}
          className={`w-full py-3 md:py-5 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em] flex items-center justify-center gap-2 md:gap-3 transition-all duration-500 group shadow-xl ${
            isFull 
              ? "bg-white/5 text-gray-600 cursor-not-allowed grayscale" 
              : "bg-white text-black hover:bg-[#D4AF37] hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {isFull ? "Full" : "Reservar"}
          {!isFull && <ArrowRight size={14} className="md:size-[18px] group-hover:translate-x-1 md:group-hover:translate-x-2 transition-transform duration-300" />}
        </button>

        {isAdmin && (
          <button
            onClick={() => onViewClass?.(item)}
            className="w-full mt-3 py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-[#D4AF37]/10 border border-white/5 hover:border-[#D4AF37]/30 text-gray-400 hover:text-[#D4AF37] transition-all flex items-center justify-center gap-2 group/admin"
          >
            <Users size={14} className="md:size-4" />
            Visualizar Clase
          </button>
        )}
      </div>

    </motion.div>
  );
}
