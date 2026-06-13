"use client";
import { useEffect } from "react";

declare global { interface Window { instgrm?: { Embeds: { process: () => void } } } }

export default function InstagramEmbeds({ urls }: { urls: string[] }) {
  useEffect(() => {
    const id = "ig-embed-script";
    function process() { window.instgrm?.Embeds?.process(); }
    if (document.getElementById(id)) { process(); return; }
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    s.onload = process;
    document.body.appendChild(s);
  }, [urls]);

  if (urls.length === 0) {
    return <p className="font-mono text-pietrisco text-center">Presto qui i nostri post. Nel frattempo, <a className="text-accento underline" href="https://instagram.com/ferrovialibera">seguici su Instagram</a>!</p>;
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
