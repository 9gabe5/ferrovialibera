export const metadata = { title: "Su di noi | FerroViaLibera" };

// Quando hai i file, basta incollare qui l'URL (o il percorso /immagini/...)
const LOGO_NUOVO: string | null = "/immagini/logo-fvl.png";

const direttivo: { nome: string; ruolo: string; foto: string | null }[] = [
  { nome: "Gabriele Roscini", ruolo: "Presidente e Fondatore", foto: "/immagini/gabriele.jpg" },
  { nome: "Andrea Ruggiero", ruolo: "Vice Presidente", foto: "/immagini/andrea.jpg" },
  { nome: "Mohammad Lamloum", ruolo: "Tesoriere", foto: "/immagini/mohammad.jpg" },
];

function BoxFoto({ alt }: { alt: string }) {
  return (
    <div className="w-full aspect-[4/3] bg-latte border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-pietrisco">
      <span className="text-3xl" aria-hidden="true">📷</span>
      <span className="text-sm mt-1">Foto in arrivo</span>
      <span className="sr-only">{alt}</span>
    </div>
  );
}

export default function SuDiNoi() {
  return (
    <>
      <section className="cartello">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl">Su di noi</h1>
        </div>
        <div className="filetto" aria-hidden="true" />
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14 grid gap-10 md:grid-cols-2 items-center">
        <div className="flex items-center justify-center bg-latte border-2 border-accento p-8 aspect-[4/3]">
          {LOGO_NUOVO ? (
            <img src={LOGO_NUOVO} alt="Logo FerroViaLibera" className="max-h-full max-w-full object-contain" />
          ) : (
            <div className="text-center text-pietrisco">
              <span className="block font-marchio font-extrabold text-2xl text-accento">FerroViaLibera</span>
              <span className="text-sm">Nuovo logo in arrivo</span>
            </div>
          )}
        </div>
        <div>
          <h2 className="font-display font-black text-3xl text-accento mb-4">La nostra storia</h2>
          <p className="text-lg leading-relaxed">
            Nel giugno del 2023, durante il Pride Month, FerroViaLibera è nata con l&apos;obiettivo di
            promuovere l&apos;uguaglianza e i diritti LGBTQ+ nel settore ferroviario. Attraverso incontri,
            campagne di sensibilizzazione e collaborazioni con aziende del settore, l&apos;associazione
            lavora instancabilmente per garantire un ambiente di lavoro libero da discriminazioni e
            pienamente inclusivo.
          </p>
        </div>
      </section>

      <section className="bg-white border-y border-gray-200 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display font-black text-3xl text-accento mb-8">Il Direttivo</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {direttivo.map((m) => (
              <div key={m.nome} className="border border-gray-200 bg-latte">
                {m.foto ? (
                  <img src={m.foto} alt={m.nome} className="w-full aspect-[4/3] object-cover" />
                ) : (
                  <BoxFoto alt={m.nome} />
                )}
                <div className="p-4">
                  <p className="font-display font-bold text-lg">{m.nome}</p>
                  <p className="text-pietrisco text-sm">{m.ruolo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
