"use client";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

type Tessera = { nome: string; cognome: string; citta: string; socio_dal: number; anno: number; numero: string };

export default function TesseraPage() {
  const [stato, setStato] = useState<"idle" | "cerco" | "trovata" | "errore">("idle");
  const [errore, setErrore] = useState("");
  const [t, setT] = useState<Tessera | null>(null);
  const [walletAnim, setWalletAnim] = useState(false);
  const [logoData, setLogoData] = useState<string>("");
  const [dob, setDob] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  function onDob(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value.replace(/\D/g, "").slice(0, 8);
    if (v.length >= 5) v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    else if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
    setDob(v);
  }

  // Carico il logo come dataURL così html-to-image lo cattura sempre
  useEffect(() => {
    fetch("/immagini/logo-fvl.png")
      .then((r) => r.blob())
      .then((b) => new Promise<string>((res) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result)); fr.readAsDataURL(b); }))
      .then(setLogoData)
      .catch(() => {});
  }, []);

  function parseData(s: string): string | null {
    const t = s.trim().replace(/[.\-\s]/g, "/");
    let m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); // GG/MM/AAAA
    if (m) {
      const [, g, me, a] = m;
      const gg = g.padStart(2, "0"), mm = me.padStart(2, "0");
      if (+gg >= 1 && +gg <= 31 && +mm >= 1 && +mm <= 12) return `${a}-${mm}-${gg}`;
    }
    m = t.match(/^(\d{4})\/(\d{2})\/(\d{2})$/); // AAAA/MM/GG
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
    return null;
  }

  async function cerca(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const iso = parseData(dob);
    if (!iso) {
      setErrore("Scrivi la data di nascita nel formato GG/MM/AAAA (es. 25/03/1990)");
      setStato("errore");
      return;
    }
    setStato("cerco");
    setErrore("");
    const res = await fetch("/api/tessera", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: f.get("email"), data_nascita: iso }),
    });
    const json = await res.json();
    if (res.ok) { setT(json); setStato("trovata"); return; }
    if (json.error === "non_in_regola") setErrore(`Risulti socio, ma non ancora in regola per il ${json.anno}. Rinnova la tessera e riprova!`);
    else if (json.error === "non_trovato") setErrore("Nessuna tessera trovata con questi dati. Controlla email e data di nascita, oppure scrivici a info@ferrovialibera.it");
    else setErrore(json.error || "Errore");
    setStato("errore");
  }

  async function scaricaPng() {
    const dataUrl = await immagineTessera();
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.download = `tessera-ferrovialibera-${t?.cognome?.toLowerCase() || "socio"}.png`;
    a.href = dataUrl;
    a.click();
  }

  async function immagineTessera() {
    if (!cardRef.current) return;
    await document.fonts?.ready;
    await Promise.all(
      Array.from(cardRef.current.querySelectorAll("img")).map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      }),
    );
    return toPng(cardRef.current, { pixelRatio: 3, cacheBust: true });
  }

  function salvaPdf(dataUrl: string) {
    if (!cardRef.current) return;
    const w = cardRef.current.offsetWidth;
    const h = cardRef.current.offsetHeight;
    const pdf = new jsPDF({ orientation: w >= h ? "landscape" : "portrait", unit: "px", format: [w, h] });
    pdf.addImage(dataUrl, "PNG", 0, 0, w, h);
    pdf.save(`tessera-ferrovialibera-${t?.cognome?.toLowerCase() || "socio"}.pdf`);
  }

  async function scaricaPdf() {
    const dataUrl = await immagineTessera();
    if (!dataUrl) return;
    salvaPdf(dataUrl);
  }

  async function scaricaConAnimazione() {
    const dataUrl = await immagineTessera();
    if (!dataUrl) return;
    setWalletAnim(true);
    setTimeout(() => { salvaPdf(dataUrl); setWalletAnim(false); }, 1100);
  }

  return (
    <>
      <section className="cartello">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl">🎫 La mia tessera</h1>
          <p className="normal-case tracking-normal font-body font-normal text-antracite/70 mt-2">
            Sei già tesseratə? Trova e scarica la tua tessera digitale.
          </p>
        </div>
        <div className="filetto" aria-hidden="true" />
      </section>

      <section className="max-w-xl mx-auto px-4 py-14">
        {stato !== "trovata" ? (
          <form onSubmit={cerca} className="space-y-4">
            <p className="text-pietrisco">Per ritrovare la tua tessera inserisci l&apos;email con cui ti sei tesseratə e la tua data di nascita.</p>
            <div>
              <label className="label" htmlFor="t-email">Email</label>
              <input className="input" id="t-email" name="email" type="email" required />
            </div>
            <div>
              <label className="label" htmlFor="t-dob">Data di nascita</label>
              <input className="input" id="t-dob" name="data_nascita" type="text" inputMode="numeric" placeholder="GG/MM/AAAA" value={dob} onChange={onDob} maxLength={10} required />
              <p className="text-pietrisco text-xs mt-1">Scrivila così: giorno/mese/anno — es. 25/03/1990</p>
            </div>
            {stato === "errore" && <p className="text-segnale font-semibold" role="alert">{errore}</p>}
            <button className="btn btn-accento" type="submit" disabled={stato === "cerco"}>
              {stato === "cerco" ? "Cerco…" : "Trova la mia tessera"}
            </button>
          </form>
        ) : t && (
          <div className="flex flex-col items-center">
            <div
              className={`tessera-wrap ${walletAnim ? "tessera-vola" : ""}`}
            >
              <div ref={cardRef} className="tessera">
                <div className="tessera-flap" aria-hidden="true" />
                <div className="tessera-corpo">
                  <div className="flex items-center justify-between">
                    {logoData && <img src={logoData} alt="" width={52} height={52} decoding="sync" />}
                    <div className="text-right">
                      <div className="font-mono text-[10px] tracking-widest text-white/60">TESSERA ANNO</div>
                      <div className="font-display font-black text-2xl text-white leading-none">{t.anno}</div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="font-mono text-[10px] tracking-widest text-white/60">SOCIO / SOCIA</div>
                    <div className="font-display font-black text-2xl text-white leading-tight break-words">{t.nome} {t.cognome}</div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-white/90">
                    <div>
                      <div className="font-mono text-[10px] tracking-widest text-white/60">ISCRIZIONE:</div>
                      <div className="font-mono">{t.socio_dal}</div>
                    </div>
                    {t.citta && (
                      <div className="min-w-0">
                        <div className="font-mono text-sm leading-tight break-words">{t.citta}</div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
                    <span className="font-marchio font-extrabold text-white text-lg">FerroViaLibera</span>
                    <span className="font-mono text-xs text-white/80">{t.numero}</span>
                  </div>
                </div>
                <div className="filetto" aria-hidden="true" />
              </div>
            </div>

            <div className="flex gap-3 mt-8 flex-wrap justify-center">
              <button className="btn btn-accento" onClick={scaricaConAnimazione} disabled={!logoData}>⬇ Scarica tessera (PDF)</button>
              <button className="btn btn-bordo" onClick={scaricaPng} disabled={!logoData}>🖼 Salva immagine (PNG)</button>
            </div>
            <p className="text-pietrisco text-sm mt-4 text-center max-w-sm">
              Salvala nei File o nelle Foto del telefono e mostrala ai raduni per farti riconoscere! 🚂
            </p>
            <button className="text-accento underline text-sm mt-4" onClick={() => { setStato("idle"); setT(null); }}>
              ← Cerca un&apos;altra tessera
            </button>
          </div>
        )}
      </section>
    </>
  );
}
