import Link from "next/link";
import { supabasePublic } from "@/lib/supabase";

export const metadata = { title: "Negozio | FerroViaLibera" };
export const revalidate = 300;

export default async function Negozio() {
  let attivo = false;
  try {
    const { data } = await supabasePublic
      .from("impostazioni")
      .select("valore")
      .eq("chiave", "negozio_attivo")
      .single();
    attivo = data?.valore === "true";
  } catch {}

  return (
    <>
      <section className="cartello">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl">Negozio</h1>
        </div>
        <div className="filetto" aria-hidden="true" />
      </section>
      <section className="max-w-3xl mx-auto px-4 py-14 text-center">
        {attivo ? (
          <p className="text-lg">Il negozio sta arrivando su questo binario… 🚧</p>
        ) : (
          <>
            <p className="font-mono text-pietrisco text-lg">
              ⏸ Il treno del negozio è momentaneamente fermo in deposito.
            </p>
            <p className="mt-3 text-pietrisco">
              Torneremo con il Calendario Ferroviario 2027 e tanti altri gadget. Nel frattempo,
              il modo migliore per sostenerci è il tesseramento!
            </p>
            <Link href="/tesseramento" className="btn btn-blu mt-6">Tesserati ora</Link>
          </>
        )}
      </section>
    </>
  );
}
