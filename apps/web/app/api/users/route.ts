import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const RENDER_URL = "https://fightlab.onrender.com"; // CAMBIA ESTO SI TU URL ES OTRA

export async function GET() {
  try {
    // SI ESTAMOS EN LOCAL, USAMOS EL TÚNEL PARA SALTAR EL BLOQUEO
    if (process.env.NODE_ENV === "development") {
      const res = await fetch(`${RENDER_URL}/api/db-proxy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "GET_USERS",
          secret: process.env.NEXTAUTH_SECRET
        }),
      });
      const users = await res.json();
      return NextResponse.json(users || []);
    }

    // SI ESTAMOS EN RENDER, USAMOS PRISMA DIRECTAMENTE
    const users = await prisma.user.findMany({ orderBy: { joinDate: "desc" } });
    return NextResponse.json(users);
  } catch (e: any) {
    console.error("ERROR EN TÚNEL:", e.message);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { id, ...userData } = data;
    const formattedData = {
      ...userData,
      clasesDisponibles: parseInt(data.clasesDisponibles) || 0,
      joinDate: userData.joinDate ? new Date(userData.joinDate) : new Date(),
      planActiveDate: userData.planActiveDate ? new Date(userData.planActiveDate) : null,
      planExpiryDate: userData.planExpiryDate ? new Date(userData.planExpiryDate) : null,
    };

    if (process.env.NODE_ENV === "development") {
      const res = await fetch(`${RENDER_URL}/api/db-proxy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPSERT_USER",
          data: formattedData,
          secret: process.env.NEXTAUTH_SECRET
        }),
      });
      const user = await res.json();
      return NextResponse.json({ success: true, user });
    }

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: formattedData,
      create: formattedData,
    });
    return NextResponse.json({ success: true, user });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
