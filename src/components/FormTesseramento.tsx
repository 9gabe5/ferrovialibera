"use client";
import { useState } from "react";

const QUOTA = "20,00";
const PAYPAL = "https://www.paypal.com/paypalme/ferrovialibera/20";
const IBAN = "IT50F3609201600494285350895";

export default function FormTesseramento({ tipo }: { tipo: "nuovo" | "rinnovo" }) {
  const [stato, setStato] = useState<"idle" | "invio" | "ok" | "errore">("idle");
  const [errore, setErrore] = useState("");

  async function invia(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStato("invio");
    setErrore("");
    const f = new FormData(e.currentTarget);
    const dati = Object.fromEntries(f.entries());
    try {
      const res = await fetch("/api/tesseramento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dati, tipo }),
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
      <div className="bg-green-50 border-2 border-green-600 p-6">
        <p className="font-display font-bold text-xl text-green-800">Richiesta inviata! 🎉</p>
        <p className="mt-2 text-green-900">
          Verificheremo il versamento della quota e ti confermeremo il tesseramento via email.
          Benvenutə a bordo!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={invia} className="space-y-5">
      {/* honeypot anti-spam */}
      <input type="text" name="sito_web" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="nome">Nome *</label>
          <input className="input" id="nome" name="nome" required autoComplete="given-name" />
        </div>
        <div>
          <label className="label" htmlFor="cognome">Cognome *</label>
          <input className="input" id="cognome" name="cognome" required autoComplete="family-name" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email *</label>
          <input className="input" id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="telefono">Telefono *</label>
          <input className="input" id="telefono" name="telefono" type="tel" required autoComplete="tel" />
        </div>
        <div>
          <label className="label" htmlFor="codice_fiscale">Codice fiscale *</label>
          <input className="input uppercase" id="codice_fiscale" name="codice_fiscale" required minLength={16} maxLength={16} />
        </div>
        <div>
          <label className="label" htmlFor="data_nascita">Data di nascita *</label>
          <input className="input" id="data_nascita" name="data_nascita" type="date" required />
        </div>
      </div>

      {tipo === "nuovo" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="indirizzo">Indirizzo *</label>
            <input className="input" id="indirizzo" name="indirizzo" required autoComplete="street-address" />
          </div>
          <div>
            <label className="label" htmlFor="citta">Città *</label>
            <input className="input" id="citta" name="citta" required />
          </div>
          <div>
            <label className="label" htmlFor="cap">CAP *</label>
            <input className="input" id="cap" name="cap" required minLength={5} maxLength={5} />
          </div>
        </div>
      )}

      <fieldset className="border-2 border-gray-300 p-4 space-y-3 text-sm">
        <legend className="label px-2">Dichiarazioni *</legend>
        <p>
          Invio questo modulo per chiedere di essere {tipo === "nuovo" ? "ammessə" : "riammessə"} all&apos;Associazione
          FerroViaLibera. Una volta andato a buon fine il tesseramento, mi impegno a:
        </p>
        <ol className="list-decimal ml-5 space-y-1 text-pietrisco">
          <li>adottare comportamenti conformi allo spirito e alle finalità dell&apos;Associazione, tutelandone il nome, nei rapporti tra i soci e tra questi ultimi e gli organi sociali;</li>
          <li>rispettare lo Statuto, gli eventuali regolamenti interni e le deliberazioni adottate dagli organi sociali;</li>
          <li>versare la quota associativa nella misura e nei termini fissati dall&apos;organo amministrativo. Sono consapevole che le somme versate a titolo di quota associativa non sono rimborsabili, rivalutabili e trasmissibili.</li>
        </ol>
        <label className="flex gap-2 items-start font-medium">
          <input type="checkbox" name="accetto_impegni" required className="mt-1" />
          <span>Accetto</span>
        </label>
        <label className="flex gap-2 items-start font-medium">
          <input type="checkbox" name="accetto_privacy" required className="mt-1" />
          <span>
            Acconsento al trattamento dei miei dati personali secondo la{" "}
            <a href="https://drive.google.com/file/d/1LX6OfjTCzBjUQJjdhizoH2LQAa79qtC6/view" className="underline text-blu">Privacy Policy</a>
          </span>
        </label>
        <label className="flex gap-2 items-start font-medium">
          <input type="checkbox" name="accetto_statuto" required className="mt-1" />
          <span>Ho letto e accetto lo <a href="/statuto" className="underline text-blu">Statuto</a></span>
        </label>
      </fieldset>

      <div className="bg-blue-50 border-2 border-blu p-4 space-y-3">
        <p className="font-display font-bold text-blu">Quota annuale associativa 2026: €{QUOTA}</p>
        <div className="text-sm space-y-2">
          <p>
            <strong>Con PayPal</strong> (lasciare la dicitura &quot;Amici e Familiari&quot;!):{" "}
            <a href={PAYPAL} className="underline text-blu break-all">{PAYPAL}</a>
          </p>
          <p>
            <strong>Con bonifico</strong> all&apos;IBAN intestato a FerroViaLibera APS:{" "}
            <code className="font-mono bg-white px-1 break-all">{IBAN}</code>
          </p>
        </div>
        <div>
          <p className="label">Ho versato la quota con: *</p>
          <div className="flex gap-6 mt-1">
            <label className="flex gap-2 items-center">
              <input type="radio" name="metodo_pagamento" value="paypal" required /> PayPal
            </label>
            <label className="flex gap-2 items-center">
              <input type="radio" name="metodo_pagamento" value="bonifico" required /> Bonifico
            </label>
          </div>
        </div>
      </div>

      {stato === "errore" && (
        <p className="text-segnale font-semibold" role="alert">Errore: {errore}. Riprova o scrivici a info@ferrovialibera.it</p>
      )}

      <button type="submit" className="btn btn-blu w-full sm:w-auto" disabled={stato === "invio"}>
        {stato === "invio" ? "Invio in corso…" : tipo === "nuovo" ? "Invia richiesta di tesseramento" : "Invia richiesta di rinnovo"}
      </button>
    </form>
  );
}
