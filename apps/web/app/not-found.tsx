"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl font-black text-[#D4AF37] mb-4">404</h1>
      <p className="text-gray-400 mb-8 uppercase tracking-widest text-xs">Página no encontrada</p>
      <Link 
        href="/login"
        className="px-8 py-4 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-all"
      >
        Volver al Sistema
      </Link>
    </div>
  );
}
