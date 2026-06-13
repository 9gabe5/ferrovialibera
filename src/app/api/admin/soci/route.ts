import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/adminAuth";

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { data, error } = await supabaseAdmin()
    .from("soci")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

const CAMPI_MODIFICABILI = ["nome","cognome","email","telefono","codice_fiscale","data_nascita","indirizzo","citta","cap","anno","tipo","metodo_pagamento","stato","note"];

export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const b = await req.json();
  if (!b.nome || !b.cognome) {
    return NextResponse.json({ error: "Nome e cognome sono obbligatori" }, { status: 400 });
  }
  const nuovo: Record<string, unknown> = { stato: b.stato || "approvato", anno: Number(b.anno) || new Date().getFullYear() };
  for (const c of CAMPI_MODIFICABILI) {
    if (b[c] !== undefined && b[c] !== "" && c !== "anno") nuovo[c] = b[c];
  }
  if (!nuovo.email) {
    const slug = `${b.nome}.${b.cognome}`.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "");
    nuovo.email = `${slug}@soci.ferrovialibera.it`;
  }
  const { error } = await supabaseAdmin().from("soci").insert(nuovo);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id, ...resto } = await req.json();
  const upd: Record<string, unknown> = {};
  for (const c of CAMPI_MODIFICABILI) {
    if (resto[c] !== undefined) upd[c] = resto[c] === "" ? null : resto[c];
  }
  if (upd.anno) upd.anno = Number(upd.anno);
  const { error } = await supabaseAdmin().from("soci").update(upd).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await req.json();
  const { error } = await supabaseAdmin().from("soci").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
