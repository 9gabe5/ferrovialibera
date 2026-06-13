"use client";
import { useState } from "react";

export default function VideoYouTube({ id, titolo }: { id: string; titolo: string }) {
  const [play, setPlay] = useState(false);
  if (play) {
    return (
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full border-4 border-accento"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={titolo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <button
      onClick={() => setPlay(true)}
      className="relative w-full border-4 border-accento bg-antracite group"
      style={{ paddingBottom: "56.25%" }}
      aria-label={`Carica e guarda: ${titolo}`}
    >
      <span className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-5xl group-hover:scale-110 transition-transform" aria-hidden="true">▶</span>
        <span className="text-xs font-mono mt-2 px-4 text-center text-gray-300">Clicca per caricare il video da YouTube</span>
      </span>
    </button>
  );
}
