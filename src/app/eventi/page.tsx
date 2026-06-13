import Link from "next/link";
import { supabasePublic } from "@/lib/supabase";
import Tabellone from "@/components/Tabellone";

export const metadata = { title: "Eventi | FerroViaLibera" };
export const revalidate = 300;

async function caricaEventi() {
  try {
    const { data } = await supabasePublic
      .from("eventi")
      .select("id, titolo, data_inizio, luogo, binario, registrazione_aperta")
      .eq("pubblicato", true)
      .order("data_inizio", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function Eventi() {
  const tutti = await caricaEventi();
  const ora = Date.now();
  const futuri = tutti.filter((e) => new Date(e.data_inizio).getTime() >= ora).reverse();
  const passati = tutti.filter((e) => new Date(e.data_inizio).getTime() < ora);

  return (
    <>
      <section className="bg-antracite text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="font-display font-black text-4xl md:text-5xl">
            Partenze <span className="font-mono text-yellow-400 text-2xl align-middle">· Eventi</span>
          </h1>
          <p className="text-gray-300 mt-2">Raduni, gite, Pride e riunioni: sali a bordo.</p>
        </div>
        <div className="filetto" aria-hidden="true" />
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="font-display font-black text-2xl text-accento mb-4">In partenza</h2>
        {futuri.length === 0 ? (
          <p className="text-pietrisco font-mono">Nessuna partenza in programma al momento.</p>
        ) : (
          <Tabellone eventi={futuri} />
        )}

        {passati.length > 0 && (
          <>
            <h2 className="font-display font-black text-2xl text-pietrisco mt-12 mb-4">Già partiti</h2>
            <ul className="font-mono divide-y divide-gray-200 border-y border-gray-300 opacity-70">
              {passati.map((e) => (
                <li key={e.id} className="grid grid-cols-[5rem_1fr] sm:grid-cols-[6rem_1fr_10rem] gap-3 items-center px-4 py-3">
                  <span className="text-pietrisco">
                    {new Date(e.data_inizio).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "2-digit" })}
                  </span>
                  <span className="uppercase tracking-wide text-sm">{e.titolo}</span>
                  <span className="text-pietrisco text-sm hidden sm:block truncate">{e.luogo}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}
