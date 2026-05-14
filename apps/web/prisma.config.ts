import { defineConfig, env } from "@prisma/config";
import dotenv from "dotenv";

// Cargar explícitamente .env.local para Prisma 7
dotenv.config({ path: ".env.local" });

export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),
  },
});
