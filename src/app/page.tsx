import Link from "next/link";
import { supabasePublic } from "@/lib/supabase";

export const revalidate = 300;

async function prossimiEventi() {
  try {
    const { data } = await supabasePublic
      .from("eventi")
      .select("id, titolo, data_inizio, luogo, binario")
      .eq("pubblicato", true)
      .gte("data_inizio", new Date().toISOString())
      .order("data_inizio", { ascending: true })
      .limit(4);
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const eventi = await prossimiEventi();

  return (
    <>
      {/* HERO: cartello di stazione */}
      <section className="cartello">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <p className="font-mono text-sm normal-case tracking-normal text-antracite/60 mb-4">
            Associazione di Ferrovierə LGBTQ+ · dal Pride Month 2023
          </p>
          <h1 className="text-4xl md:text-6xl leading-tight">
            Per una ferrovia<br />libera da discriminazioni.
          </h1>
          <p className="mt-6 max-w-2xl normal-case tracking-normal font-body font-normal text-antracite/70 text-lg">
            Lavoriamo per un settore ferroviario pienamente inclusivo, dove ogni persona
            possa essere sé stessa — in cabina, in officina, in stazione e ovunque corra un binario.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tesseramento" className="btn btn-accento">
              Unisciti a noi
            </Link>
            <Link href="/eventi" className="btn btn-bordo">
              Prossimi eventi
            </Link>
          </div>
        </div>
        <div className="binario-treno" aria-hidden="true">
          <span className="treno">
            <svg width="44" height="26" viewBox="0 0 44 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* musetto a sinistra, corpo treno */}
              <path d="M3 17 L3 11 Q3 6 9 5 L40 5 Q43 5 43 8 L43 17 Z" fill="#2F6E5E" stroke="#234E43" strokeWidth="1.2"/>
              <path d="M3 11 Q3 6 9 5 L13 5 L9 12 L3 12 Z" fill="#234E43"/>
              {/* finestrino frontale */}
              <path d="M5 11 Q5.5 7.5 9.5 7 L12 7 L9.2 11 Z" fill="#DCEBE4"/>
              {/* finestrini */}
              <rect x="16" y="7.5" width="6" height="5" rx="1" fill="#DCEBE4"/>
              <rect x="24" y="7.5" width="6" height="5" rx="1" fill="#DCEBE4"/>
              <rect x="32" y="7.5" width="6" height="5" rx="1" fill="#DCEBE4"/>
              {/* fascia arcobaleno */}
              <rect x="3" y="14.5" width="40" height="2.2" fill="#FF8C00"/>
              {/* ruote */}
              <circle cx="11" cy="19" r="3" fill="#1C1E21"/>
              <circle cx="11" cy="19" r="1.1" fill="#6B7280"/>
              <circle cx="33" cy="19" r="3" fill="#1C1E21"/>
              <circle cx="33" cy="19" r="1.1" fill="#6B7280"/>
              {/* faro */}
              <circle cx="4.5" cy="13" r="1" fill="#FFED00"/>
            </svg>
          </span>
        </div>
      </section>

      {/* CHI SIAMO */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid gap-10 md:grid-cols-2 items-center">
        <div>
          <h2 className="font-display font-black text-3xl text-accento mb-4">👋 Chi siamo</h2>
          <p className="text-lg leading-relaxed">
            Nel giugno del 2023, durante il Pride Month, FerroViaLibera è nata con l&apos;obiettivo
            di promuovere l&apos;uguaglianza e i diritti LGBTQ+ nel settore ferroviario. Attraverso
            incontri, campagne di sensibilizzazione e collaborazioni con aziende del settore,
            l&apos;associazione lavora per garantire un ambiente di lavoro libero da discriminazioni
            e pienamente inclusivo.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/su-di-noi" className="btn btn-bordo">La nostra storia</Link>
            <Link href="/statuto" className="btn btn-bordo">Lo Statuto</Link>
          </div>
        </div>
        <img
          src="https://static.wixstatic.com/media/a7f111_6807dc9654da477caad3dff6c3019ddd~mv2.jpeg"
          alt="Il gruppo di FerroViaLibera in stazione con la bandiera arcobaleno"
          className="w-full object-cover border-4 border-accento"
        />
      </section>

      {/* NUMERI */}
      <section className="bg-pastello">
        <div className="filetto-sottile" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { e: "🌈", n: "dal 2023", t: "in viaggio insieme" },
            { e: "🎫", n: "120+", t: "persone tesserate" },
            { e: "🚂", n: "6", t: "progetti attivi" },
            { e: "🗺️", n: "tutta Italia", t: "da nord a sud" },
          ].map((x) => (
            <div key={x.t}>
              <div className="text-3xl" aria-hidden="true">{x.e}</div>
              <div className="font-display font-black text-xl text-accento mt-1">{x.n}</div>
              <div className="text-sm text-antracite/70">{x.t}</div>
            </div>
          ))}
        </div>
        <div className="filetto-sottile" aria-hidden="true" />
      </section>

      {/* TABELLONE PARTENZE */}
      <section className="bg-antracite text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 mb-6">
            <h2 className="font-display font-black text-3xl">
              🚉 Prossime partenze
            </h2>
            <Link href="/eventi" className="font-mono text-sm text-yellow-400 hover:underline">
              Tabellone completo →
            </Link>
          </div>
          {eventi.length === 0 ? (
            <p className="font-mono text-gray-400">Nessuna partenza in programma. Torna presto!</p>
          ) : (
            <ul className="font-mono divide-y divide-gray-700 border-y border-gray-700">
              {eventi.map((e) => (
                <li key={e.id}>
                  <Link href={`/eventi/${e.id}`} className="grid grid-cols-[auto_1fr_auto] gap-4 py-4 items-center hover:bg-gray-800 px-2 -mx-2">
                    <span className="text-yellow-400 font-semibold whitespace-nowrap">
                      {new Date(e.data_inizio).toLocaleDateString("it-IT", { day: "2-digit", month: "short" })}
                    </span>
                    <span className="uppercase tracking-wide truncate">{e.titolo}</span>
                    <span className="text-gray-400 text-sm hidden sm:block">{e.luogo}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* CTA TESSERAMENTO */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display font-black text-3xl md:text-4xl text-accento">
          💪 Unisciti alla nostra causa
        </h2>
        <p className="mt-3 text-lg text-pietrisco max-w-xl mx-auto">
          Cambiare il mondo in un luogo migliore inizia da noi stessi.
        </p>
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <Link href="/tesseramento" className="btn btn-accento">Tesseramento 2026</Link>
          <Link href="/rinnovo" className="btn btn-bordo">Rinnova la tessera</Link>
        </div>
        <p className="mt-5 text-sm text-pietrisco">
          Sei già socə? <Link href="/tessera" className="text-accento underline font-semibold">Scarica la tua tessera digitale 🎫</Link>
        </p>
      </section>
    </>
  );
}
