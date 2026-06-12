export const metadata = { title: "Su di noi | FerroViaLibera" };

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
        <img
          src="https://static.wixstatic.com/media/a7f111_d321721518174939b6fdbd07540b2c80~mv2.jpg"
          alt="FerroViaLibera al Pride"
          className="w-full object-cover border-4 border-blu"
        />
        <div>
          <h2 className="font-display font-black text-3xl text-blu mb-4">La nostra storia</h2>
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
          <h2 className="font-display font-black text-3xl text-blu mb-8">Il Direttivo</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border border-gray-200 bg-latte">
              <img
                src="https://static.wixstatic.com/media/a7f111_091d5a0dbb814ca2bb94a742f84cb3af~mv2.jpeg"
                alt="Gabriele Roscini"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="p-4">
                <p className="font-display font-bold text-lg">Gabriele Roscini</p>
                <p className="text-pietrisco text-sm">Fondatore e Presidente</p>
              </div>
            </div>
            {/* Aggiungi qui le altre persone del Direttivo */}
          </div>
        </div>
      </section>
    </>
  );
}
