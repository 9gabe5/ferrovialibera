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

const testo = (v: unknown) => String(v ?? "");
const dataBreve = (s: string | null | undefined) => {
  const d = s ? new Date(s) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }) : "-";
};

export default function Admin() {
  const [autenticato, setAutenticato] = useState(false);
  const [verificaSessione, setVerificaSessione] = useState(true);
  const [caricamento, setCaricamento] = useState(false);
  const [password, setPassword] = useState("");
  const [erroreLogin, setErroreLogin] = useState("");
  const [erroreDati, setErroreDati] = useState("");
  const [tab, setTab] = useState<"persone" | "soci" | "storico" | "eventi" | "social" | "press" | "messaggi">("persone");
  const [press, setPress] = useState<any[]>([]);
  const [mostraFormPress, setMostraFormPress] = useState(false);
  const [social, setSocial] = useState<{ id: string; url: string; ordine: number }[]>([]);
  const [nuovoUrl, setNuovoUrl] = useState("");
  const [fSocio, setFSocio] = useState("tutti");
  const [csvTesto, setCsvTesto] = useState("");
  const [esitoImport, setEsitoImport] = useState("");

  const [soci, setSoci] = useState<Socio[]>([]);
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [messaggi, setMessaggi] = useState<Messaggio[]>([]);
  const [iscrizioni, setIscrizioni] = useState<Iscrizione[]>([]);
  const [eventoAperto, setEventoAperto] = useState<string | null>(null);
  const [mostraFormEvento, setMostraFormEvento] = useState(false);
  const [fTesto, setFTesto] = useState("");
  const [fAnno, setFAnno] = useState("tutti");
  const [fStato, setFStato] = useState("tutti");
  const [fMetodo, setFMetodo] = useState("tutti");
  const [modificaId, setModificaId] = useState<string | null>(null);
  const [mostraFormSocio, setMostraFormSocio] = useState(false);
  const [fAnnoP, setFAnnoP] = useState("tutti");
  const [fOrdine, setFOrdine] = useState("cognome");

  async function leggiJson(res: Response, nome: string) {
    let json: any = null;
    try {
      json = await res.json();
    } catch {
      throw new Error(`${nome}: risposta non valida dal server`);
    }
    if (!res.ok || json?.error) {
      throw new Error(`${nome}: ${json?.error || `errore ${res.status}`}`);
    }
    return json;
  }

  async function carica(opzioni: { sessioneIniziale?: boolean } = {}) {
    setCaricamento(true);
    setErroreDati("");
    try {
      const [s, e, m, so, pr] = await Promise.all([
        fetch("/api/admin/soci").then((r) => leggiJson(r, "Soci")),
        fetch("/api/admin/eventi").then((r) => leggiJson(r, "Eventi")),
        fetch("/api/admin/messaggi").then((r) => leggiJson(r, "Messaggi")),
        fetch("/api/admin/social").then((r) => leggiJson(r, "Social")),
        fetch("/api/admin/press").then((r) => leggiJson(r, "Press")),
      ]);
      setSoci(Array.isArray(s.data) ? s.data : []);
      setEventi(Array.isArray(e.data) ? e.data : []);
      setMessaggi(Array.isArray(m.data) ? m.data : []);
      setSocial(Array.isArray(so.data) ? so.data : []);
      setPress(Array.isArray(pr.data) ? pr.data : []);
      setAutenticato(true);
    } catch (err) {
      const messaggio = err instanceof Error ? err.message : "Errore durante il caricamento";
      if (opzioni.sessioneIniziale && messaggio.includes("Non autorizzato")) {
        setAutenticato(false);
      } else {
        setErroreDati(messaggio);
        if (messaggio.includes("Non autorizzato")) setAutenticato(false);
      }
    } finally {
      setCaricamento(false);
      if (opzioni.sessioneIniziale) setVerificaSessione(false);
    }
  }

  useEffect(() => { carica({ sessioneIniziale: true }); }, []);

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

  async function salvaModifica(ev: React.FormEvent<HTMLFormElement>, id: string) {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    const campi = Object.fromEntries(f.entries());
    const res = await fetch("/api/admin/soci", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...campi }),
    });
    if (!res.ok) { alert("Errore nel salvataggio"); return; }
    setModificaId(null);
    carica();
  }

  async function creaSocio(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    const res = await fetch("/api/admin/soci", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(f.entries())),
    });
    const json = await res.json();
    if (!res.ok) { alert("Errore: " + json.error); return; }
    setMostraFormSocio(false);
    carica();
  }

  async function eliminaSocio(id: string, nome: string) {
    if (!confirm(`Eliminare definitivamente la scheda di ${nome}? L'azione non si può annullare.`)) return;
    await fetch("/api/admin/soci", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    carica();
  }

  async function aggiungiSocial() {
    const res = await fetch("/api/admin/social", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: nuovoUrl }) });
    const json = await res.json();
    if (!res.ok) { alert("Errore: " + json.error); return; }
    setNuovoUrl("");
    carica();
  }
  async function eliminaSocial(id: string) {
    await fetch("/api/admin/social", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    carica();
  }

  async function creaPress(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    const res = await fetch("/api/admin/press", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(f.entries())) });
    const json = await res.json();
    if (!res.ok) { alert("Errore: " + json.error); return; }
    setMostraFormPress(false);
    carica();
  }
  async function eliminaPress(id: string, titolo: string) {
    if (!confirm(`Eliminare "${titolo}"?`)) return;
    await fetch("/api/admin/press", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    carica();
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

  function parseCsv(testo: string) {
    const righeRaw = testo.trim().split(/\r?\n/).filter(Boolean);
    if (righeRaw.length < 2) return [];
    const sep = righeRaw[0].includes(";") ? ";" : ",";
    const intest = righeRaw[0].split(sep).map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
    return righeRaw.slice(1).map((riga) => {
      const valori = riga.split(sep).map((v) => v.trim().replace(/^"|"$/g, ""));
      const o: Record<string, string> = {};
      intest.forEach((h, i) => { o[h] = valori[i] ?? ""; });
      return o;
    });
  }

  async function importaCsv() {
    setEsitoImport("");
    const righe = parseCsv(csvTesto);
    if (righe.length === 0) { setEsitoImport("Nessuna riga valida trovata. Servono intestazioni + dati."); return; }
    const res = await fetch("/api/admin/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ righe }),
    });
    const json = await res.json();
    if (!res.ok) { setEsitoImport("Errore: " + json.error); return; }
    setEsitoImport(`Importate ${json.importate} righe ✓`);
    setCsvTesto("");
    carica();
  }

  if (verificaSessione) {
    return (
      <div className="max-w-sm mx-auto px-4 py-24">
        <h1 className="font-display font-black text-2xl text-accento mb-6">Cabina di guida</h1>
        <p className="text-pietrisco font-mono">Controllo accesso...</p>
      </div>
    );
  }

  if (!autenticato) {
    return (
      <div className="max-w-sm mx-auto px-4 py-24">
        <h1 className="font-display font-black text-2xl text-accento mb-6">Cabina di guida 🔐</h1>
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
          {erroreDati && <p className="text-segnale font-semibold text-sm">{erroreDati}</p>}
          <button className="btn btn-accento w-full" type="submit" disabled={caricamento}>
            {caricamento ? "Carico..." : "Entra"}
          </button>
        </form>
      </div>
    );
  }

  const inAttesa = soci.filter((s) => s.stato === "in_attesa").length;
  const nonLetti = messaggi.filter((m) => !m.letto).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display font-black text-3xl text-accento mb-6">Cabina di guida</h1>

      {erroreDati && (
        <div className="border-2 border-segnale bg-white p-4 mb-6 text-sm">
          <p className="font-display font-bold text-segnale">Qualcosa non sta caricando</p>
          <p className="text-pietrisco mt-1">{erroreDati}</p>
          <button className="btn btn-bordo text-xs mt-3" onClick={() => carica()} disabled={caricamento}>
            Riprova
          </button>
        </div>
      )}

      <div className="flex gap-2 mb-8 flex-wrap">
        {([
          ["persone", "Soci"],
          ["soci", `Richieste ${inAttesa ? `(${inAttesa})` : ""}`],
          ["storico", "Storico"],
          ["eventi", "Eventi"],
          ["social", "Social"],
          ["press", "Press"],
          ["messaggi", `Messaggi ${nonLetti ? `(${nonLetti})` : ""}`],
        ] as const).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`btn text-xs ${tab === t ? "btn-accento" : "btn-bordo"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "persone" && (() => {
        const annoCorrente = new Date().getFullYear();
        const mappa = new Map<string, { chiave: string; righe: Socio[] }>();
        for (const r of soci) {
          if (r.stato === "respinto") continue;
          const chiave = (r.codice_fiscale || r.email || `${r.nome}-${r.cognome}`).toLowerCase();
          if (!mappa.has(chiave)) mappa.set(chiave, { chiave, righe: [] });
          mappa.get(chiave)!.righe.push(r);
        }
        const dataIscrizione = (r: Socio) => {
          const m = (r.note || "").match(/pagato (\d{4}-\d{2}-\d{2})/);
          return m ? m[1] : testo(r.created_at).slice(0, 10);
        };
        const persone = Array.from(mappa.values()).map(({ chiave, righe }) => {
          const ordinate = [...righe].sort((a, b) => a.anno - b.anno || dataIscrizione(a).localeCompare(dataIscrizione(b)));
          const recente = [...righe].sort((a, b) => b.anno - a.anno)[0];
          const inRegola = righe.some((r) => r.anno === annoCorrente && r.stato === "approvato");
          const anni = Array.from(new Set(righe.filter((r) => r.stato === "approvato").map((r) => r.anno))).sort();
          return { chiave, recente, inRegola, anni, da: dataIscrizione(ordinate[0]) };
        }).sort((a, b) => `${testo(a.recente.cognome)} ${testo(a.recente.nome)}`.localeCompare(`${testo(b.recente.cognome)} ${testo(b.recente.nome)}`));

        const filtrate = persone.filter((p) => {
          if (fAnnoP !== "tutti" && !p.anni.includes(Number(fAnnoP))) return false;
          if (fSocio === "soci" && !p.inRegola) return false;
          if (fSocio === "non_soci" && p.inRegola) return false;
          if (fTesto) {
            const t = fTesto.toLowerCase();
            const r = p.recente;
            const blob = `${testo(r.nome)} ${testo(r.cognome)} ${testo(r.email)} ${r.codice_fiscale ?? ""} ${r.citta ?? ""} ${r.telefono ?? ""}`.toLowerCase();
            if (!blob.includes(t)) return false;
          }
          return true;
        });
        const ordinata = [...filtrate].sort((a, b) => {
          const ra = a.recente, rb = b.recente;
          if (fOrdine === "nome") return `${testo(ra.nome)} ${testo(ra.cognome)}`.localeCompare(`${testo(rb.nome)} ${testo(rb.cognome)}`);
          if (fOrdine === "citta") return testo(ra.citta || "zzz").localeCompare(testo(rb.citta || "zzz"));
          if (fOrdine === "data") return a.da.localeCompare(b.da); // prima iscrizione, dal più vecchio
          return `${testo(ra.cognome)} ${testo(ra.nome)}`.localeCompare(`${testo(rb.cognome)} ${testo(rb.nome)}`); // cognome (default)
        });
        const anniDisponibili = Array.from(new Set([2023, 2024, 2025, annoCorrente, ...soci.map((s) => s.anno)])).sort((a, b) => b - a);

        const dataIt = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });

        return (
          <section>
            <div className="grid gap-2 sm:grid-cols-2 mb-4">
              <input className="input sm:col-span-2" placeholder="🔎 Cerca nome, email, CF, città…" value={fTesto} onChange={(e) => setFTesto(e.target.value)} />
              <select className="input" value={fOrdine} onChange={(e) => setFOrdine(e.target.value)} aria-label="Ordina per">
                <option value="cognome">Ordina per cognome</option>
                <option value="nome">Ordina per nome</option>
                <option value="data">Ordina per data di tesseramento</option>
                <option value="citta">Ordina per città</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <select className="input" value={fAnnoP} onChange={(e) => setFAnnoP(e.target.value)} aria-label="Filtra per anno">
                  <option value="tutti">Tutti gli anni</option>
                  {anniDisponibili.map((a) => <option key={a} value={String(a)}>Soci {a}</option>)}
                </select>
                <select className="input" value={fSocio} onChange={(e) => setFSocio(e.target.value)} aria-label="Filtra soci">
                  <option value="tutti">In regola e non</option>
                  <option value="soci">Solo soci {annoCorrente}</option>
                  <option value="non_soci">Solo non soci</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <p className="text-pietrisco text-sm">
                {filtrate.length} persone · <span className="text-green-700 font-semibold">{persone.filter((p) => p.inRegola).length} soci in regola {annoCorrente}</span> · {persone.filter((p) => !p.inRegola).length} non soci
              </p>
              <button className="btn btn-bordo text-xs" onClick={() => scaricaCsv("anagrafica-soci.csv", filtrate.map((p) => ({
                socio_in_regola: p.inRegola ? "SI" : "NO", socio_dal: p.da, anni: p.anni.join(" "),
                nome: p.recente.nome, cognome: p.recente.cognome, email: p.recente.email,
                telefono: p.recente.telefono, codice_fiscale: p.recente.codice_fiscale, citta: p.recente.citta,
              })))}>Esporta CSV</button>
            </div>
            <div className="space-y-3">
              {ordinata.map((p) => {
                const r = p.recente;
                return (
                  <article key={p.chiave} className={`border-2 p-4 bg-white ${p.inRegola ? "border-green-600" : "border-red-400"}`}>
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <p className="font-display font-bold text-lg">
                          {r.nome} {r.cognome}{" "}
                          {p.inRegola
                            ? <span className="text-green-700 text-sm font-mono">✓ Socio</span>
                            : <span className="text-segnale text-sm font-mono font-bold">✗ Non socio</span>}
                        </p>
                        <p className="text-sm text-pietrisco">Socio dal {dataIt(p.da)} · anni: {p.anni.length ? p.anni.join(" · ") : "—"}</p>
                        <p className="text-sm mt-1">
                          {r.email}{r.telefono ? <> · <a className="text-accento underline" href={`tel:${r.telefono}`}>{r.telefono}</a></> : ""}
                        </p>
                        <p className="text-sm text-pietrisco">
                          {r.codice_fiscale ? `CF ${r.codice_fiscale}` : "CF mancante"}{r.citta ? ` · ${r.citta}` : ""}
                        </p>
                      </div>
                      <button className="btn text-xs btn-bordo" aria-label={`Modifica ${r.nome} ${r.cognome}`} onClick={() => { setTab("soci"); setFTesto(r.email); }}>✏️</button>
                    </div>
                  </article>
                );
              })}
              {ordinata.length === 0 && <p className="text-pietrisco font-mono">Nessuna persona trovata.</p>}
            </div>
          </section>
        );
      })()}

      {tab === "soci" && (() => {
        const anni = Array.from(new Set(soci.map((x) => x.anno))).sort((a, b) => b - a);
        const filtrati = soci.filter((x) => {
          if (fAnno !== "tutti" && String(x.anno) !== fAnno) return false;
          if (fStato !== "tutti" && x.stato !== fStato) return false;
          if (fMetodo !== "tutti" && x.metodo_pagamento !== fMetodo) return false;
          if (fTesto) {
            const t = fTesto.toLowerCase();
            const blob = `${testo(x.nome)} ${testo(x.cognome)} ${testo(x.email)} ${x.codice_fiscale ?? ""} ${x.citta ?? ""}`.toLowerCase();
            if (!blob.includes(t)) return false;
          }
          return true;
        });
        return (
          <section>
            <div className="grid gap-2 sm:grid-cols-4 mb-4">
              <input className="input sm:col-span-2" placeholder="🔎 Cerca nome, email, CF, città…" value={fTesto} onChange={(e) => setFTesto(e.target.value)} />
              <select className="input" value={fAnno} onChange={(e) => setFAnno(e.target.value)} aria-label="Filtra per anno">
                <option value="tutti">Tutti gli anni</option>
                {anni.map((a) => <option key={a} value={String(a)}>{a}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <select className="input" value={fStato} onChange={(e) => setFStato(e.target.value)} aria-label="Filtra per stato">
                  <option value="tutti">Ogni stato</option>
                  <option value="in_attesa">In attesa</option>
                  <option value="approvato">Approvati</option>
                  <option value="respinto">Scartati</option>
                </select>
                <select className="input" value={fMetodo} onChange={(e) => setFMetodo(e.target.value)} aria-label="Filtra per pagamento">
                  <option value="tutti">Ogni pagamento</option>
                  <option value="paypal">PayPal</option>
                  <option value="bonifico">Bonifico</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <p className="text-pietrisco text-sm">{filtrati.length} risultati su {soci.length} richieste</p>
              <div className="flex gap-2">
                <button className="btn btn-accento text-xs" onClick={() => setMostraFormSocio(!mostraFormSocio)}>{mostraFormSocio ? "Annulla" : "+ Aggiungi socio"}</button>
                <button className="btn btn-bordo text-xs" onClick={() => scaricaCsv("soci-ferrovialibera.csv", filtrati)}>Esporta CSV</button>
              </div>
            </div>

            {mostraFormSocio && (
              <form onSubmit={creaSocio} className="border-2 border-accento bg-white p-5 mb-6 grid gap-3 sm:grid-cols-3 text-sm">
                <p className="sm:col-span-3 font-display font-bold text-accento">Nuovo socio (inserimento manuale)</p>
                <div><label className="label">Nome *</label><input className="input" name="nome" required /></div>
                <div><label className="label">Cognome *</label><input className="input" name="cognome" required /></div>
                <div><label className="label">Email</label><input className="input" name="email" type="email" /></div>
                <div><label className="label">Telefono</label><input className="input" name="telefono" /></div>
                <div><label className="label">Codice fiscale</label><input className="input uppercase" name="codice_fiscale" /></div>
                <div><label className="label">Data di nascita</label><input className="input" name="data_nascita" type="date" /></div>
                <div><label className="label">Città</label><input className="input" name="citta" /></div>
                <div><label className="label">Indirizzo</label><input className="input" name="indirizzo" /></div>
                <div><label className="label">Anno</label><input className="input" name="anno" type="number" defaultValue={new Date().getFullYear()} /></div>
                <div>
                  <label className="label">Tipo</label>
                  <select className="input" name="tipo" defaultValue="nuovo"><option value="nuovo">nuovo</option><option value="rinnovo">rinnovo</option></select>
                </div>
                <div>
                  <label className="label">Pagamento</label>
                  <select className="input" name="metodo_pagamento" defaultValue=""><option value="">—</option><option value="paypal">paypal</option><option value="bonifico">bonifico</option></select>
                </div>
                <div>
                  <label className="label">Stato</label>
                  <select className="input" name="stato" defaultValue="approvato"><option value="approvato">approvato</option><option value="in_attesa">in attesa</option></select>
                </div>
                <div className="sm:col-span-3"><label className="label">Note</label><input className="input" name="note" /></div>
                <button type="submit" className="btn btn-accento sm:col-span-3">Salva nuovo socio</button>
              </form>
            )}
            <div className="space-y-3">
              {filtrati.map((s) => (
                <article key={s.id} className={`border-2 p-4 bg-white ${s.stato === "in_attesa" ? "border-yellow-500" : s.stato === "approvato" ? "border-green-600" : "border-gray-300 opacity-70"}`}>
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <p className="font-display font-bold">
                        {s.nome} {s.cognome}{" "}
                        <span className="text-xs font-mono text-pietrisco">· {s.tipo} {s.anno} · {dataBreve(s.created_at)}</span>
                        {s.stato === "approvato" && <span className="ml-1 text-green-700 text-xs font-mono">✓ socio</span>}
                        {s.stato === "respinto" && <span className="ml-1 text-pietrisco text-xs font-mono">scartato</span>}
                      </p>
                      <p className="text-sm text-pietrisco">
                        {s.email}{s.telefono ? ` · ${s.telefono}` : ""}{s.codice_fiscale ? ` · CF ${s.codice_fiscale}` : ""}{s.citta ? ` · ${s.citta}` : ""}
                      </p>
                      {s.metodo_pagamento && (
                        <p className="text-sm mt-1">Pagamento: <strong className="uppercase">{s.metodo_pagamento}</strong></p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {s.stato === "in_attesa" && (
                        <>
                          <button className="btn text-xs bg-green-700 text-white hover:bg-green-800" onClick={() => aggiornaSocio(s.id, "approvato")}>Approva</button>
                          <button className="btn text-xs btn-bordo" onClick={() => { if (confirm(`Scartare la richiesta di ${s.nome} ${s.cognome}?`)) aggiornaSocio(s.id, "respinto"); }}>Scarta</button>
                        </>
                      )}
                      <button className="btn text-xs btn-bordo" aria-label={`Modifica ${s.nome} ${s.cognome}`} onClick={() => setModificaId(modificaId === s.id ? null : s.id)}>✏️</button>
                      <button className="btn text-xs bg-segnale text-white" aria-label={`Elimina ${s.nome} ${s.cognome}`} onClick={() => eliminaSocio(s.id, `${s.nome} ${s.cognome}`)}>🗑</button>
                    </div>
                  </div>

                  {modificaId === s.id && (
                    <form onSubmit={(e) => salvaModifica(e, s.id)} className="mt-4 border-t pt-4 grid gap-3 sm:grid-cols-3 text-sm">
                      <div><label className="label">Nome</label><input className="input" name="nome" defaultValue={s.nome} /></div>
                      <div><label className="label">Cognome</label><input className="input" name="cognome" defaultValue={s.cognome} /></div>
                      <div><label className="label">Email</label><input className="input" name="email" type="email" defaultValue={s.email} /></div>
                      <div><label className="label">Telefono</label><input className="input" name="telefono" defaultValue={s.telefono ?? ""} /></div>
                      <div><label className="label">Codice fiscale</label><input className="input uppercase" name="codice_fiscale" defaultValue={s.codice_fiscale ?? ""} /></div>
                      <div><label className="label">Data di nascita</label><input className="input" name="data_nascita" type="date" defaultValue={s.data_nascita ?? ""} /></div>
                      <div><label className="label">Città</label><input className="input" name="citta" defaultValue={s.citta ?? ""} /></div>
                      <div><label className="label">Indirizzo</label><input className="input" name="indirizzo" defaultValue={s.indirizzo ?? ""} /></div>
                      <div><label className="label">Anno</label><input className="input" name="anno" type="number" defaultValue={s.anno} /></div>
                      <div>
                        <label className="label">Tipo</label>
                        <select className="input" name="tipo" defaultValue={s.tipo}>
                          <option value="nuovo">nuovo</option>
                          <option value="rinnovo">rinnovo</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Pagamento</label>
                        <select className="input" name="metodo_pagamento" defaultValue={s.metodo_pagamento ?? ""}>
                          <option value="">—</option>
                          <option value="paypal">paypal</option>
                          <option value="bonifico">bonifico</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Stato</label>
                        <select className="input" name="stato" defaultValue={s.stato}>
                          <option value="in_attesa">in attesa</option>
                          <option value="approvato">approvato</option>
                          <option value="respinto">scartato</option>
                        </select>
                      </div>
                      <div className="sm:col-span-3"><label className="label">Note</label><input className="input" name="note" defaultValue={s.note ?? ""} /></div>
                      <div className="sm:col-span-3 flex gap-2">
                        <button type="submit" className="btn btn-accento text-xs">Salva</button>
                        <button type="button" className="btn btn-bordo text-xs" onClick={() => setModificaId(null)}>Annulla</button>
                      </div>
                    </form>
                  )}
                </article>
              ))}
              {filtrati.length === 0 && <p className="text-pietrisco font-mono">Nessun risultato con questi filtri.</p>}
            </div>
          </section>
        );
      })()}

      {tab === "storico" && (() => {
        const persone = new Map<string, { nome: string; chiave: string; email: string; anni: Map<number, string> }>();
        for (const s of soci) {
          const chiave = (s.codice_fiscale || s.email || `${s.nome}-${s.cognome}`).toLowerCase();
          if (!persone.has(chiave)) {
            persone.set(chiave, { nome: `${testo(s.nome)} ${testo(s.cognome)}`, chiave, email: testo(s.email), anni: new Map() });
          }
          const p = persone.get(chiave)!;
          const prec = p.anni.get(s.anno);
          if (!prec || s.stato === "approvato") p.anni.set(s.anno, s.stato);
        }
        const anniTutti = Array.from(new Set(soci.map((s) => s.anno))).sort();
        const lista = Array.from(persone.values()).sort((a, b) => a.nome.localeCompare(b.nome));
        const annoCorrente = 2026;
        return (
          <section>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <p className="text-pietrisco text-sm">
                {lista.length} persone · {lista.filter((p) => p.anni.get(annoCorrente) === "approvato").length} in regola per il {annoCorrente}
              </p>
            </div>

            <details className="border-2 border-gray-300 bg-white p-4 mb-6">
              <summary className="font-display font-bold cursor-pointer">📥 Importa soci da CSV (anni passati)</summary>
              <div className="mt-3 space-y-3 text-sm">
                <p className="text-pietrisco">
                  Prima riga = intestazioni. Colonne riconosciute: <code className="font-mono">anno; nome; cognome; email; telefono; codice_fiscale; data_nascita; citta; metodo_pagamento; note</code>.
                  Obbligatorie solo <strong>anno, nome, cognome</strong>. Separatore ; o , — vengono salvate come approvate.
                </p>
                <div>
                  <label className="label" htmlFor="csv-file">Carica il file CSV</label>
                  <input
                    id="csv-file"
                    type="file"
                    accept=".csv,text/csv,text/plain"
                    className="block w-full text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => setCsvTesto(String(reader.result || ""));
                      reader.readAsText(file, "utf-8");
                    }}
                  />
                </div>
                <p className="text-pietrisco">…oppure incolla il testo qui sotto:</p>
                <textarea
                  className="input font-mono text-xs"
                  rows={8}
                  placeholder={"anno;nome;cognome;email\n2023;Maria;Rossi;maria@esempio.it\n2024;Maria;Rossi;maria@esempio.it"}
                  value={csvTesto}
                  onChange={(e) => setCsvTesto(e.target.value)}
                />
                <div className="flex items-center gap-3 flex-wrap">
                  <button className="btn btn-accento text-xs" onClick={importaCsv}>Importa</button>
                  {esitoImport && <p className="font-semibold">{esitoImport}</p>}
                </div>
              </div>
            </details>

            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white border border-gray-300">
                <thead>
                  <tr className="cartello text-left text-xs">
                    <th className="p-2">Socio</th>
                    {anniTutti.map((a) => <th key={a} className="p-2 text-center">{a}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lista.map((p) => (
                    <tr key={p.chiave}>
                      <td className="p-2">
                        <span className="font-display font-semibold">{p.nome}</span>
                        <span className="block text-xs text-pietrisco">{p.email}</span>
                      </td>
                      {anniTutti.map((a) => {
                        const st = p.anni.get(a);
                        return (
                          <td key={a} className="p-2 text-center font-mono">
                            {st === "approvato" ? "✓" : st === "in_attesa" ? "⏳" : st === "respinto" ? "✗" : "·"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-pietrisco mt-2 font-mono">✓ approvato · ⏳ in attesa · ✗ respinto · "·" nessuna richiesta</p>
          </section>
        );
      })()}

      {tab === "eventi" && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <p className="text-pietrisco text-sm">{eventi.length} eventi</p>
            <button className="btn btn-accento text-xs" onClick={() => setMostraFormEvento(!mostraFormEvento)}>
              {mostraFormEvento ? "Annulla" : "+ Nuovo evento"}
            </button>
          </div>

          {mostraFormEvento && (
            <form onSubmit={salvaEvento} className="border-2 border-accento bg-white p-5 mb-6 grid gap-4 sm:grid-cols-2">
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
              <button className="btn btn-accento sm:col-span-2" type="submit">Crea evento</button>
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
                        {dataBreve(e.data_inizio)} · {e.luogo ?? "—"} · {n} iscrittə
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

      {tab === "social" && (
        <section>
          <p className="text-pietrisco text-sm mb-3">Incolla il link di un post Instagram (es. https://www.instagram.com/p/XXXX/). Apparirà nella pagina <strong>Social</strong> del sito.</p>
          <div className="flex gap-2 mb-6 flex-wrap">
            <input className="input flex-1 min-w-[200px]" placeholder="https://www.instagram.com/p/…" value={nuovoUrl} onChange={(e) => setNuovoUrl(e.target.value)} />
            <button className="btn btn-accento text-xs" onClick={aggiungiSocial}>Aggiungi</button>
          </div>
          <ul className="space-y-2">
            {social.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2 border border-gray-200 bg-white p-3 text-sm">
                <a href={p.url} className="text-accento underline break-all">{p.url}</a>
                <button className="btn text-xs bg-segnale text-white shrink-0" onClick={() => eliminaSocial(p.id)}>🗑</button>
              </li>
            ))}
            {social.length === 0 && <li className="text-pietrisco font-mono">Nessun post ancora.</li>}
          </ul>
        </section>
      )}

      {tab === "press" && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <p className="text-pietrisco text-sm">{press.length} voci in rassegna</p>
            <button className="btn btn-accento text-xs" onClick={() => setMostraFormPress(!mostraFormPress)}>{mostraFormPress ? "Annulla" : "+ Aggiungi"}</button>
          </div>
          {mostraFormPress && (
            <form onSubmit={creaPress} className="border-2 border-accento bg-white p-5 mb-6 grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <label className="label">Tipo</label>
                <select className="input" name="tipo" defaultValue="articolo"><option value="articolo">Articolo (rassegna stampa)</option><option value="intervista">Intervista (testo sul sito)</option><option value="video">Video (YouTube)</option></select>
              </div>
              <div><label className="label">Data</label><input className="input" name="data_pubblicazione" type="date" /></div>
              <div className="sm:col-span-2"><label className="label">Titolo *</label><input className="input" name="titolo" required /></div>
              <div><label className="label">Testata</label><input className="input" name="testata" placeholder="Gay.it" /></div>
              <div><label className="label">Autore</label><input className="input" name="autore" /></div>
              <div className="sm:col-span-2"><label className="label">Link (per gli articoli)</label><input className="input" name="url" type="url" /></div>
              <div className="sm:col-span-2"><label className="label">Immagine (URL)</label><input className="input" name="immagine_url" type="url" /></div>
              <div className="sm:col-span-2"><label className="label">Estratto / sottotitolo</label><textarea className="input" name="estratto" rows={2} /></div>
              <div className="sm:col-span-2"><label className="label">Corpo (solo interviste, testo completo)</label><textarea className="input" name="corpo" rows={6} /></div>
              <button type="submit" className="btn btn-accento sm:col-span-2">Salva</button>
            </form>
          )}
          <div className="space-y-2">
            {press.map((p) => (
              <article key={p.id} className="flex items-center justify-between gap-2 border border-gray-200 bg-white p-3">
                <div>
                  <p className="font-display font-bold text-sm">{p.titolo} <span className="font-mono text-xs text-pietrisco">· {p.tipo}{p.testata ? ` · ${p.testata}` : ""}</span></p>
                  {p.url && <a href={p.url} className="text-accento underline text-xs break-all">{p.url}</a>}
                </div>
                <button className="btn text-xs bg-segnale text-white shrink-0" onClick={() => eliminaPress(p.id, p.titolo)}>🗑</button>
              </article>
            ))}
            {press.length === 0 && <p className="text-pietrisco font-mono">Nessuna voce ancora.</p>}
          </div>
        </section>
      )}

      {tab === "messaggi" && (
        <section className="space-y-3">
          {messaggi.map((m) => (
            <article key={m.id} className={`border-2 p-4 bg-white ${m.letto ? "border-gray-200 opacity-70" : "border-accento"}`}>
              <div className="flex justify-between items-start gap-2">
                <p className="font-display font-bold text-sm">
                  {m.nome || "Anonimə"} · <a href={`mailto:${m.email}`} className="text-accento underline">{m.email}</a>
                  <span className="text-pietrisco font-mono font-normal text-xs"> · {dataBreve(m.created_at)}</span>
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
