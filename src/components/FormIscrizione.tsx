"use client";
import { useState } from "react";

export default function FormIscrizione({ eventoId }: { eventoId: string }) {
  const [stato, setStato] = useState<"idle" | "invio" | "ok" | "errore">("idle");
  const [errore, setErrore] = useState("");

  async function invia(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStato("invio");
    const f = new FormData(e.currentTarget);
    const dati = Object.fromEntries(f.entries());
    try {
      const res = await fetch("/api/iscrizione", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dati, evento_id: eventoId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Errore di invio");
      setStato("ok");
    } catch (err: any) {
      setErrore(err.message);
      setStato("errore");
    }
  }

  if (stato === "ok") {
    return (
      <div className="bg-green-50 border-2 border-green-600 p-5">
        <p className="font-display font-bold text-green-800">Iscrizione confermata! 🚂</p>
        <p className="text-green-900 text-sm mt-1">Ci vediamo lì. Per qualsiasi cosa scrivici a info@ferrovialibera.it</p>
      </div>
    );
  }

  return (
    <form onSubmit={invia} className="space-y-4">
      <input type="text" name="sito_web" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="i-nome">Nome e cognome *</label>
          <input className="input" id="i-nome" name="nome" required />
        </div>
        <div>
          <label className="label" htmlFor="i-email">Email *</label>
          <input className="input" id="i-email" name="email" type="email" required />
        </div>
        <div>
          <label className="label" htmlFor="i-tel">Telefono</label>
          <input className="input" id="i-tel" name="telefono" type="tel" />
        </div>
        <div>
          <label className="label" htmlFor="i-note">Note</label>
          <input className="input" id="i-note" name="note" placeholder="Allergie, +1, orari…" />
        </div>
      </div>
      {stato === "errore" && <p className="text-segnale font-semibold" role="alert">Errore: {errore}</p>}
      <button type="submit" className="btn btn-blu" disabled={stato === "invio"}>
        {stato === "invio" ? "Invio…" : "Iscrivimi all'evento"}
      </button>
    </form>
  );
}
