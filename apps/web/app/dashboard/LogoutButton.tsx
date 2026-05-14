"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg hover:shadow-red-500/30"
    >
      Cerrar Sesión
    </button>
  );
}
