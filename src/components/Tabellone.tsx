"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Evento = {
  id: string; titolo: string; data_inizio: string;
  luogo: string | null; binario: string | null; registrazione_aperta: boolean;
};

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ·.:/-";

function prefersReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

// Testo con effetto split-flap che "gira" e si ferma da sinistra a destra
function Flap({ testo, attivo, ritardo = 0 }: { testo: string; attivo: boolean; ritardo?: number }) {
  const [out, setOut] = useState(attivo ? "" : testo);
  useEffect(() => {
    if (!attivo) { setOut(testo); return; }
    const chars = testo.split("");
    const fermaA = chars.map((_, i) => 5 + i); // frame in cui ogni lettera si ferma
    let frame = 0;
    const start = setTimeout(() => {
      const id = setInterval(() => {
        frame++;
        setOut(chars.map((ch, i) => {
          if (frame >= fermaA[i]) return ch;
          if (ch === " ") return " ";
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join(""));
        if (frame > fermaA[fermaA.length - 1]) clearInterval(id);
      }, 55);
    }, ritardo);
    return () => clearTimeout(start);
  }, [testo, attivo, ritardo]);
  return <span className="tabular-nums">{out || "\u00A0"}</span>;
}

function orario(iso: string) {
  return new Date(iso).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Rome" });
}
function giorno(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short", timeZone: "Europe/Rome" }).toUpperCase().replace(".", "");
}

export default function Tabellone({ eventi }: { eventi: Evento[] }) {
  const [animato, setAnimato] = useState(false);
  const [orologio, setOrologio] = useState("");

  useEffect(() => {
    setAnimato(!prefersReduced());
    const tick = () => setOrologio(new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Rome" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-[#0c0d10] border border-black rounded-sm overflow-hidden shadow-2xl">
      {/* intestazione tabellone */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/60 border-b border-amber-500/20">
        <span className="font-mono text-amber-400 font-bold tracking-widest text-sm">🚉 PARTENZE · DEPARTURES</span>
        <span className="font-mono text-amber-300/90 text-sm tabular-nums">{orologio}</span>
      </div>

      {/* riga colonne */}
      <div className="hidden sm:grid grid-cols-[5rem_4.5rem_1fr_9rem] gap-3 px-4 py-2 bg-black/40 font-mono text-[10px] tracking-widest text-amber-500/60 uppercase">
        <span>Data</span><span>Ora</span><span>Destinazione</span><span>Binario</span>
      </div>

      <ul className="divide-y divide-amber-500/10">
        {eventi.map((e, i) => (
          <li key={e.id} className="tab-row" style={{ animationDelay: `${i * 90}ms` }}>
            <Link
              href={`/eventi/${e.id}`}
              className="grid grid-cols-[4rem_1fr] sm:grid-cols-[5rem_4.5rem_1fr_9rem] gap-x-3 gap-y-1 items-center px-4 py-4 hover:bg-amber-400/5 transition-colors"
            >
              <span className="font-mono text-amber-300 font-bold text-sm sm:text-base">
                <Flap testo={giorno(e.data_inizio)} attivo={animato} ritardo={i * 90} />
              </span>
              <span className="font-mono text-amber-400 font-bold text-base sm:text-lg sm:order-none order-first col-start-1 sm:col-auto row-start-1 sm:row-auto justify-self-end sm:justify-self-auto">
                <Flap testo={orario(e.data_inizio)} attivo={animato} ritardo={i * 90 + 100} />
              </span>
              <span className="font-mono text-amber-100 uppercase tracking-wide text-sm sm:text-base col-span-2 sm:col-span-1">
                <Flap testo={e.titolo.toUpperCase()} attivo={animato} ritardo={i * 90 + 200} />
                {e.luogo && <span className="block text-amber-500/50 text-xs tracking-normal normal-case mt-0.5">{e.binario || e.luogo}</span>}
              </span>
              <span className="col-span-2 sm:col-span-1">
                {e.registrazione_aperta
                  ? <span className="font-mono text-[11px] text-green-400 flex items-center gap-1"><span className="blink">●</span> ISCRIZIONI APERTE</span>
                  : <span className="font-mono text-[11px] text-amber-500/40">—</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
