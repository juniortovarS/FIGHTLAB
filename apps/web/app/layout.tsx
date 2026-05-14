import "./globals.css";

export const metadata = {
  title: "FightLab",
  description: "Combat Gym Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ background: "#0B0B0B", color: "white", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}