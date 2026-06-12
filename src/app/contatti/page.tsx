import FormContatto from "@/components/FormContatto";

export const metadata = { title: "Contatti | FerroViaLibera" };

export default function Contatti() {
  return (
    <>
      <section className="cartello">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl">Contattaci</h1>
        </div>
        <div className="filetto" aria-hidden="true" />
      </section>
      <section className="max-w-3xl mx-auto px-4 py-14 space-y-8">
        <FormContatto />
        <div className="border-t border-gray-200 pt-6 text-pietrisco">
          <p>
            Puoi anche scriverci direttamente a{" "}
            <a href="mailto:info@ferrovialibera.it" className="underline text-blu">info@ferrovialibera.it</a>{" "}
            o entrare nel nostro{" "}
            <a href="https://chat.whatsapp.com/FV2NFHRpmF38fSZi4ffXGi" className="underline text-blu">gruppo WhatsApp</a>.
          </p>
        </div>
      </section>
    </>
  );
}
