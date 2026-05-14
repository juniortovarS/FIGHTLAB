export type NavSection = "reservar" | "mis-reservas" | "anuncios" | "membresias" | "perfil" | "historial" | "planner" | "usuarios" | "configuracion" | "soporte" | "dashboard";
export type Sede = "Todas" | "Primavera" | "La Mar";
export type DayFilter = "Hoy" | "Próximas";

export interface ClassItem {
  id: number;
  name: string;
  coach: string;
  time: string; // HH:mm
  duration: number; // minutes
  date: string; // YYYY-MM-DD
  sede: Sede;
  spots: number;
  totalSpots: number;
  level: "Principiante" | "Intermedio" | "Avanzado";
  icon: string;
  gradient: string;
  description: string;
  benefits: string[];
}

export interface Reservation {
  id: number;
  classItem: ClassItem;
  status: "Confirmada" | "Cancelada" | "Finalizada";
  reservedAt: string;
}

export interface UserItem {
  id: number;
  name: string;
  email: string;
  role: "Alumno" | "Coach" | "Admin" | "Staff";
  plan: string;
  avatar?: string;
  status: "Activo" | "Inactivo" | "Pendiente";
  joinDate: string;
  planActiveDate?: string;
  planExpiryDate?: string;
}

export const PLANS = ["4 Clases / Mes", "8 Clases / Mes", "12 Clases / Mes", "Ilimitado", "Staff / Coach", "Administración"];

// Helper to check if two classes overlap
export const checkOverlap = (classA: ClassItem, classB: ClassItem): boolean => {
  if (classA.date !== classB.date) return false;

  const getMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return (h ?? 0) * 60 + (m ?? 0);
  };

  const startA = getMinutes(classA.time);
  const endA = startA + classA.duration;
  const startB = getMinutes(classB.time);
  const endB = startB + classB.duration;

  return (startA < endB && startB < endA);
};

const today = new Date().toISOString().split("T")[0]!;
const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]!;

export const mockClasses: ClassItem[] = [
  {
    id: 1, name: "Muay Thai Técnico", coach: "Alex 'El Toro'", time: "08:00", duration: 60,
    date: today, sede: "Primavera", spots: 4, totalSpots: 12, level: "Intermedio",
    icon: "🥊", gradient: "from-indigo-600 to-violet-600",
    description: "Enfoque en combinaciones de codos y rodillas.",
    benefits: ["Técnica pura", "Cardio intenso", "Defensa personal"]
  },
  {
    id: 2, name: "BJJ Gi — Fundamentos", coach: "Carlos Gracie Jr.", time: "09:00", duration: 90,
    date: today, sede: "La Mar", spots: 8, totalSpots: 15, level: "Principiante",
    icon: "🥋", gradient: "from-blue-600 to-cyan-600",
    description: "Aprende las bases del arte suave.",
    benefits: ["Control", "Disciplina", "Fuerza funcional"]
  },
  {
    id: 10, name: "Boxeo Tradicional", coach: "Miguel Cotto", time: "08:30", duration: 60,
    date: today, sede: "Primavera", spots: 12, totalSpots: 12, level: "Principiante",
    icon: "🥊", gradient: "from-red-600 to-orange-600",
    description: "Clase de boxeo puro. Cruza con Muay Thai.",
    benefits: ["Ganchos", "Jabs", "Esquiva"]
  },
  {
    id: 3, name: "Boxeo Elite", coach: "Canelo Style", time: "10:00", duration: 60,
    date: today, sede: "Primavera", spots: 0, totalSpots: 10, level: "Avanzado",
    icon: "🥊", gradient: "from-rose-600 to-orange-600",
    description: "Sparring y técnica avanzada de pies.",
    benefits: ["Agilidad", "Potencia", "Estrategia"]
  },
  {
    id: 4, name: "Wrestling / Lucha", coach: "Jordan Borroughs", time: "18:00", duration: 60,
    date: today, sede: "La Mar", spots: 5, totalSpots: 12, level: "Intermedio",
    icon: "🤼", gradient: "from-amber-600 to-orange-600",
    description: "Derribos y control en el suelo.",
    benefits: ["Explosividad", "Resistencia", "Equilibrio"]
  },
  {
    id: 5, name: "Kickboxing", coach: "Israel Adesanya", time: "08:30", duration: 60,
    date: tomorrow, sede: "Primavera", spots: 10, totalSpots: 15, level: "Principiante",
    icon: "🦵", gradient: "from-emerald-600 to-teal-600",
    description: "Combinaciones de pateo y golpeo.",
    benefits: ["Coordinación", "Quema de grasa", "Flexibilidad"]
  }
];

export const mockReservations: Reservation[] = [
  { id: 101, classItem: mockClasses[0]!, status: "Finalizada", reservedAt: today },
];

export const mockUsers: UserItem[] = [
  {
    id: 1,
    name: "Junior Tovar",
    email: "junior.tovar@example.com",
    role: "Alumno",
    plan: "Regular",
    status: "Activo",
    joinDate: "2024-01-15"
  },
  {
    id: 2,
    name: "Alex 'El Toro'",
    email: "alex.toro@fightlab.com",
    role: "Coach",
    plan: "Staff — Muay Thai",
    status: "Activo",
    joinDate: "2023-05-10"
  },
  {
    id: 3,
    name: "Maria Garcia",
    email: "maria.g@example.com",
    role: "Alumno",
    plan: "Premium",
    status: "Activo",
    joinDate: "2024-02-20"
  },
  {
    id: 4,
    name: "Carlos Gracie Jr.",
    email: "carlos.g@fightlab.com",
    role: "Coach",
    plan: "Staff — BJJ",
    status: "Activo",
    joinDate: "2023-11-12"
  },
  {
    id: 5,
    name: "Kevin Smith",
    email: "kevin.s@example.com",
    role: "Staff",
    plan: "Administración",
    status: "Activo",
    joinDate: "2023-08-05"
  }
];
