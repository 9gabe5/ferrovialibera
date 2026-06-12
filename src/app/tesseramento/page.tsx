import FormTesseramento from "@/components/FormTesseramento";

export const metadata = { title: "Tesseramento 2026 | FerroViaLibera", description: "Iscriviti anche tu a FerroViaLibera!" };

export default function Tesseramento() {
  return (
    <>
      <section className="cartello">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl">Tesseramento 2026</h1>
          <p className="normal-case tracking-normal font-body font-normal text-blue-100 mt-2">
            Cambiare il mondo in un luogo migliore inizia da noi stessi.
          </p>
        </div>
        <div className="filetto" aria-hidden="true" />
      </section>
      <section className="max-w-3xl mx-auto px-4 py-14">
        <FormTesseramento tipo="nuovo" />
      </section>
    </>
  );
}
