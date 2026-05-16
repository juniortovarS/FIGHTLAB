import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const RENDER_URL = "https://fightlab.onrender.com"; // CAMBIA ESTO SI TU URL ES OTRA

export async function GET() {
  try {
    const users = await prisma.user.findMany({ orderBy: { joinDate: "desc" } });
    return NextResponse.json(users);
  } catch (e: any) {
    console.error("ERROR GET_USERS:", e.message);
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

    if (id) {
      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: formattedData,
      });
      return NextResponse.json({ success: true, user });
    }

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: formattedData,
      create: formattedData,
    });
    return NextResponse.json({ success: true, user });
  } catch (e: any) {
    console.error("ERROR POST_USER:", e.message);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
