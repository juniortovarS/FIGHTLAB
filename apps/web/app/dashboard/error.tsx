"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h2 className="text-[#D4AF37] text-2xl font-bold mb-4">¡Ups! Algo salió mal</h2>
      <p className="text-gray-400 mb-6 text-sm">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-white text-black font-bold rounded-full text-xs uppercase"
      >
        Reintentar
      </button>
    </div>
  );
}
