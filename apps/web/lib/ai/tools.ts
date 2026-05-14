import { tool } from 'ai';
import { z } from 'zod';

/* -------------------------
   TYPES
-------------------------- */

type GetClassesResult = {
  classes: {
    id: number;
    name: string;
    time: string;
    coach: string;
    spots: number;
  }[];
  message: string;
};

type BookClassInput = {
  className: string;
};

type BookClassResult = {
  success: true;
  className: string;
  message: string;
};

/* -------------------------
   GET CLASSES TOOL
-------------------------- */
export const getClassesTool = tool({
  description: 'Obtiene las clases de FightLab disponibles para hoy.',

  inputSchema: z.object({}),

  execute: async (): Promise<GetClassesResult> => {
    return {
      classes: [
        { id: 1, name: 'Muay Thai', time: '7:00 PM', coach: 'Carlos Rojas', spots: 8 },
        { id: 2, name: 'Functional Training', time: '8:00 PM', coach: 'Andrea Silva', spots: 10 },
        { id: 3, name: 'BJJ Grappling', time: '9:00 PM', coach: 'Miguel Torres', spots: 6 },
      ],
      message: 'Estas son las clases disponibles para hoy.',
    };
  },
});

/* -------------------------
   BOOK CLASS TOOL
-------------------------- */
export const bookClassTool = tool({
  description: 'Reserva una clase según el nombre.',

  inputSchema: z.object({
    className: z.string().min(1),
  }),

  execute: async ({ className }: BookClassInput): Promise<BookClassResult> => {
    return {
      success: true,
      className,
      message: `¡Listo! Has reservado la clase de ${className}. ¡Nos vemos en el dojo!`,
    };
  },
});