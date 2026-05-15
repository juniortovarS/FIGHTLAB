export type NavSection = "reservar" | "mis-reservas" | "anuncios" | "membresias" | "perfil" | "historial" | "planner" | "usuarios" | "configuracion" | "soporte" | "dashboard";
export type Sede = "Todas" | "Primavera" | "La Mar";
export type DayFilter = "Hoy" | "Próximas";

export interface ClassItem {
  id: string;
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
  id: string | number;
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
  clasesDisponibles?: number;
  reservations?: string;
}

export const PLANS = ["4 Clases / Mes", "8 Clases / Mes", "12 Clases / Mes", "Ilimitado", "Staff / Coach", "Administración"];

export const checkOverlap = (classA: ClassItem, classB: ClassItem): boolean => {
  if (classA.date !== classB.date) return false;
  const getMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return (h ?? 0) * 60 + (m ?? 0);
  };
  const startA = getMinutes(classA.time);
  const endA = startA + classA.duration;
  const startB = getMinutes(classB.time);
  const endB = startB + startB + classA.duration;
  return (startA < endB && startB < endA);
};

const generateClasses = (): ClassItem[] => {
  const baseClasses = [
    { name: "Muay Thai Técnico", coach: "Alex 'El Toro'", time: "08:00", duration: 60, icon: "🥊", gradient: "from-indigo-600 to-violet-600", level: "Intermedio", sede: "Primavera" },
    { name: "BJJ Gi — Fundamentos", coach: "Carlos Gracie Jr.", time: "09:00", duration: 90, icon: "🥋", gradient: "from-blue-600 to-cyan-600", level: "Principiante", sede: "La Mar" },
    { name: "Boxeo Técnico", coach: "Canelo", time: "13:30", duration: 60, icon: "🥊", gradient: "from-amber-600 to-red-600", level: "Intermedio", sede: "Primavera" },
    { name: "Boxeo Tradicional", coach: "Miguel Cotto", time: "10:30", duration: 60, icon: "🥊", gradient: "from-red-600 to-orange-600", level: "Principiante", sede: "Primavera" },
    { name: "Boxeo Elite", coach: "Canelo Style", time: "16:00", duration: 60, icon: "🥊", gradient: "from-rose-600 to-orange-600", level: "Avanzado", sede: "Primavera" },
    { name: "Wrestling / Lucha", coach: "Jordan Borroughs", time: "18:00", duration: 60, icon: "🤼", gradient: "from-amber-600 to-orange-600", level: "Intermedio", sede: "La Mar" },
    { name: "Kickboxing", coach: "Israel Adesanya", time: "19:30", duration: 60, icon: "🦵", gradient: "from-emerald-600 to-teal-600", level: "Principiante", sede: "Primavera" },
  ];

  const classes: ClassItem[] = [];
  let globalId = 1;

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0]!;

    baseClasses.forEach((bc) => {
      const classId = `${dateStr}-${bc.time}-${bc.name.replace(/\s+/g, "-")}`;
      classes.push({
        ...bc,
        id: classId,
        date: dateStr,
        spots: 14,
        totalSpots: 14,
        description: `Clase de ${bc.name} de alto rendimiento. Enfocada en técnica y resistencia física bajo la supervisión de ${bc.coach}.`,
        benefits: ["Técnica Superior", "Acondicionamiento", "Disciplina Mental"]
      } as ClassItem);
    });
  }
  return classes;
};

export const mockClasses: ClassItem[] = generateClasses();
const today = new Date().toISOString().split("T")[0]!;

export const mockReservations: Reservation[] = [
  { id: 101, classItem: mockClasses[0]!, status: "Finalizada", reservedAt: today },
];

export const mockUsers: UserItem[] = [
  { id: 1, name: "Junior Tovar", email: "junior.tovar@example.com", role: "Alumno", plan: "Regular", status: "Activo", joinDate: "2024-01-15", clasesDisponibles: 4 },
];
