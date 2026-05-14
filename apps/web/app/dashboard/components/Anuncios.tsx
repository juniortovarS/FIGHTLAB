"use client";

const announcements = [
  {
    id: 1, type: "🏆 Torneo", date: "20 Mayo 2026",
    title: "Torneo Interno de Boxing — FightLab Cup",
    description: "Únete al primer torneo interno de boxing de FightLab. Categorías por peso y nivel. Premios para los 3 primeros lugares.",
    badge: "Torneo", badgeColor: "#D4AF37",
  },
  {
    id: 2, type: "🆕 Nueva Clase", date: "15 Mayo 2026",
    title: "Kickboxing llega a FightLab La Mar",
    description: "A partir de la próxima semana tendremos clases de Kickboxing en la sede La Mar. Martes y Jueves a las 7pm con el coach Iván Reyes.",
    badge: "Nuevo", badgeColor: "#22c55e",
  },
  {
    id: 3, type: "🎁 Promoción", date: "12 Mayo 2026",
    title: "2x1 en Membresías Elite — Solo este fin de semana",
    description: "Recluta a un amigo y ambos obtienen membresía Elite al precio de uno. Válido únicamente Sábado y Domingo.",
    badge: "Oferta", badgeColor: "#f59e0b",
  },
  {
    id: 4, type: "📣 Evento", date: "25 Mayo 2026",
    title: "Open Day — Acceso gratuito para invitados",
    description: "Trae a tus amigos y familiares. Un día de puertas abiertas donde podrán probar cualquier clase de forma gratuita.",
    badge: "Evento", badgeColor: "#818cf8",
  },
];

export default function Anuncios() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-black mb-1" style={{ fontFamily: "Outfit, sans-serif", color: "#F5F5F5" }}>Anuncios</h2>
        <p className="text-sm" style={{ color: "#6B7280" }}>Novedades, eventos y promociones de FightLab</p>
      </div>

      <div className="space-y-4">
        {announcements.map((a, i) => (
          <div key={a.id}
            className="rounded-2xl p-5 transition-all duration-200 group cursor-default"
            style={{
              background: "#141414",
              border: "1px solid rgba(255,255,255,0.06)",
              animationDelay: `${i * 80}ms`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(212,175,55,0.2)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(212,175,55,0.05)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)" }}>
                {a.type.split(" ")[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                    style={{ background: `${a.badgeColor}18`, color: a.badgeColor, border: `1px solid ${a.badgeColor}33` }}>
                    {a.badge}
                  </span>
                  <span className="text-xs" style={{ color: "#4B5563" }}>{a.date}</span>
                </div>
                <h3 className="font-bold mb-2 group-hover:text-[#D4AF37] transition-colors"
                  style={{ color: "#F5F5F5", fontFamily: "Outfit, sans-serif" }}>
                  {a.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>{a.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
