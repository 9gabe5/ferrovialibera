import FormTesseramento from "@/components/FormTesseramento";

export const metadata = { title: "Rinnovo Tessera 2026 | FerroViaLibera" };

export default function Rinnovo() {
  return (
    <>
      <section className="cartello">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl">Rinnovo Tessera 2026</h1>
          <p className="normal-case tracking-normal font-body font-normal text-white/85 mt-2">
            Bentornatə a bordo! Rinnova la tua tessera per il 2026.
          </p>
        </div>
        <div className="filetto" aria-hidden="true" />
      </section>
      <section className="max-w-3xl mx-auto px-4 py-14">
        <FormTesseramento tipo="rinnovo" />
      </section>
    </>
  );
}
