import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "./providers/LenisProvider";

export const metadata: Metadata = {
  title: "FIGHTLAB — Rise above yourself",
  icons: { icon: "/fightlab.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased" style={{ background: "#0B0B0B" }}>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}