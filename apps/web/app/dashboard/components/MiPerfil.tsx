"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, ShieldCheck, Edit3, Save, X, CreditCard, Sparkles } from "lucide-react";

interface MiPerfilProps {
  userName: string;
  userEmail: string;
  currentPlan: string;
  stats: {
    completed: number;
    disciplines: number;
    months: number;
    remaining: number;
  };
}

export default function MiPerfil({ userName, userEmail, currentPlan, stats }: MiPerfilProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userName || "FightLab User");
  const [phone, setPhone] = useState("+52 55 1234 5678");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const statItems = [
    { label: "Victorias (Clases)", value: stats.completed, color: "text-[#D4AF37]", glow: "shadow-[0_0_20px_rgba(212,175,55,0.2)]" },
    { label: "Meses de Garra", value: stats.months, color: "text-white", glow: "shadow-[0_0_20px_rgba(255,255,255,0.05)]" },
    { label: "Disciplinas", value: stats.disciplines, color: "text-[#D4AF37]", glow: "shadow-[0_0_20px_rgba(212,175,55,0.2)]" },
    { label: "Clases restantes", value: stats.remaining === 999 ? "∞" : stats.remaining, color: "text-white", glow: "shadow-[0_0_20px_rgba(255,255,255,0.05)]" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-gold p-8 rounded-3xl flex flex-col items-center text-center border-[#D4AF37]/20"
        >
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#FFD700] to-[#D4AF37] flex items-center justify-center text-5xl font-black text-black shadow-[0_0_40px_rgba(212,175,55,0.4)]">
              {name[0]}
            </div>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full border-4 border-[#121212] bg-emerald-500 shadow-lg" />
          </div>
          
          <h3 className="text-2xl font-black text-white mb-1">{name}</h3>
          <p className="text-sm text-gray-400 mb-6 font-medium">{userEmail}</p>
          
          <div className="px-5 py-2.5 rounded-2xl bg-[#D4AF37] text-black text-xs font-black tracking-widest uppercase shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2">
            <Sparkles size={14} /> LEVEL {Math.floor(stats.completed / 6) + 1}
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass p-8 rounded-3xl border-white/10"
        >
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-black text-white">Configuración del Perfil</h4>
            <button 
              onClick={() => editing ? handleSave() : setEditing(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
                editing 
                  ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20" 
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              {editing ? <><Save size={14} /> Guardar Cambios</> : <><Edit3 size={14} /> Editar Perfil</>}
            </button>
          </div>

          <AnimatePresence>
            {saved && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center gap-3"
              >
                <ShieldCheck size={18} /> Tu evolución ha sido guardada.
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              { label: "Nombre de Guerrero", value: name, icon: <User size={16} />, onChange: setName, editable: true },
              { label: "Email de Contacto", value: userEmail, icon: <Mail size={16} />, editable: false },
              { label: "Teléfono", value: phone, icon: <Phone size={16} />, onChange: setPhone, editable: true },
              { label: "Plan Actual", value: currentPlan, icon: <CreditCard size={16} />, editable: false },
            ].map((field) => (
              <div key={field.label} className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                  {field.label}
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors">
                    {field.icon}
                  </div>
                  {editing && field.editable ? (
                    <input 
                      type="text" 
                      value={field.value}
                      onChange={(e) => field.onChange?.(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white font-medium"
                    />
                  ) : (
                    <div className="w-full pl-11 pr-4 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl text-sm text-gray-300 font-medium">
                      {field.value}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((s, i) => (
          <motion.div 
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className={`glass p-8 rounded-[2rem] border-white/5 text-center group hover:border-[#D4AF37]/30 transition-all duration-500 ${s.glow}`}
          >
            <p className={`text-4xl font-black mb-2 ${s.color} transition-transform group-hover:scale-110`}>{s.value}</p>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-tight">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
