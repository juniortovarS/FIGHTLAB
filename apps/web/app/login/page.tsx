"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Mail, ArrowRight, ShieldAlert, Key, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "send" }),
      });
      
      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error(`Servidor devolvió error ${res.status}`);
      }

      if (res.ok) {
        setStep(2);
        setSimulatedCode(data.code);
      } else {
        setError(data.error || "Error desconocido");
      }
    } catch (err: any) {
      setError(`Falla de conexión: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/code", {
        method: "POST",
        body: JSON.stringify({ email, code: otp, action: "verify" }),
      });

      if (res.ok) {
        await signIn("credentials", {
          email,
          code: otp, // Enviamos el código real
          callbackUrl: "/dashboard",
        });
      } else {
        setError("Código de verificación inválido.");
      }
    } catch (err) {
      setError("Error de autenticación.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("Credenciales de administrador incorrectas.");
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center p-6 selection:bg-[#D4AF37]/30">
      <div className="fixed inset-0 bg-grid opacity-[0.05] pointer-events-none" />
      <div className="fixed top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mx-auto max-w-[450px] relative z-10 px-4 md:px-0"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.3)]"
          >
            <ShieldCheck size={40} className="text-[#0B0B0B]" />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">FIGHT<span className="text-[#D4AF37]">LAB</span></h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Protocolo de Acceso Seguro</p>
        </div>

        <div className="glass rounded-[2.5rem] p-1 border-white/5 mb-8">
          <div className="grid grid-cols-2 relative">
            <button 
              onClick={() => { setActiveTab("user"); setStep(1); setError(null); }}
              className={`relative z-10 py-4 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === "user" ? "text-black" : "text-gray-500"}`}
            >
              Acceso Atleta
            </button>
            <button 
              onClick={() => { setActiveTab("admin"); setStep(1); setError(null); }}
              className={`relative z-10 py-4 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === "admin" ? "text-black" : "text-gray-500"}`}
            >
              Administrador
            </button>
            <motion.div 
              className="absolute top-0 bottom-0 left-0 rounded-[2.2rem] bg-[#D4AF37]"
              initial={false}
              animate={{ x: activeTab === "user" ? "0%" : "100%", width: "50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        <motion.div className="glass rounded-[2.5rem] p-10 border-white/5 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
              >
                <ShieldAlert size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === "user" ? (
            <form key="user-form" onSubmit={step === 1 ? handleSendCode : handleVerifyAndLogin} className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Identificación de Atleta</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="tu@correo.com"
                          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white font-medium"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Código de 6 Dígitos</label>
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                        <input 
                          type="text" 
                          inputMode="numeric"
                          pattern="[0-9]*"
                          required
                          maxLength={6}
                          autoComplete="one-time-code"
                          autoFocus
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="000 000"
                          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-2xl tracking-[0.5em] text-center focus:outline-none focus:border-[#D4AF37]/50 transition-all text-[#D4AF37] font-black"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group disabled:opacity-50 ${
                  step === 2 
                    ? "bg-[#D4AF37] text-black hover:bg-[#FFD700] shadow-[0_0_30px_rgba(212,175,55,0.3)]" 
                    : "bg-white text-black hover:bg-[#D4AF37]"
                }`}
              >
                {loading ? "Procesando..." : (
                  <>
                    {step === 1 ? "Verificar Identidad" : "Acceder al Sistema"}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {step === 2 && (
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-[10px] text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  Volver a ingresar correo
                </button>
              )}
            </form>
          ) : (
            <form key="admin-form" onSubmit={handleAdminLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email de Control</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Clave de Seguridad</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white font-medium"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#D4AF37] text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#FFD700] transition-all shadow-xl shadow-[#D4AF37]/20 disabled:opacity-50"
              >
                {loading ? "Autenticando..." : "Acceso Administrativo"}
              </button>
            </form>
          )}

          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="bg-[#111111] px-4 text-gray-600 font-bold flex items-center gap-2">
                <CheckCircle2 size={12} /> Cifrado de Extremo a Extremo
              </span>
            </div>
          </div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10 text-[11px] text-gray-500 font-bold uppercase tracking-widest"
        >
          ¿Problemas de acceso? <a href="#" className="text-[#D4AF37] hover:text-[#FFD700] underline-offset-4 underline">Soporte Técnico</a>
        </motion.p>
      </motion.div>
    </div>
  );
}