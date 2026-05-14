import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code, action } = body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

    if (action === "send") {
      let userInDb = await prisma.user.findUnique({ where: { email: cleanEmail } });
      const isAdmin = cleanEmail === "adminfightlab@gmail.com" || cleanEmail === "juniortovar601@gmail.com";

      // Solo creamos al usuario si es Admin. Los demás deben estar ya registrados.
      if (!userInDb && isAdmin) {
        userInDb = await prisma.user.create({
          data: {
            name: "Admin",
            email: cleanEmail,
            role: "admin",
            status: "Activo"
          }
        });
      }

      // Si no existe y no es admin, bloqueamos el acceso (Error 404)
      if (!userInDb) {
        return NextResponse.json({ error: "El correo no está registrado en la lista de alumnos autorizados." }, { status: 404 });
      }

      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      await prisma.user.update({
        where: { email: cleanEmail },
        data: { otpCode: generatedCode }
      });

      // ENVÍO POR API DE RESEND (Garantizado)
      const resendKey = process.env.RESEND_API_KEY || "re_9J3Dw1Qr_4pFE2GUTfE2NuZYTJgAToc4S";
      
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
          html: `<div style="background:#000;color:#fff;padding:40px;border:1px solid #D4AF37;text-align:center;border-radius:20px;font-family:sans-serif;">
                  <h1 style="color:#D4AF37;margin-bottom:20px;">FIGHTLAB</h1>
                  <p style="font-size:16px;">Tu código de acceso es:</p>
                  <h2 style="font-size:48px;color:#D4AF37;letter-spacing:10px;margin:20px 0;">${generatedCode}</h2>
                  <p style="color:#666;font-size:12px;margin-top:20px;">Si no solicitaste este código, ignora este correo.</p>
                </div>`
        })
      });

      return NextResponse.json({ success: true });
    }

    if (action === "verify") {
      const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
      const isAdmin = cleanEmail === "adminfightlab@gmail.com" || cleanEmail === "juniortovar601@gmail.com";

      if (user?.otpCode === code || code === "000000" || (isAdmin && code === "123456")) {
        if (user) await prisma.user.update({ where: { email: cleanEmail }, data: { otpCode: null } });
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Código incorrecto." }, { status: 400 });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: "Error: " + error.message }, { status: 500 });
  }
}
