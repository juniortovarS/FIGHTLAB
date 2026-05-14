import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;

        if (!email) return null;

        // 1. HARDCODED ADMIN CHECK (Bypass DB if needed)
        const isAdminEmail = email === "adminfightlab@gmail.com" || email === "admin@fightlab.ai";
        if (isAdminEmail && password === "wira123") {
          return {
            id: "admin-master",
            name: "FightLab Admin",
            email: email,
            role: "admin"
          };
        }

        // 2. DATABASE USER CHECK
        try {
          const userInDb = await prisma.user.findUnique({
            where: { email }
          });

          if (userInDb) {
            return {
              id: `user-${userInDb.id}`,
              name: userInDb.name,
              email: userInDb.email,
              role: userInDb.role === "Admin" ? "admin" : "user"
            };
          }
        } catch (dbError) {
          console.error("Database Auth Error:", dbError);
          // If DB is down, we don't allow non-admin users for safety
        }

        return null;
      }
    }),
  ],
  session: {
    strategy: "jwt" as const
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
