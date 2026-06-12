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
