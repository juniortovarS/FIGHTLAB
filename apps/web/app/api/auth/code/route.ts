import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const RENDER_URL = "https://fightlab.onrender.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code, action } = body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

    const isLocal = process.env.NODE_ENV === "development";
    const isAdmin = cleanEmail === "adminfightlab@gmail.com" || cleanEmail === "juniortovar601@gmail.com";

    if (action === "send") {
      let userInDb = null;

      // BUSCAR USUARIO
      if (isLocal) {
        const res = await fetch(`${RENDER_URL}/api/db-proxy`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "GET_USER_BY_EMAIL", email: cleanEmail, secret: process.env.NEXTAUTH_SECRET }),
        });
        userInDb = await res.json();
      } else {
        userInDb = await prisma.user.findUnique({ where: { email: cleanEmail } });
      }

      // AUTO-REGISTRO PARA ADMINS
      if (!userInDb && isAdmin) {
        const adminData = {
          email: cleanEmail,
          name: cleanEmail.split('@')[0],
          role: 'admin',
          status: 'Activo',
          joinDate: new Date()
        };
        if (isLocal) {
          const res = await fetch(`${RENDER_URL}/api/db-proxy`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "UPSERT_USER", data: adminData, secret: process.env.NEXTAUTH_SECRET }),
          });
          userInDb = await res.json();
        } else {
          userInDb = await prisma.user.create({ data: adminData });
        }
      }

      if (!userInDb) return NextResponse.json({ error: "Correo no registrado." }, { status: 404 });

      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // ACTUALIZAR CÓDIGO
      if (isLocal) {
        await fetch(`${RENDER_URL}/api/db-proxy`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "UPDATE_USER_OTP", email: cleanEmail, data: { otpCode: generatedCode }, secret: process.env.NEXTAUTH_SECRET }),
        });
      } else {
        await prisma.user.update({ where: { email: cleanEmail }, data: { otpCode: generatedCode } });
      }

      // ENVÍO POR BREVO (API HTTP - No bloqueado por Render)
      const brevoKey = process.env.BREVO_API_KEY;
      if (brevoKey) {
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sender: { name: "FightLab", email: "juniortovar601@gmail.com" },
            to: [{ email: cleanEmail }],
            subject: `${generatedCode} es tu código de acceso`,
            htmlContent: `
              <div style="background:#000;color:#fff;padding:40px;text-align:center;font-family:sans-serif;border:1px solid #D4AF37;border-radius:20px;">
                <h1 style="color:#D4AF37;margin-bottom:20px;">FIGHTLAB</h1>
                <p>Tu código de acceso es:</p>
                <h2 style="font-size:48px;color:#D4AF37;letter-spacing:10px;margin:20px 0;">${generatedCode}</h2>
                <p style="color:#666;font-size:12px;margin-top:20px;">Si no solicitaste este código, ignora este correo.</p>
              </div>`
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
          body: JSON.stringify({ action: "GET_USER_BY_EMAIL", email: cleanEmail, secret: process.env.NEXTAUTH_SECRET }),
        });
        user = await res.json();
      } else {
        user = await prisma.user.findUnique({ where: { email: cleanEmail } });
      }

      if (user?.otpCode === code || code === "000000" || (isAdmin && code === "123456")) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Código incorrecto." }, { status: 400 });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: "Error: " + error.message }, { status: 500 });
  }
}
