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
                <h2 className="text-2xl font-black text-white tracking-tighter">RESERVAS ACTIVAS</h2>
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
                    <h4 className="text-2xl font-black text-white mb-3">Sin clases programadas</h4>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                      Hola <span className="text-[#D4AF37]">{userName}</span>, tu agenda de entrenamiento está vacía por ahora. ¡Es momento de volver al tatami y demostrar tu nivel!
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
                upcoming.map((res, idx) => (
                  <motion.div
                    key={res.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative group"
                  >
                    {/* Glowing Aura on Hover */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/20 to-[#D4AF37]/0 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />

                    <div className="relative glass-premium rounded-[2.5rem] border border-white/5 group-hover:border-[#D4AF37]/30 transition-all duration-500 overflow-hidden">
                      {/* Tactical Header */}
                      <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                          <span className="text-[9px] md:text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Clase Confirmada</span>
                        </div>
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">ID: FL-{res.id.toString().slice(-4)}</span>
                      </div>

                      <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                          {/* Discipline Icon Container */}
                          <div className="relative shrink-0 self-center md:self-start">
                            <div className={`w-20 h-20 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br ${res.classItem.gradient} flex items-center justify-center text-4xl md:text-5xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group-hover:scale-110 transition-transform duration-700`}>
                              {res.classItem.icon}
                              {/* Glowing Ring */}
                              <div className="absolute inset-0 rounded-3xl border-2 border-white/20 animate-pulse" />
                            </div>
                            <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-2xl bg-[#161616] border-2 border-[#D4AF37] flex items-center justify-center shadow-2xl">
                              <CheckCircle2 size={20} className="text-[#D4AF37]" />
                            </div>
                          </div>

                          {/* Info Body */}
                          <div className="flex-1 space-y-6">
                            <div>
                              <h4 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2 group-hover:text-[#D4AF37] transition-colors duration-500">
                                {res.classItem.name}
                              </h4>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-[8px] font-black rounded border border-[#D4AF37]/20 uppercase tracking-widest">Master Coach</span>
                                <span className="text-gray-500 text-xs font-bold">{res.classItem.coach}</span>
                              </div>
                            </div>

                            {/* Tactical Grid */}
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                              {[
                                { icon: <Clock size={16} />, value: res.classItem.time, label: "Hora" },
                                { icon: <Calendar size={16} />, value: res.classItem.date, label: "Fecha" },
                                { icon: <MapPin size={16} />, value: res.classItem.sede, label: "Sede" },
                                { icon: <Shield size={16} />, value: "Confirmado", label: "Cupo" },
                              ].map((item, i) => (
                                <div key={i} className="glass-gold p-3 md:p-4 rounded-2xl border border-white/5 flex flex-col gap-1 hover:bg-white/5 transition-colors">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-gray-600 uppercase text-[8px] font-black tracking-widest">{item.label}</span>
                                    <div className="text-[#D4AF37]/40">{item.icon}</div>
                                  </div>
                                  <p className="text-sm font-black text-white tracking-tight">{item.value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                          <div className="flex items-center gap-4 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <div className="flex -space-x-2">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-gray-800" />
                              ))}
                            </div>
                            <span>+12 Fighters en camino</span>
                          </div>

                          <div className="w-full sm:w-auto">
                            {cancelingId === res.id ? (
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => { onCancel(res.id); setCancelingId(null); }}
                                  className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black rounded-2xl transition-all shadow-[0_10px_20px_rgba(239,68,68,0.3)] flex items-center gap-2"
                                >
                                  <AlertTriangle size={14} /> CANCELAR CLASE
                                </button>
                                <button
                                  onClick={() => setCancelingId(null)}
                                  className="p-4 bg-white/5 text-gray-400 rounded-2xl hover:bg-white/10 transition-all"
                                >
                                  <XCircle size={20} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setCancelingId(res.id)}
                                className="w-full sm:w-auto px-10 py-4 bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 border border-white/5 hover:border-red-500/30 text-[10px] font-black rounded-2xl transition-all uppercase tracking-[0.2em] group/cancel"
                              >
                                Cancelar Cupo
                              </button>
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
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Registro de Clases</h3>
            </div>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {history.map((res, i) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass-premium p-6 rounded-[2rem] flex flex-col border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] blur-2xl rounded-full -mr-10 -mt-10" />

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl grayscale group-hover:grayscale-0 transition-all duration-700">
                    {res.classItem.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white leading-tight mb-1">{res.classItem.name}</h4>
                    <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                      <Calendar size={10} />
                      {res.classItem.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                      <User size={12} className="text-[#D4AF37]/60" />
                    </div>
                    {res.classItem.coach}
                  </div>
                  <span className={`text-[8px] font-black px-4 py-2 rounded-xl tracking-[0.2em] uppercase ${res.status === "Cancelada"
                      ? "bg-red-500/10 text-red-400/80 border border-red-500/20"
                      : "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
                    }`}>
                    {res.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
