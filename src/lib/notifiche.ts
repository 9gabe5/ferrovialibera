// Notifica email all'admin via Resend (https://resend.com)
// Se RESEND_API_KEY o NOTIFICA_EMAIL mancano, non fa nulla e non blocca mai la richiesta.
export async function notificaAdmin(oggetto: string, testo: string) {
  const key = process.env.RESEND_API_KEY;
  const a = process.env.NOTIFICA_EMAIL;
  if (!key || !a) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFICA_FROM || "FerroViaLibera <onboarding@resend.dev>",
        to: [a],
        subject: `🚂 ${oggetto}`,
        text: testo + "\n\n— Notifica automatica dal sito ferrovialibera.it",
      }),
    });
  } catch {
    // mai bloccare l'operazione principale per una notifica
  }
}
