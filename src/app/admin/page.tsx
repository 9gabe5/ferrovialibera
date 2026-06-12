"use client";
import { useEffect, useState } from "react";

type Socio = {
  id: string; created_at: string; tipo: string; anno: number;
  nome: string; cognome: string; email: string; telefono: string | null;
  codice_fiscale: string | null; data_nascita: string | null;
  indirizzo: string | null; citta: string | null; cap: string | null;
  metodo_pagamento: string | null; stato: string; note: string | null;
};
type Evento = {
  id: string; titolo: string; descrizione: string | null;
  data_inizio: string; data_fine: string | null; luogo: string | null;
  binario: string | null; immagine_url: string | null; link_esterno: string | null;
  registrazione_aperta: boolean; pubblicato: boolean;
  iscrizioni_eventi?: { count: number }[];
};
type Iscrizione = { id: string; created_at: string; evento_id: string; nome: string; email: string; telefono: string | null; note: string | null };
type Messaggio = { id: string; created_at: string; nome: string | null; email: string; messaggio: string; letto: boolean };

function scaricaCsv(nome: string, righe: Record<string, unknown>[]) {
  if (righe.length === 0) return;
  const chiavi = Object.keys(righe[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [chiavi.join(";"), ...righe.map((r) => chiavi.map((k) => esc(r[k])).join(";"))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nome;
  a.click();
}

const dt = (s: string) => new Date(s).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });

export default function Admin() {
  const [autenticato, setAutenticato] = useState(false);
  const [password, setPassword] = useState("");
  const [erroreLogin, setErroreLogin] = useState("");
  const [tab, setTab] = useState<"soci" | "eventi" | "messaggi">("soci");

  const [soci, setSoci] = useState<Socio[]>([]);
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [messaggi, setMessaggi] = useState<Messaggio[]>([]);
  const [iscrizioni, setIscrizioni] = useState<Iscrizione[]>([]);
  const [eventoAperto, setEventoAperto] = useState<string | null>(null);
  const [mostraFormEvento, setMostraFormEvento] = useState(false);

  async function carica() {
    const [s, e, m] = await Promise.all([
      fetch("/api/admin/soci").then((r) => r.json()),
      fetch("/api/admin/eventi").then((r) => r.json()),
      fetch("/api/admin/messaggi").then((r) => r.json()),
    ]);
    if (s.error || e.error || m.error) { setAutenticato(false); return; }
    setSoci(s.data ?? []);
    setEventi(e.data ?? []);
    setMessaggi(m.data ?? []);
    setAutenticato(true);
  }

  useEffect(() => { carica(); }, []);

  async function login(ev: React.FormEvent) {
    ev.preventDefault();
    setErroreLogin("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) { setErroreLogin("Password errata"); return; }
    await carica();
  }

  async function aggiornaSocio(id: string, stato: string) {
    await fetch("/api/admin/soci", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, stato }) });
    setSoci((p) => p.map((s) => (s.id === id ? { ...s, stato } : s)));
  }

  async function salvaEvento(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    const b = Object.fromEntries(f.entries());
    const res = await fetch("/api/admin/eventi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...b,
        registrazione_aperta: f.get("registrazione_aperta") === "on",
        pubblicato: f.get("pubblicato") === "on",
      }),
    });
    if (res.ok) { setMostraFormEvento(false); carica(); }
    else alert("Errore nel salvataggio");
  }

  async function modificaEvento(id: string, campi: Partial<Evento>) {
    await fetch("/api/admin/eventi", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...campi }) });
    carica();
  }

  async function eliminaEvento(id: string, titolo: string) {
    if (!confirm(`Eliminare definitivamente "${titolo}" e tutte le sue iscrizioni?`)) return;
    await fetch("/api/admin/eventi", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    carica();
  }

  async function apriIscrizioni(eventoId: string) {
    if (eventoAperto === eventoId) { setEventoAperto(null); return; }
    const r = await fetch(`/api/admin/iscrizioni?evento_id=${eventoId}`).then((x) => x.json());
    setIscrizioni(r.data ?? []);
    setEventoAperto(eventoId);
  }

  async function segnaLetto(id: string, letto: boolean) {
    await fetch("/api/admin/messaggi", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, letto }) });
    setMessaggi((p) => p.map((m) => (m.id === id ? { ...m, letto } : m)));
  }

  if (!autenticato) {
    return (
      <div className="max-w-sm mx-auto px-4 py-24">
        <h1 className="font-display font-black text-2xl text-blu mb-6">Cabina di guida 🔐</h1>
        <form onSubmit={login} className="space-y-4">
          <input
            className="input"
            type="password"
            placeholder="Password admin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {erroreLogin && <p className="text-segnale font-semibold">{erroreLogin}</p>}
          <button className="btn btn-blu w-full" type="submit">Entra</button>
        </form>
      </div>
    );
  }

  const inAttesa = soci.filter((s) => s.stato === "in_attesa").length;
  const nonLetti = messaggi.filter((m) => !m.letto).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display font-black text-3xl text-blu mb-6">Cabina di guida</h1>

      <div className="flex gap-2 mb-8 flex-wrap">
        {([
          ["soci", `Soci ${inAttesa ? `(${inAttesa} in attesa)` : ""}`],
          ["eventi", "Eventi"],
          ["messaggi", `Messaggi ${nonLetti ? `(${nonLetti})` : ""}`],
        ] as const).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`btn text-xs ${tab === t ? "btn-blu" : "btn-bordo"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "soci" && (
        <section>
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <p className="text-pietrisco text-sm">{soci.length} richieste totali · {soci.filter((s) => s.stato === "approvato").length} approvate</p>
            <button className="btn btn-bordo text-xs" onClick={() => scaricaCsv("soci-ferrovialibera.csv", soci)}>Esporta CSV</button>
          </div>
          <div className="space-y-3">
            {soci.map((s) => (
              <article key={s.id} className={`border-2 p-4 bg-white ${s.stato === "in_attesa" ? "border-yellow-500" : s.stato === "approvato" ? "border-green-600" : "border-gray-300 opacity-70"}`}>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <p className="font-display font-bold">
                      {s.nome} {s.cognome}{" "}
                      <span className="text-xs font-mono text-pietrisco">· {s.tipo} {s.anno} · {dt(s.created_at)}</span>
                    </p>
                    <p className="text-sm text-pietrisco">
                      {s.email} · {s.telefono} · CF {s.codice_fiscale}
                      {s.citta ? ` · ${s.citta}` : ""}
                    </p>
                    <p className="text-sm mt-1">
                      Pagamento dichiarato: <strong className="uppercase">{s.metodo_pagamento}</strong>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {s.stato !== "approvato" && (
                      <button className="btn text-xs bg-green-700 text-white hover:bg-green-800" onClick={() => aggiornaSocio(s.id, "approvato")}>Approva</button>
                    )}
                    {s.stato !== "respinto" && (
                      <button className="btn text-xs btn-bordo" onClick={() => aggiornaSocio(s.id, "respinto")}>Respingi</button>
                    )}
                    {s.stato !== "in_attesa" && (
                      <button className="btn text-xs btn-bordo" onClick={() => aggiornaSocio(s.id, "in_attesa")}>↺</button>
                    )}
                  </div>
                </div>
              </article>
            ))}
            {soci.length === 0 && <p className="text-pietrisco font-mono">Nessuna richiesta ancora.</p>}
          </div>
        </section>
      )}

      {tab === "eventi" && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <p className="text-pietrisco text-sm">{eventi.length} eventi</p>
            <button className="btn btn-blu text-xs" onClick={() => setMostraFormEvento(!mostraFormEvento)}>
              {mostraFormEvento ? "Annulla" : "+ Nuovo evento"}
            </button>
          </div>

          {mostraFormEvento && (
            <form onSubmit={salvaEvento} className="border-2 border-blu bg-white p-5 mb-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Titolo *</label>
                <input className="input" name="titolo" required />
              </div>
              <div>
                <label className="label">Data e ora inizio *</label>
                <input className="input" name="data_inizio" type="datetime-local" required />
              </div>
              <div>
                <label className="label">Luogo</label>
                <input className="input" name="luogo" placeholder="Roma Termini" />
              </div>
              <div>
                <label className="label">Binario / dove trovarci</label>
                <input className="input" name="binario" placeholder="Binario 1 Est, Google Meet…" />
              </div>
              <div>
                <label className="label">Link esterno</label>
                <input className="input" name="link_esterno" type="url" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Immagine (URL)</label>
                <input className="input" name="immagine_url" type="url" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Descrizione</label>
                <textarea className="input" name="descrizione" rows={4} />
              </div>
              <label className="flex gap-2 items-center"><input type="checkbox" name="registrazione_aperta" defaultChecked /> Iscrizioni aperte</label>
              <label className="flex gap-2 items-center"><input type="checkbox" name="pubblicato" defaultChecked /> Pubblicato</label>
              <button className="btn btn-blu sm:col-span-2" type="submit">Crea evento</button>
            </form>
          )}

          <div className="space-y-3">
            {eventi.map((e) => {
              const n = e.iscrizioni_eventi?.[0]?.count ?? 0;
              return (
                <article key={e.id} className="border border-gray-300 bg-white p-4">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <p className="font-display font-bold">
                        {e.titolo}{" "}
                        {!e.pubblicato && <span className="text-xs bg-gray-200 px-1">BOZZA</span>}
                      </p>
                      <p className="text-sm text-pietrisco font-mono">
                        {dt(e.data_inizio)} · {e.luogo ?? "—"} · {n} iscrittə
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button className="btn text-xs btn-bordo" onClick={() => apriIscrizioni(e.id)}>
                        {eventoAperto === e.id ? "Chiudi lista" : "Iscrizioni"}
                      </button>
                      <button className="btn text-xs btn-bordo" onClick={() => modificaEvento(e.id, { registrazione_aperta: !e.registrazione_aperta })}>
                        {e.registrazione_aperta ? "Chiudi iscrizioni" : "Apri iscrizioni"}
                      </button>
                      <button className="btn text-xs btn-bordo" onClick={() => modificaEvento(e.id, { pubblicato: !e.pubblicato })}>
                        {e.pubblicato ? "Nascondi" : "Pubblica"}
                      </button>
                      <button className="btn text-xs bg-segnale text-white" onClick={() => eliminaEvento(e.id, e.titolo)}>Elimina</button>
                    </div>
                  </div>
                  {eventoAperto === e.id && (
                    <div className="mt-4 border-t pt-3">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-display font-semibold text-sm">{iscrizioni.length} iscrizioni</p>
                        <button className="btn text-xs btn-bordo" onClick={() => scaricaCsv(`iscrizioni-${e.titolo}.csv`, iscrizioni)}>CSV</button>
                      </div>
                      <ul className="text-sm divide-y">
                        {iscrizioni.map((i) => (
                          <li key={i.id} className="py-2">
                            <strong>{i.nome}</strong> · {i.email}{i.telefono ? ` · ${i.telefono}` : ""}{i.note ? ` · ${i.note}` : ""}
                          </li>
                        ))}
                        {iscrizioni.length === 0 && <li className="py-2 text-pietrisco">Nessuna iscrizione ancora.</li>}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {tab === "messaggi" && (
        <section className="space-y-3">
          {messaggi.map((m) => (
            <article key={m.id} className={`border-2 p-4 bg-white ${m.letto ? "border-gray-200 opacity-70" : "border-blu"}`}>
              <div className="flex justify-between items-start gap-2">
                <p className="font-display font-bold text-sm">
                  {m.nome || "Anonimə"} · <a href={`mailto:${m.email}`} className="text-blu underline">{m.email}</a>
                  <span className="text-pietrisco font-mono font-normal text-xs"> · {dt(m.created_at)}</span>
                </p>
                <button className="btn text-xs btn-bordo" onClick={() => segnaLetto(m.id, !m.letto)}>
                  {m.letto ? "Segna da leggere" : "Segna letto"}
                </button>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm">{m.messaggio}</p>
            </article>
          ))}
          {messaggi.length === 0 && <p className="text-pietrisco font-mono">Nessun messaggio.</p>}
        </section>
      )}
    </div>
  );
}
