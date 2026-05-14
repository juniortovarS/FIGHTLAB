import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "desc" }
    });
    return NextResponse.json(users);
  } catch (e) {
    console.error("Error fetching users from MySQL:", e);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Remove ID if it's a large temporary number to let MySQL handle AUTO_INCREMENT
    const { id, ...userData } = data;
    
    // Convert string dates to Date objects for Prisma
    const formattedData = {
      ...userData,
      joinDate: userData.joinDate ? new Date(userData.joinDate) : new Date(),
      planActiveDate: userData.planActiveDate ? new Date(userData.planActiveDate) : null,
      planExpiryDate: userData.planExpiryDate ? new Date(userData.planExpiryDate) : null,
    };

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: formattedData,
      create: formattedData,
    });
    
    return NextResponse.json({ success: true, user });
  } catch (e) {
    console.error("DETALLE DEL ERROR EN MYSQL:", e);
    return NextResponse.json({ 
      success: false, 
      error: e instanceof Error ? e.message : "Error desconocido en la base de datos" 
    }, { status: 500 });
  }
}
