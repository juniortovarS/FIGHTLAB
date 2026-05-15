"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Clock, User, Check, ShieldAlert, Sparkles, Info } from "lucide-react";
import { ClassItem } from "./data";
import { useEffect } from "react";

interface BookingModalProps {
  item: ClassItem | null;
  onConfirm: (item: ClassItem) => void;
  onClose: () => void;
}

export default function BookingModal({ item, onConfirm, onClose }: BookingModalProps) {
  useEffect(() => {
    if (item) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [item]);

  if (!item) return null;

  const dateObj = new Date(item.date + "T12:00:00");
  const dateLabel = dateObj.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-[100] flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />

        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-[#1A1A1A] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className={`h-32 bg-gradient-to-br ${item.gradient} relative flex items-center px-10`}>
            <div className="text-6xl mr-6">{item.icon}</div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{item.name}</h2>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">Confirmación de Asistencia</p>
            </div>
            <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="p-10">
            {/* Induction Section */}
            <div className="mb-8 p-6 rounded-3xl bg-white/[0.03] border border-white/5">
              <h4 className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                <Info size={14} /> Inducción de Clase
              </h4>
              <p className="text-gray-300 text-base font-bold leading-relaxed">
                Esta es una sesión dirigida por <span className="text-white font-black">{item.coach}</span>. 
                {item.name.toLowerCase().includes("muay") && " Trabajaremos técnica de clinch, codos y potencia de pateo."}
                {item.name.toLowerCase().includes("boxeo") && " Nos enfocaremos en desplazamientos, jab y combinaciones de potencia."}
                {item.name.toLowerCase().includes("bjj") && " La clase se centrará en fundamentos de guardia y control posicional."}
                {!item.name.toLowerCase().includes("muay") && !item.name.toLowerCase().includes("boxeo") && !item.name.toLowerCase().includes("bjj") && " Una sesión diseñada para mejorar tu rendimiento físico y técnico."}
              </p>
            </div>

            {/* Reminders - NEW CONTENT */}
            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <ShieldAlert className="text-amber-500 shrink-0" size={24} />
                <div className="space-y-1">
                  <p className="text-white text-sm font-black uppercase tracking-wider">Aviso Importante</p>
                  <p className="text-amber-200/70 text-xs font-bold leading-relaxed">
                    No olvides traer tu material de clase y tu equipo personal. Es obligatorio llegar unos minutos antes para el vendaje y calentamiento.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Horario</div>
                  <div className="text-white text-sm font-bold flex items-center gap-2">
                    <Clock size={14} className="text-[#D4AF37]" /> {item.time}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Sucursal</div>
                  <div className="text-white text-sm font-bold flex items-center gap-2">
                    <MapPin size={14} className="text-[#D4AF37]" /> {item.sede}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={onClose}
                className="flex-1 py-5 rounded-2xl bg-white/5 text-gray-500 font-black uppercase tracking-widest hover:text-white transition-all text-[10px]"
              >
                Cancelar
              </button>
              <button 
                onClick={() => onConfirm(item)}
                className="flex-[2] py-5 rounded-2xl bg-[#D4AF37] text-black font-black uppercase tracking-widest hover:bg-[#FFD700] shadow-[0_0_50px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-3 text-[10px]"
              >
                <Check size={18} /> Entendido, Confirmar Reserva
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
