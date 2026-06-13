"use client";
import { useState } from "react";

type QA = { domanda: string; risposta: string[] };

// Formato corpo: righe "D: domanda" seguite dai paragrafi di risposta.
function parse(corpo: string): QA[] {
  const blocchi: QA[] = [];
  let corrente: QA | null = null;
  let buffer: string[] = [];
  const chiudi = () => {
    if (corrente) {
      corrente.risposta = buffer.join("\n").trim().split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
      blocchi.push(corrente);
    }
    buffer = [];
  };
  for (const riga of corpo.split(/\r?\n/)) {
    const m = riga.match(/^D:\s*(.*)$/);
    if (m) { chiudi(); corrente = { domanda: m[1].trim(), risposta: [] }; }
    else if (corrente) buffer.push(riga);
  }
  chiudi();
  return blocchi;
}

export default function Intervista({ corpo }: { corpo: string }) {
  const [aperto, setAperto] = useState(false);
  const qa = parse(corpo);

  // Se non è in formato D:/R:, mostra il testo semplice con leggi di più
  if (qa.length === 0) {
    return <div className="mt-4 whitespace-pre-line leading-relaxed">{corpo}</div>;
  }

  const visibili = aperto ? qa : qa.slice(0, 1);

  return (
    <div className="mt-5">
      <div className="space-y-6">
        {visibili.map((b, i) => (
          <div key={i}>
            <p className="font-display font-bold text-accento text-lg">{b.domanda}</p>
            <div className="mt-2 space-y-3 leading-relaxed">
              {b.risposta.map((p, j) => <p key={j}>{p}</p>)}
            </div>
          </div>
        ))}
      </div>

      {!aperto && (
        <div className="relative -mt-16 pt-16 bg-gradient-to-t from-white via-white to-transparent" aria-hidden="true" />
      )}

      <button
        onClick={() => setAperto(!aperto)}
        className="btn btn-accento mt-6"
        aria-expanded={aperto}
      >
        {aperto ? "↑ Chiudi l'intervista" : `Leggi tutta l'intervista (${qa.length} domande) →`}
      </button>
    </div>
  );
}
