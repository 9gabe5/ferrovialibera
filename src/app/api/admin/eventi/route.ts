import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/adminAuth";

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { data, error } = await supabaseAdmin()
    .from("eventi")
    .select("*, iscrizioni_eventi(count)")
    .order("data_inizio", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const b = await req.json();
  if (!b.titolo || !b.data_inizio) {
    return NextResponse.json({ error: "Titolo e data sono obbligatori" }, { status: 400 });
  }
  const { error } = await supabaseAdmin().from("eventi").insert({
    titolo: b.titolo,
    descrizione: b.descrizione || null,
    data_inizio: b.data_inizio,
    data_fine: b.data_fine || null,
    luogo: b.luogo || null,
    binario: b.binario || null,
    immagine_url: b.immagine_url || null,
    link_esterno: b.link_esterno || null,
    registrazione_aperta: b.registrazione_aperta ?? true,
    pubblicato: b.pubblicato ?? true,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id, ...campi } = await req.json();
  const { error } = await supabaseAdmin().from("eventi").update(campi).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await req.json();
  const { error } = await supabaseAdmin().from("eventi").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
