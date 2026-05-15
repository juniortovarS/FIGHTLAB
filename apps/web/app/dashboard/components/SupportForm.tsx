"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Send, Image as ImageIcon, CheckCircle2, X } from "lucide-react";

export default function SupportForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Falla Técnica / Soporte",
    message: ""
  });
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image }),
      });
      if (res.ok) {
        setSent(true);
        setFormData({ name: "", email: "", subject: "Falla Técnica / Soporte", message: "" });
        setImage(null);
      }
    } catch (err) {
      console.error("Error enviando soporte");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 rounded-[3rem] border-[#D4AF37]/20 text-center"
      >
        <div className="w-20 h-20 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-[#D4AF37]" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Reporte Enviado</h2>
        <p className="text-gray-400 mb-8">El equipo de soporte técnico revisará tu caso en breve.</p>
        <button onClick={() => setSent(false)} className="px-8 py-4 bg-white text-black font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-[#D4AF37] transition-all">
          Enviar otro reporte
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre Completo</label>
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:border-[#D4AF37]/50"
            placeholder="Tu nombre"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email de Contacto</label>
          <input 
            type="email" 
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:border-[#D4AF37]/50"
            placeholder="tu@correo.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Detalle del Problema</label>
        <textarea 
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:border-[#D4AF37]/50 resize-none"
          placeholder="Describe brevemente lo que sucede..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Captura de Pantalla (Opcional)</label>
        <div className="flex items-center gap-4">
          <label className="flex-1 cursor-pointer flex items-center justify-center gap-3 p-8 border-2 border-dashed border-white/10 rounded-[2rem] hover:border-[#D4AF37]/30 transition-all group">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <ImageIcon className="text-gray-500 group-hover:text-[#D4AF37]" size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">
              {image ? "Imagen Cargada" : "Haz clic para subir imagen"}
            </span>
          </label>
          {image && (
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-[#D4AF37]/50">
              <img src={image} className="w-full h-full object-cover" />
              <button onClick={() => setImage(null)} className="absolute top-1 right-1 bg-black/80 rounded-full p-1 text-red-400 hover:text-white">
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-[#D4AF37] text-black rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-[#FFD700] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#D4AF37]/20 disabled:opacity-50"
      >
        {loading ? "Enviando Reporte..." : (
          <>
            <Send size={18} /> Enviar a Soporte Técnico
          </>
        )}
      </button>
    </form>
  );
}
