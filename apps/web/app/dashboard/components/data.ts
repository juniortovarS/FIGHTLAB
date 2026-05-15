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
  const endB = startB + classB.duration;
  return (startA < endB && startB < endA);
};

const generateClasses = (): ClassItem[] => {
  const baseClasses = [
    { 
      name: "Muay Thai", coach: "Alex 'El Toro'", time: "08:00", duration: 60, icon: "🥊", gradient: "from-indigo-600 to-violet-600", level: "Intermedio", sede: "Primavera",
      description: "Arte de las ocho extremidades. Aprende combinaciones de codos, rodillas, patadas y clinching.",
      benefits: ["Defensa Personal", "Quema de Grasa", "Coordinación"]
    },
    { 
      name: "Boxing", coach: "Miguel Cotto", time: "09:15", duration: 60, icon: "🥊", gradient: "from-red-600 to-orange-600", level: "Principiante", sede: "La Mar",
      description: "Técnica pura de manos, juego de pies y esquivas. Ideal para todos los niveles.",
      benefits: ["Velocidad", "Potencia de Golpeo", "Reflejos"]
    },
    { 
      name: "Power Boxing", coach: "Canelo Style", time: "14:00", duration: 60, icon: "🔥", gradient: "from-rose-600 to-orange-600", level: "Avanzado", sede: "Primavera",
      description: "Entrenamiento de alta intensidad combinando boxeo con intervalos de potencia explosiva.",
      benefits: ["Fuerza Explosiva", "Alta Intensidad", "Resistencia"]
    },
    { 
      name: "Funcional Training", coach: "Coach Fit", time: "17:00", duration: 60, icon: "💪", gradient: "from-blue-600 to-cyan-600", level: "Principiante", sede: "Primavera",
      description: "Entrenamiento diseñado para mejorar el rendimiento físico en la vida diaria y el deporte.",
      benefits: ["Core Fuerte", "Movilidad", "Fuerza General"]
    },
    { 
      name: "Booty Lab", coach: "Coach GL", time: "18:15", duration: 60, icon: "🍑", gradient: "from-pink-600 to-rose-600", level: "Intermedio", sede: "La Mar",
      description: "Enfoque especializado en glúteos y piernas. Tonificación y fuerza localizada.",
      benefits: ["Tonificación", "Fuerza Inferior", "Resistencia Muscular"]
    },
    { 
      name: "Muay Thai", coach: "Sanchai Jr.", time: "14:30", duration: 60, icon: "🥊", gradient: "from-indigo-600 to-violet-600", level: "Avanzado", sede: "La Mar",
      description: "Muay Thai avanzado enfocado en sparring y estrategia de combate.",
      benefits: ["Estrategia", "Clinch Avanzado", "Timing"]
    },
    { 
      name: "Boxing", coach: "Iron Mike", time: "19:00", duration: 60, icon: "🥊", gradient: "from-red-600 to-orange-600", level: "Principiante", sede: "Primavera",
      description: "Clase de boxeo enfocada en fundamentos y técnica defensiva.",
      benefits: ["Guardia", "Desplazamiento", "Jabs"]
    },
    { 
      name: "Power Boxing", coach: "GGG Style", time: "20:30", duration: 60, icon: "🔥", gradient: "from-rose-600 to-orange-600", level: "Intermedio", sede: "Primavera",
      description: "Entrenamiento cardiovascular intenso con sacos y manoplas.",
      benefits: ["Cardio", "Técnica", "Desestrés"]
    },
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
