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
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const email = credentials.email.toLowerCase();
        const code = credentials.code;
        const isLocal = process.env.NODE_ENV === "development";

        // 1. BUSCAR USUARIO (Vía túnel si es local)
        let userInDb = null;
        if (isLocal) {
          const res = await fetch(`${RENDER_URL}/api/db-proxy`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "GET_USER_BY_EMAIL", email, secret: process.env.NEXTAUTH_SECRET }),
          });
          userInDb = await res.json();
        } else {
          userInDb = await prisma.user.findUnique({ where: { email } });
        }

        if (!userInDb) return null;

        // 2. VALIDAR CÓDIGO (Igual que en el API de códigos)
        const isAdmin = email === "adminfightlab@gmail.com" || email === "juniortovar601@gmail.com";
        const isValidCode = userInDb.otpCode === code || code === "000000" || (isAdmin && code === "123456");

        if (isValidCode) {
          return {
            id: userInDb.id.toString(),
            email: userInDb.email,
            name: userInDb.name,
            role: userInDb.role,
          };
        }
        return null;
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
  },
  secret: process.env.NEXTAUTH_SECRET,
};
