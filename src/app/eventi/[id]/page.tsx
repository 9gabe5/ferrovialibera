import { supabasePublic } from "@/lib/supabase";
import { notFound } from "next/navigation";
import FormIscrizione from "@/components/FormIscrizione";

export const revalidate = 120;

export default async function DettaglioEvento({ params }: { params: { id: string } }) {
  const { data: e } = await supabasePublic
    .from("eventi")
    .select("*")
    .eq("id", params.id)
    .eq("pubblicato", true)
    .single();

  if (!e) notFound();

  const data = new Date(e.data_inizio);

  return (
    <>
      <section className="bg-antracite text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <p className="font-mono text-yellow-400 text-sm">
            {data.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            {" · "}
            {data.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <h1 className="font-display font-black text-3xl md:text-5xl mt-2">{e.titolo}</h1>
          <p className="font-mono text-gray-300 mt-3">
            {e.luogo}{e.binario ? ` · ${e.binario}` : ""}
          </p>
        </div>
        <div className="filetto" aria-hidden="true" />
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {e.immagine_url && (
          <img src={e.immagine_url} alt="" className="w-full max-h-96 object-cover border-4 border-accento" />
        )}
        {e.descrizione && <p className="text-lg leading-relaxed whitespace-pre-line">{e.descrizione}</p>}
        {e.link_esterno && (
          <a href={e.link_esterno} className="btn btn-bordo">Maggiori informazioni</a>
        )}

        {e.registrazione_aperta ? (
          <div className="bg-white border-2 border-accento p-6">
            <h2 className="font-display font-black text-2xl text-accento mb-4">Iscriviti</h2>
            <FormIscrizione eventoId={e.id} />
          </div>
        ) : (
          <p className="font-mono text-pietrisco">Le iscrizioni per questo evento non sono aperte sul sito.</p>
        )}
      </section>
    </>
  );
}
