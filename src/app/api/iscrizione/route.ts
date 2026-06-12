import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { notificaAdmin } from "@/lib/notifiche";

export async function POST(req: Request) {
  const b = await req.json();
  if (b.sito_web) return NextResponse.json({ ok: true });
  if (!b.evento_id || !b.nome || !b.email) {
    return NextResponse.json({ error: "Compila tutti i campi obbligatori" }, { status: 400 });
  }
  const sb = supabaseAdmin();
  const { data: evento } = await sb
    .from("eventi")
    .select("registrazione_aperta, pubblicato")
    .eq("id", b.evento_id)
    .single();
  if (!evento?.pubblicato || !evento?.registrazione_aperta) {
    return NextResponse.json({ error: "Iscrizioni chiuse per questo evento" }, { status: 400 });
  }
  const { error } = await sb.from("iscrizioni_eventi").insert({
    evento_id: b.evento_id,
    nome: String(b.nome).trim(),
    email: String(b.email).trim().toLowerCase(),
    telefono: b.telefono || null,
    note: b.note || null,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await notificaAdmin(
    `Nuova iscrizione evento: ${b.nome}`,
    `${b.nome} (${b.email}) si è iscrittə a un evento.\nDettagli su ferrovialibera.it/admin.`
  );
  return NextResponse.json({ ok: true });
}
