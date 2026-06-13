"use client";
import { useState } from "react";

const LIMITE = 480; // caratteri mostrati da chiuso

type Seg = { tipo: "domanda" | "para"; testo: string };

function segmenta(corpo: string): Seg[] {
  const segs: Seg[] = [];
  const haQA = /^D:\s*/m.test(corpo);
  if (!haQA) {
    corpo.trim().split(/\n{2,}/).forEach((p) => segs.push({ tipo: "para", testo: p.trim() }));
    return segs;
  }
  let buffer: string[] = [];
  const svuota = () => {
    buffer.join("\n").trim().split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
      .forEach((p) => segs.push({ tipo: "para", testo: p }));
    buffer = [];
  };
  for (const riga of corpo.split(/\r?\n/)) {
    const m = riga.match(/^D:\s*(.*)$/);
    if (m) { svuota(); segs.push({ tipo: "domanda", testo: m[1].trim() }); }
    else buffer.push(riga);
  }
  svuota();
  return segs;
}

export default function Intervista({ corpo }: { corpo: string }) {
  const [aperto, setAperto] = useState(false);
  const segs = segmenta(corpo);
  const totale = segs.reduce((n, s) => n + s.testo.length, 0);
  const lungo = totale > LIMITE;

  // Costruisce l'anteprima fino a LIMITE caratteri
  let usati = 0;
  const visibili: Seg[] = [];
  if (aperto || !lungo) {
    visibili.push(...segs);
  } else {
    for (const s of segs) {
      if (usati >= LIMITE) break;
      if (usati + s.testo.length <= LIMITE) {
        visibili.push(s);
        usati += s.testo.length;
      } else {
        const resto = LIMITE - usati;
        visibili.push({ tipo: s.tipo, testo: s.testo.slice(0, resto).trimEnd() + "…" });
        usati = LIMITE;
        break;
      }
    }
  }

  return (
    <div className="mt-5">
      <div className="space-y-4">
        {visibili.map((s, i) =>
          s.tipo === "domanda" ? (
            <p key={i} className="font-display font-bold text-accento text-lg">{s.testo}</p>
          ) : (
            <p key={i} className="leading-relaxed">{s.testo}</p>
          )
        )}
      </div>
      {lungo && (
        <button onClick={() => setAperto(!aperto)} className="btn btn-accento mt-5" aria-expanded={aperto}>
          {aperto ? "↑ Chiudi" : "Leggi tutta l'intervista →"}
        </button>
      )}
    </div>
  );
}
