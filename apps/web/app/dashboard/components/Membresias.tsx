"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Rocket, Sparkles } from "lucide-react";

interface MembresiasProps {
  onPlanSelect?: (planName: string) => void;
  currentPlan?: string;
}

const plans = [
  {
    id: "basic", name: "Guerrero 4", price: 180, icon: <Zap size={24} />,
    fullName: "4 Clases / Mes",
    benefits: ["4 clases al mes", "Acceso a sede principal", "Vestuarios", "Evaluación inicial"],
    popular: false,
  },
  {
    id: "regular", name: "Guerrero 8", price: 250, icon: <Sparkles size={24} />,
    fullName: "8 Clases / Mes",
    benefits: ["8 clases al mes", "Acceso a sede principal", "Vestuarios", "1 sesión de técnica"],
    popular: false,
  },
  {
    id: "pro", name: "Guerrero 12", price: 320, icon: <Rocket size={24} />,
    fullName: "12 Clases / Mes",
    benefits: ["12 clases al mes", "Acceso total", "Vestuarios + casillero", "1 sesión personal/mes"],
    popular: true,
  },
  {
    id: "elite", name: "Ilimitado", price: 450, icon: <Crown size={24} />,
    fullName: "Ilimitado",
    benefits: ["Clases ilimitadas", "Acceso total", "Vestuarios premium", "Invitado mensual gratis"],
    popular: false,
  },
];

export default function Membresias({ onPlanSelect, currentPlan }: MembresiasProps) {
  const [acquiring, setAcquiring] = useState<string | null>(null);

  const handleAcquire = (plan: typeof plans[0]) => {
    setAcquiring(plan.id);
    setTimeout(() => {
      setAcquiring(null);
      onPlanSelect?.(plan.fullName);
    }, 1500);
  };

  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, i) => {
          const isActive = currentPlan === plan.fullName;
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-[2.5rem] p-10 glass border flex flex-col transition-all duration-500 ${
                plan.popular 
                  ? "border-[#D4AF37]/50 shadow-[0_0_50px_rgba(212,175,55,0.15)] scale-105 z-10" 
                  : "border-white/10 hover:border-[#D4AF37]/30"
              } ${isActive ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/20 shadow-[0_0_30px_rgba(212,175,55,0.2)]" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-2 text-[10px] px-5 py-2 rounded-full font-black bg-[#D4AF37] text-black uppercase tracking-[0.2em] shadow-xl shadow-[#D4AF37]/30">
                    <Sparkles size={12} /> RECOMENDADO
                  </span>
                </div>
              )}

              <div className="mb-10 text-center">
                <div className={`w-16 h-16 rounded-3xl mb-6 mx-auto flex items-center justify-center bg-white/5 text-[#D4AF37] shadow-lg`}>
                  {plan.icon}
                </div>
                <h3 className="text-3xl font-black mb-3 text-white">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-black text-white">$ {plan.price}</span>
                  <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">/ mes</span>
                </div>
              </div>

              <ul className="space-y-5 flex-1 mb-10">
                {plan.benefits.map(b => (
                  <li key={b} className="flex items-center gap-4 text-sm text-gray-400 font-medium">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#D4AF37]/10 text-[#D4AF37]">
                      <Check size={14} />
                    </div>
                    {b}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => !isActive && handleAcquire(plan)}
                disabled={isActive}
                className={`w-full py-5 rounded-2xl text-xs font-black tracking-[0.2em] transition-all duration-500 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                    : plan.popular
                      ? "bg-[#D4AF37] hover:bg-[#FFD700] text-black shadow-xl shadow-[#D4AF37]/20"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/5"
                }`}
              >
                {acquiring === plan.id ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    PROCESANDO...
                  </div>
                ) : isActive ? "PLAN ACTUAL" : "ADQUIRIR AHORA"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
