"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Clock, Check, ShieldAlert, Info, Calendar } from "lucide-react";
import { ClassItem } from "./data";
import { useEffect, useRef } from "react";

interface BookingModalProps {
  item: ClassItem | null;
  onConfirm: (item: ClassItem) => void;
  onClose: () => void;
}

export default function BookingModal({ item, onConfirm, onClose }: BookingModalProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item) return;

    const preventDefault = (e: Event) => {
      if (scrollAreaRef.current && !scrollAreaRef.current.contains(e.target as Node)) {
        if (e.cancelable) e.preventDefault();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("touchmove", preventDefault, { passive: false });
    document.addEventListener("wheel", preventDefault, { passive: false });

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("touchmove", preventDefault);
      document.removeEventListener("wheel", preventDefault);
    };
  }, [item]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex justify-center items-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop - blurred and less opaque */}
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-md" 
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm md:max-w-xl bg-[#0B0B0B] rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden z-10"
          style={{ height: "65vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Compact */}
          <div className={`relative h-28 flex-shrink-0 bg-gradient-to-br ${item.gradient} p-6 flex items-end justify-between overflow-hidden border-b border-white/10`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">{item.icon}</span>
                <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                  RESERVAR
                </span>
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">{item.name}</h2>
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white border border-white/10">
              <X size={14} />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div 
            ref={scrollAreaRef}
            className="flex-1 overflow-y-auto scrollbar-hide p-5 space-y-6 bg-[#0B0B0B] overscroll-contain"
            style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
          >
            {/* Induction Section */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <h4 className="text-[#D4AF37] text-[8px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <Info size={12} /> Inducción
              </h4>
              <p className="text-gray-400 text-[11px] font-bold leading-relaxed">
                Sesión dirigida por <span className="text-white font-black">{item.coach}</span>. 
                {item.name.toLowerCase().includes("muay") && " Técnica de clinch y potencia."}
                {item.name.toLowerCase().includes("boxeo") && " Jab y combinaciones de potencia."}
                {!item.name.toLowerCase().includes("muay") && !item.name.toLowerCase().includes("boxeo") && " Mejora tu rendimiento físico."}
              </p>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-1">Horario</div>
                <div className="text-white text-[10px] font-bold flex items-center gap-1.5">
                  <Clock size={12} className="text-[#D4AF37]" /> {item.time}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-1">Fecha</div>
                <div className="text-white text-[10px] font-bold flex items-center gap-1.5">
                  <Calendar size={12} className="text-[#D4AF37]" /> {item.date}
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <ShieldAlert className="text-amber-500 shrink-0" size={16} />
              <p className="text-amber-200/70 text-[9px] font-bold leading-tight">
                Llegar unos minutos antes para vendaje. Equipo personal obligatorio.
              </p>
            </div>
          </div>

          {/* Action Buttons - Fixed */}
          <div className="p-4 bg-black border-t border-white/5 space-y-3 flex-shrink-0">
            <button 
              onClick={() => onConfirm(item)}
              className="w-full py-4 bg-[#D4AF37] text-black font-black uppercase tracking-widest rounded-xl text-[10px] flex items-center justify-center gap-2"
            >
              <Check size={16} /> Confirmar Cupo
            </button>
            <button 
              onClick={onClose}
              className="w-full py-3 bg-white/5 text-gray-500 font-black uppercase tracking-widest rounded-xl text-[9px]"
            >
              Cancelar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
