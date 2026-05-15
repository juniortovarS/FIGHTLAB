import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { action, data, secret, email } = await req.json();

    if (secret !== process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (action === "GET_USERS") {
      const users = await prisma.user.findMany({ orderBy: { joinDate: "desc" } });
      return NextResponse.json(users);
    }

    if (action === "GET_USER_BY_EMAIL") {
      const user = await prisma.user.findUnique({ where: { email } });
      return NextResponse.json(user);
    }

    if (action === "UPDATE_USER_OTP") {
      const user = await prisma.user.update({
        where: { email },
        data: { otpCode: data.otpCode }
      });
      return NextResponse.json(user);
    }

    if (action === "UPSERT_USER") {
      const user = await prisma.user.upsert({
        where: { email: data.email },
        update: data,
        create: data,
      });
      return NextResponse.json(user);
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
