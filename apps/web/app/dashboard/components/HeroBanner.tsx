"use client";
import { motion } from "framer-motion";
import { Flame, ChevronRight, Trophy, Zap } from "lucide-react";
import { NavSection } from "./data";

interface HeroBannerProps {
  userName: string;
  userEmail: string;
  classesLeft: number;
  daysActive: number;
  expiryDate?: string | null;
  onNav: (s: NavSection) => void;
}

export default function HeroBanner({ userName, userEmail, classesLeft, daysActive, expiryDate, onNav }: HeroBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl mb-8 noise"
      style={{
        background: "linear-gradient(135deg, #0f0c00 0%, #0B0B0B 45%, #100f00 100%)",
        border: "1px solid rgba(212,175,55,0.2)",
        minHeight: 180,
      }}
    >
      {/* Animated background beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute h-px w-full"
          style={{
            top: "40%",
            background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 50%, transparent 100%)",
          }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute h-px w-1/2"
          style={{
            top: "70%",
            background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.08) 50%, transparent 100%)",
          }}
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        {/* Radial glow center */}
        <div className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 5% 50%, rgba(212,175,55,0.07) 0%, transparent 70%)",
          }} />
        <div className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 40% 60% at 95% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)",
          }} />
      </div>

      {/* Gold accent top border */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)" }} />

      <div className="relative px-7 py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left */}
        <div className="flex items-center gap-5">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                color: "#0B0B0B",
                boxShadow: "0 0 30px rgba(212,175,55,0.4), 0 8px 24px rgba(0,0,0,0.4)",
              }}
            >
              {userName?.[0]?.toUpperCase() ?? "F"}
            </div>
            <motion.div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "#22c55e", border: "2px solid #0B0B0B" }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 rounded-full bg-white/50" />
            </motion.div>
          </motion.div>

          <div>
            <motion.p
              className="text-xs font-bold tracking-[0.15em] mb-1"
              style={{ color: "#D4AF37", opacity: 0.7 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.3 }}
            >
              BIENVENIDO DE VUELTA
            </motion.p>
            <motion.h2
              className="text-2xl font-black leading-tight"
              style={{ fontFamily: "Outfit", color: "#F5F5F5" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              {userName || "Atleta FightLab"}
            </motion.h2>
            <motion.div
              className="flex items-center gap-2 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(212,175,55,0.12)",
                  color: "#D4AF37",
                  border: "1px solid rgba(212,175,55,0.25)",
                }}>
                <Trophy size={10} /> FIGHTER
              </span>
              <span className="text-xs" style={{ color: "#374151" }}>Membresía activa</span>
            </motion.div>
          </div>
        </div>

        {/* Right: Stats + Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Stats */}
          {[
            { label: "Clases restantes", value: classesLeft, icon: <Flame size={14} /> },
            {
              label: "Tu membresía acabará",
              value: expiryDate ? new Date(expiryDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : "S/D",
              icon: <Zap size={14} />
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-gold rounded-xl px-5 py-3 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center justify-center gap-1 mb-0.5" style={{ color: "#D4AF37" }}>
                {stat.icon}
                <span className="text-2xl font-black" style={{ fontFamily: "Outfit" }}>{stat.value}</span>
              </div>
              <p className="text-[10px] font-medium" style={{ color: "#6B7280" }}>{stat.label}</p>
            </motion.div>
          ))}

          {/* Action buttons */}
          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={() => onNav("perfil")}
              whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(212,175,55,0.3)" }}
              whileTap={{ scale: 0.97 }}
              className="shimmer flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                color: "#0B0B0B",
              }}
            >
              Mi Perfil <ChevronRight size={12} />
            </motion.button>
            <motion.button
              onClick={() => onNav("historial")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: "#6B7280",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              Historial
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
