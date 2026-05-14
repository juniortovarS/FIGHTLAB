"use client";
import { useEffect, useRef } from "react";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically import lenis to avoid SSR issues
    import("lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenisRef.current = lenis;

      let raf: number;
      const animate = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
      };
    });
  }, []);

  return <>{children}</>;
}
