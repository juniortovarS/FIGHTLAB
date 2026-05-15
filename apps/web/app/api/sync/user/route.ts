import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { user, secret } = await req.json();

    // Seguridad: Solo tu PC puede mandar datos
    if (secret !== process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const newUser = await prisma.user.upsert({
      where: { email: user.email },
      update: { ...user },
      create: { ...user },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
