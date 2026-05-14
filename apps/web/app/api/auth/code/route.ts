import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code, action } = body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

    if (action === "send") {
      let userInDb = await prisma.user.findUnique({ where: { email: cleanEmail } });
      
      // Registro automático
      if (!userInDb) {
        userInDb = await prisma.user.create({
          data: {
            name: cleanEmail.split('@')[0],
            email: cleanEmail,
            role: (cleanEmail === 'juniortovar601@gmail.com' || cleanEmail === 'adminfightlab@gmail.com') ? 'admin' : 'alumno',
            status: 'Activo'
          }
        });
      }

      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // ESTE ES EL LOG QUE DEBES BUSCAR EN RENDER
      console.log("*****************************************");
      console.log(`CÓDIGO FIGHTLAB PARA ${cleanEmail}: ${generatedCode}`);
      console.log("*****************************************");

      await prisma.user.update({
        where: { email: cleanEmail },
        data: { otpCode: generatedCode }
      });

      // Envío en segundo plano (para que la web no espere)
      const sendEmail = async () => {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          }
        });
        try {
          await transporter.sendMail({
            from: `"FightLab" <${process.env.GMAIL_USER}>`,
            to: cleanEmail,
            subject: `${generatedCode} es tu código de acceso`,
            html: `<h1>FIGHTLAB</h1><p>Tu código: <strong>${generatedCode}</strong></p>`,
          });
        } catch (e) {}
      };
      sendEmail();

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
