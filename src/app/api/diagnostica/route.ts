import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Diagnostica configurazione: non rivela mai le chiavi, solo presenza/forma.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  const report: Record<string, unknown> = {
    url_presente: !!url,
    url_valore: url, // l'URL del progetto non è un segreto
    url_ha_spazi_o_acapo: /\s/.test(url),
    url_inizia_con_https: url.startsWith("https://"),
    anon_presente: !!anon,
    anon_lunghezza: anon.length,
    anon_ha_spazi_o_acapo: /\s/.test(anon),
    service_presente: !!service,
    service_lunghezza: service.length,
    service_ha_spazi_o_acapo: /\s/.test(service),
    admin_password_presente: !!process.env.ADMIN_PASSWORD,
    resend_presente: !!process.env.RESEND_API_KEY,
    notifica_email_presente: !!process.env.NOTIFICA_EMAIL,
  };

  try {
    const sb = createClient(url.trim(), service.trim(), { auth: { persistSession: false } });
    const { data, error } = await sb.from("impostazioni").select("chiave").limit(1);
    report.test_connessione = error ? `ERRORE: ${error.message}` : `OK (${data?.length ?? 0} righe lette)`;
  } catch (e: any) {
    report.test_connessione = `ECCEZIONE: ${e?.message} ${e?.cause?.message ? "— causa: " + e.cause.message : ""}`;
  }

  return NextResponse.json(report);
}
