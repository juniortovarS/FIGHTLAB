"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reservation } from "./data";
import { Calendar, MapPin, User, Clock, XCircle, CheckCircle2, Shield, Info, AlertTriangle, ChevronRight } from "lucide-react";

interface MisReservasProps {
  reservations: Reservation[];
  onCancel: (id: string | number) => void;
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
  const [cancelingId, setCancelingId] = useState<string | number | null>(null);

  const upcoming = reservations.filter(r => r.status === "Confirmada");
  const history = reservations.filter(r => r.status !== "Confirmada");

  return (
    <div className="space-y-16">
      {/* Upcoming Section */}
      {!hideUpcoming && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-[#D4AF37] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-1">Operaciones</h3>
                <h2 className="text-2xl font-black text-white tracking-tighter">MISIONES ACTIVAS</h2>
              </div>
            </div>
            <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
              <Shield size={16} className="text-[#D4AF37]" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{upcoming.length} EN COLA</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {upcoming.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full py-24 px-8 text-center glass rounded-[3rem] border-dashed border-white/10 flex flex-col items-center justify-center space-y-8 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                      <Shield size={48} className="text-[#D4AF37]/40" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-500 text-[10px] font-black"
                    >
                      !
                    </motion.div>
                  </div>
                  <div className="max-w-md">
                    <h4 className="text-2xl font-black text-white mb-3">Sin misiones programadas</h4>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                      Hola <span className="text-[#D4AF37]">{userName}</span>, tu agenda de combate está vacía por ahora. ¡Es momento de volver al tatami y demostrar tu nivel!
                    </p>
                  </div>
                  <button
                    onClick={onGoToClasses}
                    className="group relative px-10 py-5 bg-[#D4AF37] hover:bg-[#FFD700] text-black rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all shadow-2xl shadow-[#D4AF37]/20 flex items-center gap-3"
                  >
                    Ver Clases Disponibles
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/20 to-[#D4AF37]/0 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-1000" />
                    <div className="relative glass p-8 rounded-[2.5rem] border-white/5 group-hover:border-[#D4AF37]/40 transition-all duration-500 overflow-hidden">
                      {/* Background Decor */}
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${res.classItem.gradient} opacity-[0.03] blur-3xl`} />

                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col items-center gap-4">
                          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${res.classItem.gradient} flex items-center justify-center text-4xl shadow-2xl shadow-black/60 relative group-hover:scale-105 transition-transform duration-500`}>
                            {res.classItem.icon}
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-black border-2 border-[#D4AF37] flex items-center justify-center shadow-lg">
                              <CheckCircle2 size={14} className="text-[#D4AF37]" />
                            </div>
                          </div>
                          <div className="px-3 py-1 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20">
                            <span className="text-[9px] font-black text-[#D4AF37] tracking-widest uppercase">Confirmada</span>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-2xl font-black text-white group-hover:text-[#D4AF37] transition-colors tracking-tight leading-none mb-2">{res.classItem.name}</h4>
                              <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.3em] opacity-60">Session Code: FL-{res.id.toString().slice(-4)}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm mb-8">
                            {[
                              { icon: <Clock size={14} />, text: res.classItem.time, label: "Hora" },
                              { icon: <MapPin size={14} />, text: res.classItem.sede, label: "Sede" },
                              { icon: <User size={14} />, text: res.classItem.coach, label: "Coach" },
                              { icon: <Calendar size={14} />, text: res.classItem.date, label: "Fecha" },
                            ].map((item, i) => (
                              <div key={i} className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                                <div className="text-[#D4AF37]">{item.icon}</div>
                                <div>
                                  <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                                  <p className="text-xs font-bold text-gray-300">{item.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            {cancelingId === res.id ? (
                              <div className="flex items-center gap-3 w-full">
                                <button
                                  onClick={() => { onCancel(res.id); setCancelingId(null); }}
                                  className="flex-1 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black rounded-2xl transition-all border border-red-500/20 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                                >
                                  <AlertTriangle size={14} /> CONFIRMAR CANCELACIÓN
                                </button>
                                <button
                                  onClick={() => setCancelingId(null)}
                                  className="px-6 py-4 bg-white/5 text-gray-400 text-[10px] font-black rounded-2xl border border-white/5 hover:bg-white/10 transition-all"
                                >
                                  VOLVER
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2 text-emerald-400">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">CUPO RESERVADO</span>
                                </div>
                                <button
                                  onClick={() => setCancelingId(res.id)}
                                  className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-red-400 transition-all uppercase tracking-widest group/btn"
                                >
                                  <XCircle size={16} className="group-hover/btn:rotate-90 transition-transform" />
                                  <span>Cancelar</span>
                                </button>
                              </div>
                            )}
                          </div>
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
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Info size={16} className="text-gray-600" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Registro de Batallas</h3>
            </div>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {history.map((res) => (
              <div key={res.id} className="glass p-5 rounded-[2rem] flex flex-col border-white/5 hover:bg-white/[0.04] transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                    {res.classItem.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-300 group-hover:text-white transition-colors leading-tight">{res.classItem.name}</h4>
                    <p className="text-[9px] text-gray-600 uppercase tracking-widest font-black mt-1">{res.classItem.date}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase tracking-tighter">
                    <User size={10} className="text-[#D4AF37]/40" /> {res.classItem.coach}
                  </div>
                  <span className={`text-[8px] font-black px-3 py-1.5 rounded-xl tracking-[0.2em] uppercase ${res.status === "Cancelada"
                      ? "bg-red-500/5 text-red-500/40 border border-red-500/10"
                      : "bg-[#D4AF37]/5 text-[#D4AF37]/50 border border-[#D4AF37]/10"
                    }`}>
                    {res.status}
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
