"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Clock, Timer, User, Ticket, Check } from "lucide-react";
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

  const dateObj = item ? new Date(item.date + "T12:00:00") : new Date();
  const dateLabel = dateObj.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });

  const infoItems = item ? [
    { icon: <MapPin size={13} />, label: "Sucursal", value: item.sede },
    { icon: <Calendar size={13} />, label: "Fecha", value: dateLabel },
    { icon: <Clock size={13} />, label: "Hora de inicio", value: item.time },
    { icon: <Timer size={13} />, label: "Duración", value: `${item.duration} minutos` },
    { icon: <User size={13} />, label: "Coach", value: item.coach },
    { icon: <Ticket size={13} />, label: "Cupos disponibles", value: `${item.spots} lugares` },
  ] : [];

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0)" }}
          animate={{ background: "rgba(0,0,0,0.85)" }}
          exit={{ background: "rgba(0,0,0,0)" }}
          transition={{ duration: 0.3 }}
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
          {/* Blur overlay */}
          <div className="absolute inset-0 backdrop-blur-sm pointer-events-none" />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 400 }}
            className="relative w-full max-w-lg rounded-2xl overflow-hidden z-10"
            style={{
              background: "#0f0f0f",
              border: "1px solid rgba(212,175,55,0.2)",
              boxShadow: "0 0 80px rgba(212,175,55,0.12), 0 40px 100px rgba(0,0,0,0.9)",
            }}
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)" }} />

            {/* Image header */}
            <div className={`relative h-48 bg-gradient-to-br ${item.gradient} overflow-hidden`}>
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <motion.div
                className="absolute inset-0 flex items-center justify-center text-8xl"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring" }}
                style={{ filter: "drop-shadow(0 8px 30px rgba(0,0,0,0.5))" }}
              >
                {item.icon}
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />

              {/* Close button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", color: "#6B7280" }}
              >
                <X size={14} />
              </motion.button>

              <div className="absolute top-4 left-4">
                <span className="text-xs px-3 py-1 rounded-lg font-black"
                  style={{ background: "linear-gradient(135deg, #D4AF37, #B8860B)", color: "#0B0B0B" }}>
                  {item.name}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 pt-4 pb-6">
              <motion.p
                className="text-sm mb-4 leading-relaxed"
                style={{ color: "#6B7280" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {item.description}
              </motion.p>

              {/* Info grid */}
              <motion.div
                className="grid grid-cols-2 gap-2.5 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                {infoItems.map(({ icon, label, value }) => (
                  <div key={label} className="rounded-xl p-3"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex items-center gap-1.5 mb-1" style={{ color: "#D4AF37" }}>
                      {icon}
                      <span className="text-[10px] font-bold tracking-wide">{label}</span>
                    </div>
                    <p className="text-xs font-semibold" style={{ color: "#E5E7EB" }}>{value}</p>
                  </div>
                ))}
              </motion.div>

              {/* Benefits */}
              <motion.div
                className="mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-[10px] font-bold tracking-[0.15em] mb-2.5" style={{ color: "#374151" }}>BENEFICIOS</p>
                <div className="flex flex-wrap gap-2">
                  {item.benefits.map(b => (
                    <motion.span
                      key={b}
                      whileHover={{ scale: 1.05 }}
                      className="text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5"
                      style={{
                        background: "rgba(212,175,55,0.06)",
                        color: "#D4AF37",
                        border: "1px solid rgba(212,175,55,0.15)",
                      }}
                    >
                      <Check size={10} /> {b}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "#6B7280",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  onClick={() => onConfirm(item)}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(212,175,55,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 rounded-xl text-sm font-black shimmer flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                    color: "#0B0B0B",
                  }}
                >
                  <Check size={14} /> Confirmar Reserva
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
