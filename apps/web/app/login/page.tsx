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
    <div className="min-h-screen bg-black flex selection:bg-[#D4AF37]/30 overflow-hidden font-sans">
      {/* Cinematic Background Side (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden group">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src="https://images.pexels.com/photos/4761779/pexels-photo-4761779.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Fighter"
            className="w-full h-full object-cover grayscale-[0.4] brightness-[0.6] group-hover:scale-110 transition-transform duration-[15s] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </motion.div>

        <div className="relative z-10 p-20 flex flex-col justify-between h-full">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                <ShieldCheck size={28} className="text-black" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tighter">FIGHT<span className="text-[#D4AF37]">LAB</span></h1>
            </div>
          </motion.div>

          <div className="space-y-6 mt-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-[80px] font-['Bebas_Neue'] text-white tracking-tight leading-[0.85] uppercase italic">
                RISE ABOVE <br />
                <span className="text-[#D4AF37] not-italic">YOURSELF</span>
              </h2>
              <p className="text-gray-400 mt-6 max-w-sm text-xs font-medium leading-relaxed tracking-[0.1em] italic opacity-70 border-l border-[#D4AF37]/30 pl-5">
                "La disciplina es el puente entre tus límites y tu legado. Forja tu propia historia en el santuario del combate."
              </p>
            </motion.div>

            <div className="flex gap-12 pt-4">
              <div className="space-y-1">
                <p className="text-lg font-['Bebas_Neue'] text-white tracking-widest">FIGHTERS</p>
                <div className="w-8 h-[1px] bg-[#D4AF37]/40" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-['Bebas_Neue'] text-white tracking-widest">2026</p>
                <div className="w-8 h-[1px] bg-[#D4AF37]/40" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Mobile Background */}
        <div className="lg:hidden absolute inset-0 z-0">
          <img src="https://images.pexels.com/photos/4761779/pexels-photo-4761779.jpeg?auto=compress&cs=tinysrgb&w=1920" className="w-full h-full object-cover opacity-20 blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[420px] relative z-10"
        >
          <div className="text-center mb-12 lg:hidden">
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">FIGHT<span className="text-[#D4AF37]">LAB</span></h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">Protocolo de Acceso</p>
          </div>

          <div className="mb-10">
            <h3 className="text-3xl font-black text-white tracking-tighter mb-2">Autenticación de Perfil</h3>
            <p className="text-gray-500 text-sm font-medium">Inicia sesión con tus credenciales de seguridad para gestionar tu cuenta.</p>
          </div>

          {/* Selector de Tab Premium */}
          <div className="bg-white/5 p-1.5 rounded-3xl border border-white/5 mb-8 backdrop-blur-xl">
            <div className="grid grid-cols-2 relative">
              <button
                onClick={() => { setActiveTab("user"); setStep(1); setError(null); }}
                className={`relative z-10 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "user" ? "text-black" : "text-gray-500 hover:text-gray-300"}`}
              >
                Usuario
              </button>
              <button
                onClick={() => { setActiveTab("admin"); setStep(1); setError(null); }}
                className={`relative z-10 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "admin" ? "text-black" : "text-gray-500 hover:text-gray-300"}`}
              >
                Admin
              </button>
              <motion.div
                className="absolute top-0 bottom-0 left-0 rounded-2xl bg-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                initial={false}
                animate={{ x: activeTab === "user" ? "0%" : "100%", width: "50%" }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 backdrop-blur-md"
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
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Email de Usuario</label>
                        </div>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-2xl blur-xl group-focus-within:bg-[#D4AF37]/10 transition-all" />
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#D4AF37] transition-colors" size={20} />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@correo.com"
                            className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white font-medium relative z-10 backdrop-blur-md"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 text-center block">Código de Acceso</label>
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            required
                            maxLength={6}
                            autoFocus
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="000 000"
                            className="w-full px-6 py-6 bg-white/5 border border-white/10 rounded-2xl text-4xl tracking-[0.5em] text-center focus:outline-none focus:border-[#D4AF37] transition-all text-[#D4AF37] font-black backdrop-blur-md"
                          />
                        </div>
                        <p className="text-center text-xs text-gray-600 mt-4 font-medium">Revisa tu bandeja de entrada</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-4 group disabled:opacity-50 overflow-hidden relative ${step === 2
                    ? "bg-[#D4AF37] text-black hover:scale-[1.02] shadow-[0_20px_40px_rgba(212,175,55,0.2)]"
                    : "bg-white text-black hover:bg-[#D4AF37] hover:scale-[1.02] shadow-[0_20px_40px_rgba(255,255,255,0.05)]"
                    }`}
                >
                  <span className="relative z-10">{loading ? "Validando..." : (step === 1 ? "Continuar" : "Entrar")}</span>
                  {!loading && <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />}
                </button>

                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-[10px] text-gray-600 font-bold uppercase tracking-widest hover:text-[#D4AF37] transition-colors pt-4"
                  >
                    ¿No recibiste el código? Volver
                  </button>
                )}
              </form>
            ) : (
              <form key="admin-form" onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Terminal ID (Email)</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Código de Seguridad</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-[#D4AF37] text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] transition-all shadow-xl shadow-[#D4AF37]/10 disabled:opacity-50"
                >
                  {loading ? "Iniciando Terminal..." : "Acceder al Panel de Control"}
                </button>
              </form>
            )}
          </div>

          <div className="mt-16 flex items-center justify-between border-t border-white/5 pt-8">
            <div className="flex gap-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">FIGHTLAB 2026</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}