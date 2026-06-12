export const metadata = { title: "Statuto | FerroViaLibera" };

export default function Statuto() {
  return (
    <>
      <section className="cartello">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl">Lo Statuto</h1>
          <p className="normal-case tracking-normal font-body font-normal text-white/85 mt-2">
            Il nostro orgoglio: lo abbiamo scritto insieme, per avere basi salde e durature.
          </p>
        </div>
        <div className="filetto" aria-hidden="true" />
      </section>

      <section className="max-w-3xl mx-auto px-4 py-14">
        <h2 className="font-display font-black text-2xl text-accento mb-6">I nostri obiettivi</h2>
        <div className="space-y-5 text-lg leading-relaxed">
          <p>
            L&apos;Associazione si propone di promuovere e tutelare i diritti e l&apos;uguaglianza delle
            persone LGBTQ+ che lavorano nell&apos;ambito ferroviario.
          </p>
          <p>
            FerroViaLibera si impegna a promuovere la consapevolezza, la sensibilizzazione e
            l&apos;eliminazione di discriminazioni e disparità di trattamento basate sull&apos;orientamento
            sessuale, sull&apos;identità di genere e sulle differenze di genere nel settore ferroviario.
          </p>
          <p>
            FerroViaLibera si propone di sostenere la formazione, l&apos;informazione e lo sviluppo di
            programmi volti a garantire pari opportunità, sicurezza, inclusione e benessere delle
            persone LGBTQ+ che lavorano in ambito ferroviario.
          </p>
          <p>
            L&apos;associazione promuoverà iniziative volte a contrastare ogni forma di omobitransfobia,
            sessismo, molestia sessuale e violenza di genere.
          </p>
          <p>
            FerroViaLibera si propone di collaborare con le imprese ferroviarie, i gestori
            dell&apos;infrastruttura, altre associazioni, organizzazioni, istituzioni e soggetti
            interessati a promuovere la parità di genere e i diritti delle persone LGBTQ+ nel
            settore ferroviario.
          </p>
        </div>
        <a
          href="https://drive.google.com/file/d/13dvct4-ras7JbAPMvhBorygRE9CGW1PE/view?usp=sharing"
          className="btn btn-accento mt-8"
        >
          Leggi lo Statuto completo (PDF)
        </a>
      </section>
    </>
  );
}
