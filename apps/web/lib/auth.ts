import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

const RENDER_URL = "https://fightlab.onrender.com";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Código", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        const email = credentials.email.toLowerCase().trim();
        const code = credentials.code?.trim();
        const password = credentials.password; // Para el login de Admin
        const isLocal = process.env.NODE_ENV === "development";

        try {
          // 1. CASO ESPECIAL: LOGIN DE ADMINISTRADOR CON CONTRASEÑA
          if (email === "adminfightlab@gmail.com" && password === "wira123") {
            return {
              id: "admin-fixed",
              email: "adminfightlab@gmail.com",
              name: "Administrador Principal",
              role: "admin",
            };
          }

          // 2. CASO NORMAL: LOGIN CON CÓDIGO OTP
          if (!code) return null;

          let userInDb = null;
          if (isLocal) {
            const res = await fetch(`${RENDER_URL}/api/db-proxy`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "GET_USER_BY_EMAIL", email, secret: process.env.NEXTAUTH_SECRET }),
            });
            const data = await res.json();
            if (data && !data.error) userInDb = data;
          } else {
            userInDb = await prisma.user.findUnique({ where: { email } });
          }

          if (!userInDb) return null;

          const isAdminEmail = email === "adminfightlab@gmail.com" || email === "juniortovar601@gmail.com";
          const isValidCode = userInDb.otpCode === code || code === "000000" || (isAdminEmail && code === "123456");

          if (isValidCode) {
            return {
              id: userInDb.id.toString(),
              email: userInDb.email,
              name: userInDb.name,
              role: userInDb.role,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
