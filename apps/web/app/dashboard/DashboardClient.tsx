"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavSection, ClassItem, Reservation, mockReservations, mockClasses, checkOverlap } from "./components/data";
import Sidebar from "./components/Sidebar";
import ClassesSection from "./components/ClassesSection";
import MisReservas from "./components/MisReservas";
import Anuncios from "./components/Anuncios";
import Membresias from "./components/Membresias";
import MiPerfil from "./components/MiPerfil";
import { UsuariosSection } from "./components/UsuariosSection";
import HeroBanner from "./components/HeroBanner";
import AICoach from "./ai-coach";
import { Menu, Zap, Target, Users, TrendingUp, Sparkles, ShieldAlert, LifeBuoy } from "lucide-react";
import SupportForm from "./components/SupportForm";
import { signOut } from "next-auth/react";
import { UserItem } from "./components/data";

interface DashboardClientProps {
  userName: string;
  userEmail: string;
  userId?: string;
}

const sectionTitles: Record<NavSection, string> = {
  "dashboard": "Panel de Control",
  "planner": "Planner Semanal",
  "usuarios": "Gestión de Usuarios",
  "reservar": "Clases Disponibles",
  "mis-reservas": "Mis Reservas",
  "anuncios": "Notificaciones",
  "membresias": "Planes Premium",
  "perfil": "Mi Cuenta",
  "historial": "Historial de Clases",
  "configuracion": "Configuración",
  "soporte": "Soporte Técnico",
};

export default function DashboardClient({ userName, userEmail, userId }: DashboardClientProps) {
  const isAdmin = userEmail === "adminfightlab@gmail.com" || userEmail === "admin@fightlab.ai";

  const [activeSection, setActiveSection] = useState<NavSection>(isAdmin ? "dashboard" : "reservar");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>(isAdmin ? mockReservations : []);
  const [currentPlan, setCurrentPlan] = useState<{ name: string; price: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fightlab_user_id");
      return saved ? parseInt(saved) : null;
    }
    return null;
  });

  const completedClasses = useMemo(() => reservations.filter(r => r.status === "Finalizada").length, [reservations]);
  const activeReservationsCount = useMemo(() => reservations.filter(r => r.status === "Confirmada").length, [reservations]);

  const me = useMemo(() => {
    // Primero intentamos encontrar por email exacto de la sesión (lo más seguro)
    let found = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
    
    // Si no, por ID (para persistencia de alumnos que cambiaron de email)
    if (!found) {
      found = users.find(u =>
        (currentUserId && u.id === currentUserId) ||
        (userId && u.id.toString() === userId.toString())
      );
    }
    
    // Si es admin, forzamos su identidad administrativa pase lo que pase
    if (isAdmin && found) {
      return { ...found, name: "Administrador Principal", email: userEmail };
    }
    
    return found;
  }, [users, currentUserId, userId, userEmail, isAdmin]);

  const planDetails = useMemo(() => {
    const planName = me?.plan || "";
    if (planName.includes("12")) return { max: 12, price: 169 };
    if (planName.includes("8")) return { max: 8, price: 139 };
    if (planName.includes("4")) return { max: 4, price: 119 };
    if (planName.includes("Ilimitado")) return { max: 999, price: 219 };
    return { max: 0, price: 0 };
  }, [me?.plan]);

  const maxClasses = useMemo(() => {
    // Si el admin asignó clases específicas (y son mayores a 0), esas mandan.
    if (me?.clasesDisponibles && me.clasesDisponibles > 0) return me.clasesDisponibles;
    // Si no (es 0 o null), mandan las del plan.
    return planDetails.max;
  }, [me?.clasesDisponibles, planDetails.max]);

  const classesLeft = useMemo(() => Math.max(0, maxClasses - activeReservationsCount - completedClasses), [maxClasses, activeReservationsCount, completedClasses]);
  const activeDisciplines = useMemo(() => new Set(reservations.map(r => r.classItem.name.split(" ")[0])).size, [reservations]);

  const [activeSince, setActiveSince] = useState<string | null>(null);
  const [planExpiry, setPlanExpiry] = useState<string | null>(null);

  const daysActive = useMemo(() => {
    if (!activeSince) return 1;
    const startDate = new Date(activeSince);
    startDate.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const diffTime = now.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays > 31) return 31;
    if (diffDays < 1) return 1;
    return diffDays;
  }, [activeSince]);

  const userLevel = Math.floor(completedClasses / 6) + 1;

  const classesWithActualSpots = useMemo(() => {
    const classes = mockClasses.map(c => ({ ...c }));
    users.forEach(u => {
      if (u.reservations) {
        try {
          const userRes: Reservation[] = typeof u.reservations === "string" ? JSON.parse(u.reservations) : u.reservations;
          if (Array.isArray(userRes)) {
            userRes.forEach(r => {
              if (r.status === "Confirmada") {
                const target = classes.find(c =>
                  c.id === r.classItem.id ||
                  (c.name === r.classItem.name && c.date === r.classItem.date && c.time === r.classItem.time)
                );
                if (target) {
                  target.spots = Math.max(0, target.spots - 1);
                }
              }
            });
          }
        } catch (e) {}
      }
    });
    return classes;
  }, [users]);

  useEffect(() => {
    if (!userEmail) return;

    fetch("/api/users")
      .then(res => res.json())
      .then(data => {
        const usersList = Array.isArray(data) ? data : (data.users || []);
        setUsers(usersList);

        const savedId = localStorage.getItem("fightlab_user_id");
        const me = usersList.find((u: any) => u.email.toLowerCase() === userEmail.toLowerCase()) || 
                   usersList.find((u: any) => 
                     !isAdmin && (
                       (currentUserId && u.id === currentUserId) ||
                       (savedId && u.id.toString() === savedId)
                     )
                   );

        if (me) {
          setCurrentUserId(me.id);
          localStorage.setItem("fightlab_user_id", me.id.toString());
          setActiveSince(me.planActiveDate || me.joinDate || null);
          setPlanExpiry(me.planExpiryDate || null);

          if (me.plan) {
            setCurrentPlan({ name: me.plan, price: 0 });
          }

          if (me.reservations && me.reservations !== "null") {
            try {
              const parsed = typeof me.reservations === "string" ? JSON.parse(me.reservations) : me.reservations;
              setReservations(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
              setReservations([]);
            }
          }
        }
      })
      .catch(err => {
        console.error(">>> DASHBOARD: Error fetching users:", err);
      });
  }, [userEmail]);

  // Efecto para marcar clases como finalizadas automáticamente
  useEffect(() => {
    if (!userEmail || reservations.length === 0) return;

    const checkCompletion = () => {
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0]!;
      const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

      let changed = false;
      const updatedReservations = reservations.map(res => {
        if (res.status === "Confirmada") {
          const [h, m] = res.classItem.time.split(":").map(Number);
          const startTimeMinutes = (h ?? 0) * 60 + (m ?? 0);
          const endTimeMinutes = startTimeMinutes + res.classItem.duration;

          // Si es de hoy y ya pasó la hora de fin (ej: 13:30 + 60min = 14:30)
          if (res.classItem.date === todayStr && currentTimeMinutes >= endTimeMinutes) {
            changed = true;
            return { ...res, status: "Finalizada" as const };
          }
          // Si la fecha ya pasó
          if (res.classItem.date < todayStr) {
            changed = true;
            return { ...res, status: "Finalizada" as const };
          }
        }
        return res;
      });

      if (changed) {
        console.log(">>> DASHBOARD: Detectadas clases finalizadas. Actualizando...");
        setReservations(updatedReservations);

        // Actualizar lista local de usuarios
        setUsers(prev => prev.map(u =>
          u.email.toLowerCase() === userEmail.toLowerCase()
            ? { ...u, reservations: JSON.stringify(updatedReservations) }
            : u
        ));

        // Sincronizar con DB
        fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            name: userName,
            reservations: JSON.stringify(updatedReservations)
          })
        });
      }
    };

    const interval = setInterval(checkCompletion, 20000); // Revisar cada 20 seg
    checkCompletion();

    return () => clearInterval(interval);
  }, [reservations, userEmail, userName]);

  // Scroll al inicio al cambiar de sección
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  const handleUpdateUser = async (updatedUser: UserItem) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser)
    });
  };

  const handleAddUser = async (newUser: UserItem) => {
    setUsers(prev => [newUser, ...prev]);
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });
  };

  const handleProfileUpdate = async (data: { name: string; email: string; phone: string }) => {
    const me = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
    if (!me) return;

    // Verificar si el nuevo email ya está en uso por OTRO usuario
    const collision = users.find(u => u.id !== me.id && u.email.toLowerCase() === data.email.toLowerCase());
    if (collision) {
      throw new Error("Este correo ya está registrado por otro guerrero.");
    }

    // Sincronizar con el backend
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: me.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
      })
    });
    // Guardar ID en localStorage inmediatamente para asegurar persistencia tras F5
    localStorage.setItem("fightlab_user_id", me.id.toString());
    setCurrentUserId(me.id);

    // Actualizar localmente
    setUsers(prev => prev.map(u => u.id === me.id ? { ...u, name: data.name, email: data.email, phone: data.phone } : u));
  };

  const handleReserve = (item: ClassItem) => {
    if (maxClasses !== 999 && (activeReservationsCount + completedClasses) >= maxClasses) {
      setError(`⚠️ Has alcanzado el límite de tu plan (${maxClasses} clases).`);
      setTimeout(() => setError(null), 4000);
      return;
    }
    const overlapping = reservations.find(r =>
      r.status === "Confirmada" &&
      (
        r.classItem.id === item.id ||
        (r.classItem.name === item.name && r.classItem.date === item.date && r.classItem.time === item.time) ||
        checkOverlap(r.classItem, item)
      )
    );
    if (overlapping) {
      const isSame = overlapping.classItem.name === item.name && overlapping.classItem.time === item.time;
      setError(isSame
        ? `⚠️ Ya tienes '${item.name}' reservado.`
        : `⚠️ Conflicto horario con '${overlapping.classItem.name}' (${overlapping.classItem.time}).`
      );
      setTimeout(() => setError(null), 4000);
      return;
    }
    const newReservation: Reservation = {
      id: Date.now(),
      classItem: { ...item, spots: item.spots - 1 },
      status: "Confirmada",
      reservedAt: new Date().toISOString().split("T")[0]!
    };

    const updatedReservations = [newReservation, ...reservations];
    setReservations(updatedReservations);

    // Actualizamos también la lista local de usuarios para mantener consistencia
    setUsers(prev => prev.map(u =>
      u.email.toLowerCase() === userEmail.toLowerCase()
        ? { ...u, reservations: JSON.stringify(updatedReservations) }
        : u
    ));

    // Guardamos en la base de datos vía Proxy
    const payload = {
      email: userEmail,
      name: userName, // Importante para el upsert si el usuario no existe
      reservations: JSON.stringify(updatedReservations)
    };

    console.log(">>> DASHBOARD: Guardando reserva...", payload);

    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(r => r.json()).then(res => {
      console.log(">>> DASHBOARD: Respuesta guardado:", res);
      if (!res.success) {
        alert("⚠️ ERROR AL GUARDAR EN NUBE: " + res.error);
        // Revertimos el estado local si falló el guardado? 
        // Por ahora solo avisamos.
      }
    });

  };

  const handleCancel = (id: string | number) => {
    const updated = reservations.map(r => r.id === id ? { ...r, status: "Cancelada" as const } : r);
    setReservations(updated);

    const reservation = reservations.find(r => r.id === id);
    if (reservation && reservation.status === "Confirmada") {
      reservation.classItem.spots = Math.min(reservation.classItem.totalSpots, reservation.classItem.spots + 1);
    }

    // Sincronizamos con la base de datos
    const payload = {
      email: userEmail,
      name: userName,
      reservations: JSON.stringify(updated)
    };

    setUsers(prev => prev.map(u =>
      u.email.toLowerCase() === userEmail.toLowerCase()
        ? { ...u, reservations: JSON.stringify(updated) }
        : u
    ));

    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return isAdmin ? (
          <div className="p-10 glass rounded-[2.5rem] border border-white/5 text-center text-gray-500 font-medium">Dashboard Administrativo</div>
        ) : (
          <div className="p-10 glass rounded-[2.5rem] border border-red-500/20 text-center text-red-400 flex flex-col items-center gap-4">
            <ShieldAlert size={48} />
            <p className="font-bold">Acceso Denegado</p>
          </div>
        );
      case "usuarios":
        return isAdmin ? <UsuariosSection users={users} onUpdateUser={handleUpdateUser} onAddUser={handleAddUser} /> : null;
      case "reservar": return (
        <ClassesSection 
          classes={classesWithActualSpots} 
          reservations={reservations} 
          users={users}
          isAdmin={isAdmin}
          onReserve={handleReserve} 
        />
      );
      case "mis-reservas": return (
        <MisReservas
          reservations={reservations}
          onCancel={handleCancel}
          hideHistory
          userName={userName}
          onGoToClasses={() => setActiveSection("reservar")}
        />
      );
      case "anuncios": return <Anuncios />;
      case "membresias": return <Membresias onPlanSelect={(p) => setCurrentPlan({ name: p, price: 0 })} currentPlan={currentPlan?.name} />;
      case "perfil":
        if (users.length === 0) return (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Zap className="animate-spin text-[#D4AF37]" size={40} />
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest animate-pulse">Cargando FIGHTER...</p>
          </div>
        );

        return (
          <MiPerfil
            key={me?.id || "loading"}
            userName={me?.name || userName}
            userEmail={me?.email || userEmail}
            userPhone={me?.phone}
            currentPlan={currentPlan?.name || "Sin Plan"}
            stats={{
              completed: completedClasses,
              disciplines: activeDisciplines,
              days: daysActive,
              remaining: maxClasses === 999 ? 999 : classesLeft,
              expiryDate: planExpiry
            }}
            onUpdate={handleProfileUpdate}
          />
        );
      case "historial": {
        const historyOnly = reservations.filter(r => r.status === "Finalizada" || r.status === "Cancelada");
        return historyOnly.length > 0 ? (
          <MisReservas reservations={historyOnly} onCancel={() => { }} hideUpcoming userName={userName} />
        ) : <div className="p-10 text-center text-gray-500 font-medium">No hay historial disponible.</div>;
      }
      case "soporte":
        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
              <p className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.3em] mb-4">¿Necesitas ayuda?</p>
              <h2 className="text-5xl font-black tracking-tighter text-white mb-6">CENTRO DE <span className="text-[#D4AF37]">ASISTENCIA</span></h2>
              <p className="text-gray-500 font-medium max-w-xl mx-auto">Reporta cualquier falla técnica o solicita ayuda con tu cuenta. Nuestro equipo responderá directamente a tu correo.</p>
            </div>
            <SupportForm />
          </div>
        );
      default: return (
        <ClassesSection 
          classes={classesWithActualSpots} 
          reservations={reservations} 
          users={users}
          isAdmin={isAdmin}
          onReserve={handleReserve} 
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#161616] text-white selection:bg-[#D4AF37]/30">
      <div className="fixed inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      <div className="fixed top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />

      {/* Top Mobile Bar (Hidden on Desktop) */}
      <div className="lg:hidden flex items-center justify-between p-5 glass sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-gray-400 hover:text-[#D4AF37] transition-colors"
        >
          <Menu size={24} />
        </button>
        <span className="font-black text-lg tracking-tighter uppercase">Fight<span className="text-[#D4AF37]">Lab</span></span>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-black font-black">
          {(me?.name || userName)?.[0]}
        </div>
      </div>

      <div className="flex">
        <Sidebar
          active={activeSection}
          isAdmin={isAdmin}
          onNav={(s: NavSection) => { setActiveSection(s); setSidebarOpen(false); }}
          userName={me?.name || userName}
          userEmail={me?.email || userEmail}
          onLogout={async () => { await signOut({ redirect: false }); window.location.href = "/login"; }}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        <main className="flex-1 lg:ml-64 p-5 lg:p-12 relative max-w-[1600px] mx-auto w-full">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-24 right-5 lg:right-12 z-[100] px-6 py-4 rounded-2xl glass-gold text-[#D4AF37] text-xs font-black uppercase tracking-widest shadow-2xl border border-[#D4AF37]/30"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Welcome Banner */}
          {!isAdmin && activeSection === "perfil" && (
            <div className="hidden lg:block mb-10">
              <HeroBanner
                userName={me?.name || userName}
                userEmail={me?.email || userEmail}
                classesLeft={maxClasses === 999 ? 999 : classesLeft}
                daysActive={daysActive}
                expiryDate={planExpiry}
                onNav={(s) => setActiveSection(s)}
              />
            </div>
          )}

          <header className="mb-8 lg:mb-12">
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl lg:text-5xl font-black mb-3 tracking-tight"
            >
              {sectionTitles[activeSection]}
            </motion.h1>
            <div className="flex flex-wrap items-center gap-3 text-gray-500 text-[11px] font-black uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                <Sparkles size={12} className="text-[#D4AF37]" /> FIGHTER Nivel {userLevel}
              </span>
              <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/10" />
              <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5">
                {maxClasses === 999 ? "Acceso Ilimitado" : `${classesLeft} Clases Disponibles`}
              </span>
            </div>
          </header>

          {/* Summary Cards - Only visible in specific sections */}
          {(activeSection === "reservar" || activeSection === "mis-reservas" || activeSection === "perfil") && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Clases Libres", value: maxClasses === 999 ? "∞" : classesLeft, icon: <Zap size={18} />, color: "text-[#D4AF37]" },
                { label: "Rango Actual", value: `LEVEL ${userLevel}`, icon: <Target size={18} />, color: "text-[#D4AF37]" },
                { label: "Plan Actual", value: currentPlan?.name || "Sin Plan", icon: <Users size={18} />, color: "text-emerald-400" },
                { label: "Progreso", value: `${completedClasses}/6`, icon: <TrendingUp size={18} />, color: "text-[#D4AF37]" },
              ].map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass p-6 lg:p-8 rounded-[2.5rem] border flex flex-col transition-all duration-500 group relative overflow-hidden ${m.color.includes("emerald")
                    ? "border-emerald-500/20 hover:border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.05)]"
                    : "border-white/10 hover:border-[#D4AF37]/40 shadow-[0_0_30px_rgba(212,175,55,0.05)]"
                    }`}
                >
                  <div className={`absolute -right-4 -top-4 w-16 h-16 blur-2xl opacity-[0.05] rounded-full transition-opacity group-hover:opacity-20 ${m.color.includes("emerald") ? "bg-emerald-500" : "bg-[#D4AF37]"
                    }`} />
                  <div className={`mb-4 p-3 rounded-xl w-fit bg-white/5 ${m.color} group-hover:scale-110 transition-transform`}>
                    {m.icon}
                  </div>
                  <p className="text-gray-500 text-[9px] lg:text-[10px] font-black uppercase tracking-widest mb-1">{m.label}</p>
                  <h3 className="text-xl lg:text-3xl font-black">{m.value}</h3>
                </motion.div>
              ))}
            </div>
          )}


          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderSection()}
          </motion.div>

          <div className="mt-20">
            <AICoach />
          </div>
        </main>
      </div>
    </div>
  );
}
