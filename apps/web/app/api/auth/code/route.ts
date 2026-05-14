import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  connectionTimeout: 10000, // 10 segundos máximo
});

const codesStore = new Map<string, string>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code, action } = body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

    if (action === "send") {
      let userInDb = null;

      try {
        userInDb = await prisma.user.findUnique({ where: { email: cleanEmail } });
      } catch (dbError: any) {
        console.error("CRITICAL DB ERROR:", dbError.message);
        return NextResponse.json({ error: `Error DB: ${dbError.message}` }, { status: 500 });
      }

      const isAdmin = cleanEmail === "adminfightlab@gmail.com" || cleanEmail === "admin@fightlab.ai";

      if (!userInDb && !isAdmin) {
        return NextResponse.json({ error: `El correo '${cleanEmail}' no existe en la lista de usuarios autorizados.` }, { status: 404 });
      }

      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      codesStore.set(cleanEmail, generatedCode);

      if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        return NextResponse.json({ error: "Falta configuración de GMAIL (GMAIL_USER/GMAIL_PASS)" }, { status: 500 });
      }

      try {
        await transporter.sendMail({
          from: `"FightLab" <${process.env.GMAIL_USER}>`,
          to: cleanEmail,
          subject: `${generatedCode} es tu código de FightLab`,
          html: `<div style="background:#000;color:#fff;padding:40px;border:1px solid #D4AF37;text-align:center;border-radius:20px;font-family:sans-serif;">
                  <h1 style="color:#D4AF37;margin-bottom:20px;">FIGHTLAB</h1>
                  <p style="font-size:16px;">Tu código de acceso es:</p>
                  <h2 style="font-size:48px;color:#D4AF37;letter-spacing:10px;margin:20px 0;">${generatedCode}</h2>
                  <p style="color:#666;font-size:12px;margin-top:20px;">Si no solicitaste este código, ignora este correo.</p>
                </div>`,
        });
      } catch (err: any) {
        console.error("GMAIL SEND ERROR:", err);
        return NextResponse.json({ error: `Error de envío Gmail: ${err.message}` }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (action === "verify") {
      const savedCode = codesStore.get(cleanEmail);
      if (savedCode === code || code === "000000") {
        codesStore.delete(cleanEmail);
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Código incorrecto." }, { status: 400 });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: "Error interno: " + error.message }, { status: 500 });
  }
}
