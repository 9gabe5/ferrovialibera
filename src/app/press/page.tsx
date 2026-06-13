import Link from "next/link";
import { supabasePublic } from "@/lib/supabase";
import Intervista from "@/components/Intervista";
import VideoYouTube from "@/components/VideoYouTube";

export const metadata = { title: "Press | FerroViaLibera", description: "Rassegna stampa e interviste su FerroViaLibera." };
export const revalidate = 300;

type Press = {
  id: string; tipo: string; titolo: string; testata: string | null; autore: string | null;
  data_pubblicazione: string | null; url: string | null; estratto: string | null;
  immagine_url: string | null; corpo: string | null;
};

async function carica(): Promise<Press[]> {
  try {
    const { data } = await supabasePublic.from("press").select("*").eq("pubblicato", true).order("ordine").order("data_pubblicazione", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

const dataIt = (iso: string | null) => iso ? new Date(iso + "T12:00:00").toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }) : "";

function youtubeId(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}

export default async function PressPage() {
  const tutti = await carica();
  const articoli = tutti.filter((p) => p.tipo === "articolo");
  const interviste = tutti.filter((p) => p.tipo === "intervista");
  const video = tutti.filter((p) => p.tipo === "video");

  return (
    <>
      <section className="cartello">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl">📰 Press</h1>
          <p className="normal-case tracking-normal font-body font-normal text-antracite/70 mt-2">
            Hanno parlato di noi, e noi raccontiamo chi siamo.
          </p>
        </div>
        <div className="filetto" aria-hidden="true" />
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="font-display font-black text-2xl text-accento mb-6">🗞️ Rassegna stampa</h2>
        {articoli.length === 0 ? (
          <p className="text-pietrisco font-mono">Presto i primi articoli.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {articoli.map((p) => (
              <a key={p.id} href={p.url ?? "#"} className="border border-gray-200 bg-white flex flex-col hover:border-accento transition-colors">
                {p.immagine_url && <img src={p.immagine_url} alt="" className="w-full aspect-[16/9] object-cover" />}
                <div className="p-5 flex flex-col flex-1">
                  <p className="font-mono text-xs text-pietrisco uppercase tracking-wide">
                    {p.testata}{p.data_pubblicazione ? ` · ${dataIt(p.data_pubblicazione)}` : ""}
                  </p>
                  <h3 className="font-display font-bold text-xl text-accento mt-1">{p.titolo}</h3>
                  {p.estratto && <p className="mt-2 text-pietrisco flex-1">{p.estratto}</p>}
                  {p.autore && <p className="text-sm text-pietrisco mt-3">di {p.autore}</p>}
                  <span className="text-accento font-display font-bold text-sm uppercase tracking-wide mt-3">Leggi l&apos;articolo →</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {video.length > 0 && (
          <>
            <h2 className="font-display font-black text-2xl text-accento mt-14 mb-6">🎥 Video</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {video.map((p) => {
                const id = youtubeId(p.url);
                return (
                  <div key={p.id}>
                    {id ? (
                      <VideoYouTube id={id} titolo={p.titolo} />
                    ) : (
                      <a href={p.url ?? "#"} className="text-accento underline">{p.titolo}</a>
                    )}
                    <h3 className="font-display font-bold text-lg mt-3">{p.titolo}</h3>
                    {p.estratto && <p className="text-pietrisco text-sm mt-1">{p.estratto}</p>}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {interviste.length > 0 && (
          <>
            <h2 className="font-display font-black text-2xl text-accento mt-14 mb-6">🎙️ Le nostre interviste</h2>
            <div className="space-y-6">
              {interviste.map((p) => (
                <article key={p.id} className="border-l-4 border-accento bg-white p-6">
                  <p className="font-mono text-xs text-pietrisco uppercase tracking-wide">{dataIt(p.data_pubblicazione)}</p>
                  <h3 className="font-display font-black text-2xl text-accento mt-1">{p.titolo}</h3>
                  {p.estratto && <p className="mt-2 text-lg text-pietrisco italic">{p.estratto}</p>}
                  {p.corpo && <Intervista corpo={p.corpo} />}
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
