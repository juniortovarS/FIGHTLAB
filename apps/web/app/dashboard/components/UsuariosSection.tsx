"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Filter, MoreHorizontal, Mail, User, ShieldCheck, BadgeCheck, Users as UsersIcon, X, Calendar, CreditCard } from "lucide-react";
import { UserItem, PLANS } from "./data";

interface UsuariosSectionProps {
  users: UserItem[];
  onUpdateUser: (u: UserItem) => void;
  onAddUser: (u: UserItem) => void;
}

export function UsuariosSection({ users, onUpdateUser, onAddUser }: UsuariosSectionProps) {
  const [activeTab, setActiveTab] = useState<"Clientes" | "Staff">("Clientes");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Alumno" as "Alumno" | "Coach" | "Admin" | "Staff",
    plan: "Regular",
    status: "Activo" as "Activo" | "Inactivo" | "Pendiente",
    planActiveDate: (new Date().toISOString().split('T')[0]!) as string,
    clasesDisponibles: 0
  });

  const filteredUsers = users.filter(u => {
    const matchesTab = activeTab === "Clientes" ? u.role === "Alumno" : u.role !== "Alumno";
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "Alumno",
      plan: "Regular",
      status: "Activo",
      planActiveDate: new Date().toISOString().split('T')[0]!,
      clasesDisponibles: 0
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      status: user.status,
      planActiveDate: user.planActiveDate || new Date().toISOString().split('T')[0]!,
      clasesDisponibles: user.clasesDisponibles || 0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const activeDate = new Date(formData.planActiveDate || new Date());
    const expiryDate = new Date(activeDate);
    expiryDate.setDate(expiryDate.getDate() + 30);

    const userData: UserItem = {
      id: editingUser ? editingUser.id : Date.now(),
      joinDate: editingUser ? (editingUser.joinDate || new Date().toISOString().split('T')[0]!) : new Date().toISOString().split('T')[0]!,
      ...formData,
      planExpiryDate: expiryDate.toISOString().split('T')[0]!
    };

    if (editingUser) {
      onUpdateUser(userData);
    } else {
      onAddUser(userData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[#D4AF37] text-xs mb-1 uppercase tracking-widest font-black flex items-center gap-2">
            <UsersIcon size={14} /> Gestión de Personal y Miembros
          </p>
          <h2 className="text-3xl font-black text-white">Administra usuarios y miembros de tu equipo</h2>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[#B8962D] transition-all shadow-[0_4px_20px_rgba(212,175,55,0.2)] group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          <span>Nuevo</span>
        </button>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex bg-white/5 p-1 rounded-2xl w-fit border border-white/5">
          {["Clientes", "Staff"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-1 md:max-w-md">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all placeholder:text-gray-600 font-medium text-white"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredUsers.map((user, idx) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="glass p-6 rounded-[32px] group hover:border-[#D4AF37]/40 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

              <div className="absolute top-6 right-6">
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  user.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                }`}>
                  {user.status}
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6 relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-[#D4AF37]/10">
                  {user.role === 'Coach' ? <ShieldCheck size={24} /> : user.role === 'Staff' ? <BadgeCheck size={24} /> : <User size={24} />}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="text-lg font-black text-white truncate group-hover:text-[#D4AF37] transition-colors">{user.name}</h3>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                    <Mail size={12} className="text-[#D4AF37]" /> {user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6 relative">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.05] transition-colors">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em]">Plan / Cargo</span>
                    <span className="text-white text-xs font-black">{user.plan}</span>
                  </div>
                  {user.planExpiryDate && (
                    <div className="text-right">
                      <span className="text-gray-500 text-[8px] font-bold uppercase block">Vence el</span>
                      <span className="text-[#D4AF37] text-[10px] font-bold">{user.planExpiryDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 relative">
                <button 
                  onClick={() => handleOpenEdit(user)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300"
                >
                  Gestionar Plan
                </button>
                <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group/btn">
                  <MoreHorizontal size={18} className="text-gray-400 group-hover/btn:text-white" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-[#121212] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-white">{editingUser ? "Editar Usuario" : "Nuevo Guerrero"}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#D4AF37]/50 outline-none transition-all text-white"
                        placeholder="Ej: Junior Tovar"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email de Acceso</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#D4AF37]/50 outline-none transition-all text-white"
                        placeholder="ejemplo@fightlab.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Rol en el Gremio</label>
                      <select 
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#D4AF37]/50 outline-none transition-all text-white appearance-none"
                      >
                        <option value="Alumno" className="bg-[#121212]">Alumno</option>
                        <option value="Coach" className="bg-[#121212]">Coach</option>
                        <option value="Staff" className="bg-[#121212]">Staff</option>
                        <option value="Admin" className="bg-[#121212]">Admin</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Plan / Membresía</label>
                      <select 
                        value={formData.plan}
                        onChange={e => setFormData({...formData, plan: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#D4AF37]/50 outline-none transition-all text-white appearance-none"
                      >
                        {PLANS.map(p => <option key={p} value={p} className="bg-[#121212]">{p}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Activación de Plan</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input 
                          type="date" 
                          value={formData.planActiveDate}
                          onChange={e => setFormData({...formData, planActiveDate: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm focus:border-[#D4AF37]/50 outline-none transition-all text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Estado</label>
                      <select 
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#D4AF37]/50 outline-none transition-all text-white appearance-none"
                      >
                        <option value="Activo" className="bg-[#121212]">Activo</option>
                        <option value="Inactivo" className="bg-[#121212]">Inactivo</option>
                        <option value="Pendiente" className="bg-[#121212]">Pendiente</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Clases Disponibles</label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input 
                          type="number" 
                          value={formData.clasesDisponibles}
                          onChange={e => setFormData({...formData, clasesDisponibles: parseInt(e.target.value) || 0})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm focus:border-[#D4AF37]/50 outline-none transition-all text-white"
                          placeholder="Ej: 8"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-4 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all text-gray-500"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] py-4 rounded-2xl bg-[#D4AF37] text-black text-xs font-black uppercase tracking-widest hover:bg-[#FFD700] transition-all shadow-xl shadow-[#D4AF37]/20"
                    >
                      {editingUser ? "Guardar Cambios" : "Reclutar Guerrero"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
