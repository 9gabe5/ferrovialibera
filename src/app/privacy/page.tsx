export const metadata = { title: "Privacy Policy | FerroViaLibera" };

export default function Privacy() {
  return (
    <>
      <section className="cartello">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl">Privacy Policy</h1>
        </div>
        <div className="filetto" aria-hidden="true" />
      </section>
      <section className="max-w-3xl mx-auto px-4 py-14 space-y-5 leading-relaxed">
        <p className="text-pietrisco text-sm">Ultimo aggiornamento: giugno 2026</p>

        <h2 className="font-display font-bold text-xl text-accento">Titolare del trattamento</h2>
        <p>Titolare è <strong>FerroViaLibera APS</strong>. Per qualsiasi richiesta relativa ai tuoi dati puoi scrivere a <a href="mailto:info@ferrovialibera.it" className="text-accento underline">info@ferrovialibera.it</a>.</p>

        <h2 className="font-display font-bold text-xl text-accento">Quali dati raccogliamo</h2>
        <p>Raccogliamo solo i dati che ci fornisci volontariamente compilando i moduli del sito:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li><strong>Tesseramento e rinnovo:</strong> nome, cognome, email, telefono, codice fiscale, data di nascita, indirizzo e modalità di pagamento dichiarata.</li>
          <li><strong>Iscrizione agli eventi:</strong> nome, email, telefono ed eventuali note.</li>
          <li><strong>Modulo contatti:</strong> nome, email e il testo del messaggio.</li>
        </ul>

        <h2 className="font-display font-bold text-xl text-accento">Perché li trattiamo</h2>
        <p>Per gestire l&apos;adesione associativa e gli adempimenti connessi, per organizzare e gestire gli eventi, e per risponderti. La base giuridica è l&apos;esecuzione del rapporto associativo e il consenso che presti inviando i moduli.</p>

        <h2 className="font-display font-bold text-xl text-accento">Dove sono conservati</h2>
        <p>I dati sono conservati su <strong>Supabase</strong> (database) e il sito è ospitato da <strong>Vercel</strong>, fornitori che agiscono come responsabili del trattamento. Non vendiamo né cediamo i tuoi dati a terzi per finalità commerciali.</p>

        <h2 className="font-display font-bold text-xl text-accento">Per quanto tempo</h2>
        <p>Conserviamo i dati dei soci per il tempo necessario alla gestione associativa e agli obblighi di legge. Puoi chiederne la cancellazione in qualsiasi momento.</p>

        <h2 className="font-display font-bold text-xl text-accento">I tuoi diritti</h2>
        <p>Hai diritto di accedere ai tuoi dati, correggerli, chiederne la cancellazione o la limitazione, e opporti al trattamento (artt. 15-22 GDPR). Per esercitarli scrivi a <a href="mailto:info@ferrovialibera.it" className="text-accento underline">info@ferrovialibera.it</a>.</p>

        <h2 className="font-display font-bold text-xl text-accento">Cookie</h2>
        <p>Per i dettagli sui cookie consulta la <a href="/cookie" className="text-accento underline">Cookie Policy</a>.</p>
      </section>
    </>
  );
}
