"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reservation } from "./data";
import { Calendar, MapPin, User, Clock, XCircle, CheckCircle2 } from "lucide-react";

interface MisReservasProps {
  reservations: Reservation[];
  onCancel: (id: number) => void;
  hideUpcoming?: boolean;
  hideHistory?: boolean;
  userName?: string;
  onGoToClasses?: () => void;
}

export default function MisReservas({ 
  reservations, 
  onCancel, 
  hideUpcoming = false, 
  hideHistory = false,
  userName = "Guerrero",
  onGoToClasses
}: MisReservasProps) {
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  const upcoming = reservations.filter(r => r.status === "Confirmada");
  const history = reservations.filter(r => r.status !== "Confirmada");

  return (
    <div className="space-y-12">
      {/* Upcoming Section */}
      {!hideUpcoming && (
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Misiones Activas</h3>
            <div className="flex-1 h-px bg-[#D4AF37]/10" />
            <span className="text-[10px] font-black text-gray-600">{upcoming.length} EN COLA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {upcoming.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full py-16 px-8 text-center glass rounded-[2.5rem] border-dashed border-white/5 flex flex-col items-center justify-center space-y-6"
                >
                  <div className="relative w-64 h-64 rounded-full overflow-hidden border-2 border-[#D4AF37]/20">
                    <img 
                      src="/fightlab.png" 
                      alt="Fight" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?q=80&w=400&auto=format&fit=crop";
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white mb-2">Hola {userName},</h4>
                    <p className="text-gray-500 text-sm font-medium">no tienes clases reservadas para hoy.</p>
                  </div>
                  <button 
                    onClick={onGoToClasses}
                    className="px-8 py-4 bg-[#D4AF37] hover:bg-[#FFD700] text-black rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all shadow-xl shadow-[#D4AF37]/20"
                  >
                    Ver clases disponibles
                  </button>
                </motion.div>
              ) : (
                upcoming.map((res) => (
                  <motion.div
                    key={res.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass p-6 rounded-3xl group border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500"
                  >
                    <div className="flex gap-5">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${res.classItem.gradient} flex items-center justify-center text-2xl shadow-xl shadow-black/40`}>
                        {res.classItem.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-black text-white group-hover:text-[#D4AF37] transition-colors">{res.classItem.name}</h4>
                          <span className="text-[9px] font-black bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded-md flex items-center gap-1 tracking-tighter">
                            <CheckCircle2 size={10} /> LISTO
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-y-3 text-[11px] text-gray-500 mb-6">
                          <div className="flex items-center gap-2"><Clock size={12} className="text-[#D4AF37]/50" /> {res.classItem.time}</div>
                          <div className="flex items-center gap-2"><MapPin size={12} className="text-[#D4AF37]/50" /> {res.classItem.sede}</div>
                          <div className="flex items-center gap-2"><User size={12} className="text-[#D4AF37]/50" /> {res.classItem.coach}</div>
                          <div className="flex items-center gap-2"><Calendar size={12} className="text-[#D4AF37]/50" /> {res.classItem.date}</div>
                        </div>

                        <div className="flex gap-2">
                          {cancelingId === res.id ? (
                            <div className="flex items-center gap-2 w-full">
                              <button 
                                onClick={() => { onCancel(res.id); setCancelingId(null); }}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black rounded-xl transition-all shadow-lg shadow-red-600/20"
                              >
                                CONFIRMAR CANCELACIÓN
                              </button>
                              <button 
                                onClick={() => setCancelingId(null)}
                                className="px-4 py-2.5 bg-white/5 text-gray-400 text-[10px] font-black rounded-xl"
                              >
                                VOLVER
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setCancelingId(res.id)}
                              className="flex items-center gap-2 text-[10px] font-black text-gray-600 hover:text-red-400 transition-colors uppercase tracking-widest"
                            >
                              <XCircle size={14} /> Cancelar Reserva
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* History Section */}
      {!hideHistory && history.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Registro de Batallas</h3>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="space-y-3">
            {history.map((res) => (
              <div key={res.id} className="glass p-5 rounded-2xl flex items-center justify-between border-white/5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl grayscale opacity-50">
                    {res.classItem.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-300">{res.classItem.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{res.classItem.date} · {res.classItem.coach}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg tracking-widest ${
                    res.status === "Cancelada" 
                      ? "bg-red-500/10 text-red-500/50" 
                      : "bg-[#D4AF37]/10 text-[#D4AF37]/70"
                  }`}>
                    {res.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
