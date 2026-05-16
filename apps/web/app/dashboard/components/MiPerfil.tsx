"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, ShieldCheck, Edit3, Save, X, CreditCard, Sparkles } from "lucide-react";

interface MiPerfilProps {
  userName: string;
  userEmail: string;
  userPhone?: string;
  currentPlan: string;
  stats: {
    completed: number;
    disciplines: number;
    days: number;
    remaining: number;
    expiryDate?: string | null;
  };
  onUpdate?: (data: { name: string; email: string; phone: string }) => void;
}

export default function MiPerfil({ userName, userEmail, userPhone, currentPlan, stats, onUpdate }: MiPerfilProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userName || "FightLab User");
  const [email, setEmail] = useState(userEmail || "");
  const [phone, setPhone] = useState(userPhone || "+51 ");
  const [saved, setSaved] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Sincronizar estado local con props cuando cambien (ej. después de fetch o save)
  useEffect(() => {
    if (!editing) {
      setName(userName);
      setEmail(userEmail);
      if (userPhone) setPhone(userPhone);
    }
  }, [userName, userEmail, userPhone, editing]);

  const handlePhoneChange = (val: string) => {
    // Solo permitir +51 seguido de números
    let digits = val.replace(/\D/g, "");
    // Si empieza con 51, lo quitamos para procesar solo los 9 dígitos
    if (digits.startsWith("51")) {
      digits = digits.substring(2);
    }
    // Limitar a 9 dígitos
    const cleanDigits = digits.substring(0, 9);
    setPhone("+51 " + cleanDigits);
    
    if (cleanDigits.length < 9 && cleanDigits.length > 0) {
      setPhoneError("Faltan dígitos (deben ser 9)");
    } else {
      setPhoneError("");
    }
  };

  const handleSave = async () => {
    const cleanDigits = phone.replace(/\D/g, "");
    // Si empieza con 51, quitamos el prefijo para validar el resto
    let onlyDigits = cleanDigits;
    if (cleanDigits.startsWith("51")) {
      onlyDigits = cleanDigits.substring(2);
    }

    // El teléfono es opcional, pero si se pone algo, debe tener 9 dígitos
    if (onlyDigits.length > 0 && onlyDigits.length !== 9) {
      setPhoneError("El teléfono debe tener 9 dígitos (o dejarlo vacío)");
      return;
    }

    setEmailError("");
    setPhoneError("");
    try {
      if (onUpdate) {
        await onUpdate({ name, email, phone });
      }
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setEmailError(err.message || "Error al actualizar");
    }
  };

  const statItems = [
    { label: "Victorias (Clases)", value: stats.completed, color: "text-[#D4AF37]", glow: "shadow-[0_0_20px_rgba(212,175,55,0.2)]" },
    { 
      label: "Tu membresía acabará", 
      value: stats.expiryDate ? new Date(stats.expiryDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : "S/D", 
      color: "text-white", 
      glow: "shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
    },
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
              { label: "Email de Contacto", value: email, icon: <Mail size={16} />, onChange: setEmail, editable: true, error: emailError },
              { label: "Teléfono (Perú)", value: phone, icon: <Phone size={16} />, onChange: handlePhoneChange, editable: true, error: phoneError },
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
                    <div className="flex flex-col gap-1">
                      <input 
                        type="text" 
                        value={field.value}
                        onChange={(e) => field.onChange?.(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border rounded-2xl text-sm focus:outline-none transition-all text-white font-medium ${
                          (field as any).error ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-[#D4AF37]/50"
                        }`}
                      />
                      {(field as any).error && (
                        <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider ml-1">
                          {(field as any).error}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className={`w-full pl-11 pr-4 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl text-sm text-gray-300 font-medium ${!field.editable ? "opacity-60 cursor-not-allowed" : ""}`}>
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
