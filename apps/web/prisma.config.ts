import { defineConfig, env } from "@prisma/config";
import dotenv from "dotenv";

// Cargar explícitamente .env.local para Prisma 7
dotenv.config({ path: ".env.local" });

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || "mysql://root:password@localhost:3306/fightlab",
  },
});
