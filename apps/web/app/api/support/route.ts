import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message, image } = await req.json();
    
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;

    if (!user || !pass) {
      return NextResponse.json({ error: "Configuración de correo incompleta" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    // Preparamos archivos adjuntos si hay imagen
    const attachments = [];
    if (image && image.includes("base64")) {
      const [header, base64Data] = image.split(",");
      const extension = header?.split("/")[1]?.split(";")[0] || "png";
      
      attachments.push({
        filename: `evidencia.${extension}`,
        content: base64Data,
        encoding: "base64",
        cid: "evidencia_img"
      });
    }

    // Preparamos el contenido HTML
    const htmlContent = `
      <div style="background:#0a0a0a; color:#ffffff; padding:40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 2px solid #D4AF37; border-radius: 20px; max-width: 600px; margin: auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color:#D4AF37; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">Nuevo Ticket de Soporte</h1>
          <p style="color: #666; font-size: 12px; margin-top: 5px;">FightLab AI Management System</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.05); padding: 25px; border-radius: 15px; border: 1px solid rgba(212,175,55,0.2);">
          <p style="margin: 0 0 15px 0;"><strong style="color: #D4AF37;">De:</strong> ${name}</p>
          <p style="margin: 0 0 15px 0;"><strong style="color: #D4AF37;">Email:</strong> ${email}</p>
          <p style="margin: 0 0 15px 0;"><strong style="color: #D4AF37;">Asunto:</strong> ${subject}</p>
          <div style="margin: 25px 0; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
            <strong style="color: #D4AF37; display: block; margin-bottom: 10px;">Mensaje:</strong>
            <p style="line-height: 1.6; color: #ccc;">${message}</p>
          </div>
        </div>

        ${image ? `
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #D4AF37; font-weight: bold; margin-bottom: 15px;">Evidencia Adjunta:</p>
            <img src="cid:evidencia_img" style="max-width:100%; border-radius: 10px; border: 1px solid #D4AF37;" />
          </div>
        ` : ''}

        <div style="margin-top: 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
          <p style="color: #444; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">&copy; 2024 FIGHTLAB - SISTEMA DE SOPORTE TÉCNICO</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Soporte FightLab" <${user}>`,
      to: "juniortovar601@gmail.com",
      subject: `[TICKET] ${subject} - ${name}`,
      html: htmlContent,
      attachments: attachments as any,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(">>> SUPPORT API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
