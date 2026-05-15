import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message, image } = await req.json();
    const brevoKey = process.env.BREVO_API_KEY;

    if (!brevoKey) return NextResponse.json({ error: "Configuración incompleta" }, { status: 500 });

    // Preparamos el contenido con imagen si existe
    const htmlContent = `
      <div style="background:#000;color:#fff;padding:30px;font-family:sans-serif;border:1px solid #D4AF37;">
        <h1 style="color:#D4AF37;">NUEVO TICKET DE SOPORTE</h1>
        <p><strong>De:</strong> ${name} (${email})</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <hr style="border-color:#333;" />
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
        ${image ? `<p><strong>Evidencia adjunta:</strong></p><img src="${image}" style="max-width:100%;border:1px solid #D4AF37;" />` : ''}
      </div>
    `;

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: "FightLab Support", email: "support@fightlab.com" },
        to: [{ email: "juniortovar601@gmail.com" }],
        subject: `[SOPORTE] ${subject} - ${name}`,
        htmlContent: htmlContent
      })
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
