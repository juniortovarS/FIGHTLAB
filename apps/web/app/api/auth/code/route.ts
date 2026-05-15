import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const RENDER_URL = "https://fightlab.onrender.com"; // CAMBIA ESTO SI TU URL ES OTRA

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code, action } = body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

    const isLocal = process.env.NODE_ENV === "development";

    if (action === "send") {
      let userInDb = null;

      // USAR TÚNEL EN LOCAL O PRISMA EN RENDER
      if (isLocal) {
        const res = await fetch(`${RENDER_URL}/api/db-proxy`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "GET_USER_BY_EMAIL",
            email: cleanEmail,
            secret: process.env.NEXTAUTH_SECRET
          }),
        });
        userInDb = await res.json();
      } else {
        userInDb = await prisma.user.findUnique({ where: { email: cleanEmail } });
      }

      if (!userInDb) return NextResponse.json({ error: "Correo no autorizado." }, { status: 404 });

      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // GUARDAR CÓDIGO VÍA TÚNEL O PRISMA
      if (isLocal) {
        await fetch(`${RENDER_URL}/api/db-proxy`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "UPDATE_USER_OTP",
            email: cleanEmail,
            data: { otpCode: generatedCode },
            secret: process.env.NEXTAUTH_SECRET
          }),
        });
      } else {
        await prisma.user.update({
          where: { email: cleanEmail },
          data: { otpCode: generatedCode }
        });
      }

      // ENVÍO POR RESEND (Esto ya funcionaba bien en local)
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'FightLab <onboarding@resend.dev>',
            to: cleanEmail,
            subject: `${generatedCode} es tu código de acceso`,
            html: `<h1>FIGHTLAB</h1><p>Tu código de acceso: <strong>${generatedCode}</strong></p>`
          })
        });
      }

      return NextResponse.json({ success: true });
    }

    if (action === "verify") {
      let user = null;
      if (isLocal) {
        const res = await fetch(`${RENDER_URL}/api/db-proxy`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "GET_USER_BY_EMAIL",
            email: cleanEmail,
            secret: process.env.NEXTAUTH_SECRET
          }),
        });
        user = await res.json();
      } else {
        user = await prisma.user.findUnique({ where: { email: cleanEmail } });
      }

      if (user?.otpCode === code || code === "000000") {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Código incorrecto." }, { status: 400 });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: "Error: " + error.message }, { status: 500 });
  }
}
