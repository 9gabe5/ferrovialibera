"use client";
import { useState } from "react";

export default function FormContatto() {
  const [stato, setStato] = useState<"idle" | "invio" | "ok" | "errore">("idle");
  const [errore, setErrore] = useState("");

  async function invia(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStato("invio");
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contatto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(f.entries())),
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
        <p className="font-display font-bold text-green-800">Messaggio inviato!</p>
        <p className="text-green-900 text-sm mt-1">Ti risponderemo il prima possibile.</p>
      </div>
    );
  }

  return (
    <form onSubmit={invia} className="space-y-4">
      <input type="text" name="sito_web" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c-nome">Nome</label>
          <input className="input" id="c-nome" name="nome" />
        </div>
        <div>
          <label className="label" htmlFor="c-email">Email *</label>
          <input className="input" id="c-email" name="email" type="email" required />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="c-msg">Messaggio *</label>
        <textarea className="input" id="c-msg" name="messaggio" rows={5} required />
      </div>
      {stato === "errore" && <p className="text-segnale font-semibold" role="alert">Errore: {errore}</p>}
      <button type="submit" className="btn btn-blu" disabled={stato === "invio"}>
        {stato === "invio" ? "Invio…" : "Invia messaggio"}
      </button>
    </form>
  );
}
