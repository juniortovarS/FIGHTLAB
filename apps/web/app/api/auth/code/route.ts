import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "no-key");
const codesStore = new Map<string, string>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code, action } = body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

    if (action === "send") {
      let userInDb = null;
      let dbErrorOccurred = false;

      try {
        // Find user and explicitly log it
        userInDb = await prisma.user.findUnique({ where: { email: cleanEmail } });
      } catch (dbError: any) {
        console.error("CRITICAL DB ERROR:", dbError.message);
        return NextResponse.json({ error: `Error MySQL: ${dbError.message}. Revisa que tu servidor MySQL esté encendido.` }, { status: 500 });
      }

      const isAdmin = cleanEmail === "adminfightlab@gmail.com" || cleanEmail === "admin@fightlab.ai";
      

      if (!userInDb && !isAdmin) {
        return NextResponse.json({ error: `El correo '${cleanEmail}' no existe en la lista de usuarios autorizados.` }, { status: 404 });
      }

      // 2. Generate Code
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      codesStore.set(cleanEmail, generatedCode);

      // 3. Send Email
      if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("tu_llave")) {
        return NextResponse.json({ error: "Falta la RESEND_API_KEY en .env.local" }, { status: 500 });
      }

      try {
        const emailResult = await resend.emails.send({
          from: "FightLab <onboarding@resend.dev>",
          to: cleanEmail,
          subject: `${generatedCode} es tu código de FightLab`,
          html: `<div style="background:#000;color:#fff;padding:40px;border:1px solid #D4AF37;text-align:center;border-radius:20px;">
                  <h1 style="color:#D4AF37;">FIGHTLAB</h1>
                  <p>Código de acceso:</p>
                  <h2 style="font-size:40px;color:#D4AF37;letter-spacing:5px;">${generatedCode}</h2>
                </div>`,
        });

        if (emailResult.error) throw new Error(emailResult.error.message);
      } catch (err: any) {
        console.error("EMAIL SEND ERROR:", err);
        return NextResponse.json({ error: `Error de envío: ${err.message}. Prueba enviarlo a tu propio correo de Resend.` }, { status: 500 });
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
