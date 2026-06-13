"use client";
import { useEffect, useState } from "react";

declare global { interface Window { instgrm?: { Embeds: { process: () => void } } } }

export default function InstagramEmbeds({ urls }: { urls: string[] }) {
  const [carica, setCarica] = useState(false);

  useEffect(() => {
    if (!carica) return;
    const id = "ig-embed-script";
    const process = () => window.instgrm?.Embeds?.process();
    if (document.getElementById(id)) { process(); return; }
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    s.onload = process;
    document.body.appendChild(s);
  }, [carica, urls]);

  if (urls.length === 0) {
    return <p className="font-mono text-pietrisco text-center">Presto qui i nostri post. Nel frattempo, <a className="text-accento underline" href="https://instagram.com/ferrovialibera">seguici su Instagram</a>!</p>;
  }

  if (!carica) {
    return (
      <div className="border-2 border-dashed border-accento bg-pastello/40 p-8 text-center">
        <p className="text-3xl" aria-hidden="true">📸</p>
        <p className="font-display font-bold text-accento mt-2">{urls.length} post da Instagram</p>
        <p className="text-sm text-pietrisco mt-1 max-w-md mx-auto">
          Per mostrarteli carichiamo contenuti da Instagram (Meta), che può usare cookie. Vuoi procedere?
        </p>
        <button className="btn btn-accento mt-4" onClick={() => setCarica(true)}>Carica i post da Instagram</button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
      {urls.map((u) => (
        <blockquote
          key={u}
          className="instagram-media w-full"
          data-instgrm-permalink={u}
          data-instgrm-version="14"
          style={{ background: "#fff", border: 0, margin: 0, maxWidth: 540, width: "100%" }}
        />
      ))}
    </div>
  );
}
