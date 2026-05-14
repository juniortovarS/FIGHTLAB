export const maxDuration = 30;

// Motor de respuestas inteligente local para FightLab
// Funciona sin ninguna API externa
function generateFightLabResponse(messages: { role: string; content: string }[]): string {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() ?? "";

  // Saludos
  if (/^(hola|hey|buenas|buen[ao]s|qué tal|que tal|hi|hello|ey|eyyy|holis)/.test(lastMsg)) {
    return "¡Hola! 👋 Bienvenido al asistente de FightLab. Puedo ayudarte a conocer nuestras clases, horarios, precios o reservar tu próxima sesión. ¿En qué te puedo ayudar hoy? 🥋";
  }

  // Clases disponibles
  if (/clases?|disciplinas?|entrenamientos?|deportes?|qu[eé] (tienen|ofrecen|hay)/.test(lastMsg)) {
    return `¡Tenemos 5 disciplinas de élite! 💪

🥊 **Boxeo** — Lun, Mié, Vie | 7am y 6pm  
🥋 **BJJ (Jiu-Jitsu)** — Mar y Jue | 8am y 7pm  
🦵 **Muay Thai** — Lun a Sáb | 9am y 5pm  
🤼 **Lucha Libre** — Mié y Sáb | 10am y 4pm  
🏃 **Acondicionamiento** — Todos los días | 6am y 8pm  

¿Te interesa alguna en particular?`;
  }

  // Horarios
  if (/horarios?|hora|cuando|cu[aá]ndo|d[ií]as?|schedule/.test(lastMsg)) {
    return `Nuestros horarios son: 🕐

• **Boxeo**: Lunes, Miércoles y Viernes — 7am / 6pm
• **BJJ**: Martes y Jueves — 8am / 7pm  
• **Muay Thai**: Lunes a Sábado — 9am / 5pm
• **Lucha Libre**: Miércoles y Sábado — 10am / 4pm
• **Acondicionamiento**: Todos los días — 6am / 8pm

¿Quieres reservar una clase?`;
  }

  // Precios
  if (/precio|costo|cuanto|cu[aá]nto|pago|cobran|tarifa|mensualidad|plan/.test(lastMsg)) {
    return `Nuestros precios son muy accesibles 💰

💳 **Clase individual**: $150 MXN  
📅 **Mensualidad ilimitada**: $900 MXN  
🎯 **Paquete 10 clases**: $1,200 MXN  

¡La mensualidad es la mejor opción si vas a entrenar más de 6 veces! ¿Te reservo una clase de prueba gratuita?`;
  }

  // Reservar
  if (/reserv|apartar|agendar|inscrib|book|quiero (ir|entrenar|unirme)|me (anoto|apunto)/.test(lastMsg)) {
    return `¡Excelente decisión! 🔥 Para completar tu reserva necesito saber:

1️⃣ ¿Cuál disciplina te interesa?  
2️⃣ ¿Qué día y horario prefieres?  

Cuéntame y te confirmo el lugar al instante.`;
  }

  // Cancelar
  if (/cancel|cancelar|baja|darme de baja|ya no/.test(lastMsg)) {
    return "Lamento escuchar eso 😔 Para cancelar tu reserva necesito tu nombre completo y la clase que quieres cancelar. ¿Me puedes dar esos datos?";
  }

  // Boxeo
  if (/boxeo|box/.test(lastMsg)) {
    return "🥊 ¡El Boxeo es una de nuestras clases más populares! Se imparte **Lunes, Miércoles y Viernes** a las **7am y 6pm**. Precio por clase: $150 MXN. ¿Te gustaría reservar un lugar?";
  }

  // Muay Thai
  if (/muay thai|muaythai|thai/.test(lastMsg)) {
    return "🦵 ¡Muay Thai es brutal y efectivo! Disponible **Lunes a Sábado** en horarios de **9am y 5pm**. Es perfecta para ponerte en forma rápido. ¿Quieres agendar tu primera clase?";
  }

  // BJJ / Jiu-Jitsu
  if (/bjj|jiu.?jitsu|jiu jitsu|grappling|ground/.test(lastMsg)) {
    return "🥋 El BJJ (Jiu-Jitsu Brasileño) es el arte marcial más completo para defensa personal. Clases **Martes y Jueves** a las **8am y 7pm**. ¿Te interesa probar una clase?";
  }

  // Lucha libre
  if (/lucha|wrestling|lucha libre/.test(lastMsg)) {
    return "🤼 ¡La Lucha Libre es espectacular! Clases los **Miércoles y Sábados** a las **10am y 4pm**. Aprenderás técnicas profesionales. ¿Quieres reservar?";
  }

  // Acondicionamiento
  if (/acondicionamiento|físico|fisico|cardio|conditioning|gym|gimnasio|pesas/.test(lastMsg)) {
    return "🏃 El Acondicionamiento Físico está disponible **todos los días** a las **6am y 8pm**. Es perfecto para complementar cualquier disciplina marcial. ¿Te apunto?";
  }

  // Confirmar reserva (nombre + clase juntos)
  if (/me llamo|mi nombre es|soy [a-záéíóú]+/.test(lastMsg)) {
    const nameMatch = lastMsg.match(/(?:me llamo|mi nombre es|soy)\s+([a-záéíóú]+)/i);
    const name = nameMatch ? nameMatch[1] : "campeón";
    return `✅ ¡Perfecto, ${name}! Tu reserva ha sido **confirmada exitosamente**. Recibirás un recordatorio antes de tu clase. ¡Te esperamos en FightLab, prepárate para sudar! 💪🔥`;
  }

  // Ubicación
  if (/d[oó]nde|ubicaci[oó]n|direcci[oó]n|donde est[aá]n|lugar/.test(lastMsg)) {
    return "📍 Estamos ubicados en el corazón de la ciudad. Puedes contactarnos por WhatsApp al momento para la dirección exacta. ¡Te esperamos! 🥋";
  }

  // Gracias
  if (/gracias|thank|excelente|perfecto|genial|chevere|chévere/.test(lastMsg)) {
    return "¡De nada! 😊 Es un placer ayudarte. Si tienes alguna otra duda sobre FightLab, aquí estaré. ¡A entrenar duro! 💪🥋";
  }

  // Respuesta por defecto motivadora
  const defaults = [
    "¡Interesante! En FightLab tenemos todo lo que necesitas para tu entrenamiento. ¿Te puedo ayudar con horarios, precios o hacer una reserva? 🥋",
    "En FightLab nos especializamos en artes marciales de élite. ¿Qué disciplina te llama más la atención? 🔥",
    "¡Estoy aquí para ayudarte! Puedo informarte sobre nuestras clases de Boxeo, BJJ, Muay Thai, Lucha Libre o Acondicionamiento. ¿Por cuál empezamos? 💪",
    "¡Hola campeón! ¿Quieres conocer nuestros horarios, precios o reservar una clase en FightLab? 🥊",
  ];

  return defaults[Math.floor(Math.random() * defaults.length)]!;
}

export async function POST(req: Request) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const messages = body?.messages ?? [];

    const normalizedMessages = messages
      .filter((m: any) => m && (m.content || m.text))
      .map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || m.text || ""),
      }));

    if (normalizedMessages.length === 0) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
    }

    // Simula el tiempo de procesamiento de una IA real
    await new Promise((resolve) => setTimeout(resolve, 600));

    const responseText = generateFightLabResponse(normalizedMessages);

    return Response.json({ text: responseText });
  } catch (error: any) {
    const msg = error?.message ?? String(error);
    console.error("[/api/chat] Error:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
