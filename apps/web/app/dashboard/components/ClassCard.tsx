"use client";
import { motion } from "framer-motion";
import { Clock, MapPin, Users, ArrowRight, Star } from "lucide-react";
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
      whileHover={{ y: -4 }}
      className="group glass p-1 rounded-2xl border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${item.gradient}`} />

      <div className="p-5">
        <div className="flex justify-between items-start mb-6">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl shadow-lg shadow-black/20`}>
            {item.icon}
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
            item.level === "Avanzado" ? "bg-rose-500/10 text-rose-400" : 
            item.level === "Intermedio" ? "bg-amber-500/10 text-amber-400" : "bg-[#D4AF37]/10 text-[#D4AF37]"
          }`}>
            {item.level}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-2 group-hover:text-[#D4AF37] transition-colors">{item.name}</h3>
        <p className="text-gray-400 text-sm mb-6 line-clamp-2">{item.description}</p>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <Clock size={14} className="text-[#D4AF37]" />
            <span>{item.time} ({item.duration} min)</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <MapPin size={14} className="text-[#D4AF37]" />
            <span>{item.sede}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <Users size={14} className="text-[#D4AF37]" />
            <span>{item.coach} · {item.spots} cupos libres</span>
          </div>
        </div>

        <button
          onClick={() => !isFull && onReserve(item)}
          disabled={isFull}
          className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
            isFull 
              ? "bg-white/5 text-gray-500 cursor-not-allowed" 
              : "bg-white/[0.03] hover:bg-[#D4AF37] border border-white/5 hover:border-[#D4AF37] text-white hover:text-black"
          }`}
        >
          {isFull ? "Lista de Espera" : "Reservar Ahora"}
          {!isFull && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </div>
    </motion.div>
  );
}
