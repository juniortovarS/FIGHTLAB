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
      const data = await res.json();
      
      // La proxy puede devolver el array directamente o un objeto con error
      if (data && data.error) {
        console.error("ERROR PROXY GET_USERS:", data.error);
        return NextResponse.json([]);
      }
      
      return NextResponse.json(Array.isArray(data) ? data : []);
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
    const formattedData: any = {
      ...userData,
      clasesDisponibles: data.clasesDisponibles !== undefined ? (parseInt(data.clasesDisponibles) || 0) : undefined,
      joinDate: userData.joinDate ? new Date(userData.joinDate) : undefined,
      planActiveDate: userData.planActiveDate ? new Date(userData.planActiveDate) : undefined,
      planExpiryDate: userData.planExpiryDate ? new Date(userData.planExpiryDate) : undefined,
    };

    // Eliminamos campos undefined para no sobreescribir con null
    Object.keys(formattedData).forEach(key => formattedData[key] === undefined && delete formattedData[key]);

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
      const proxyData = await res.json();
      
      if (proxyData && proxyData.error) {
        return NextResponse.json({ success: false, error: proxyData.error }, { status: 500 });
      }
      
      return NextResponse.json({ success: true, user: proxyData });
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
