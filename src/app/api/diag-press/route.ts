import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const anon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
  const service = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const out: Record<string, unknown> = {};

  // 1) lettura come la fa il sito pubblico (anon, solo pubblicati)
  try {
    const pub = createClient(url, anon);
    const { data, error } = await pub.from("press").select("id,titolo,pubblicato").eq("pubblicato", true);
    out.lettura_pubblica = error ? `ERRORE: ${error.message}` : `${data?.length ?? 0} righe visibili al sito`;
  } catch (e: any) { out.lettura_pubblica = `ECCEZIONE: ${e?.message}`; }

  // 2) conteggio totale come admin (bypassa RLS)
  try {
    const adm = createClient(url, service, { auth: { persistSession: false } });
    const { data, error } = await adm.from("press").select("id,titolo,pubblicato,tipo");
    out.totale_nel_db = error ? `ERRORE: ${error.message}` : (data?.length ?? 0);
    out.righe = error ? null : data;
  } catch (e: any) { out.totale_nel_db = `ECCEZIONE: ${e?.message}`; }

  return NextResponse.json(out);
}
