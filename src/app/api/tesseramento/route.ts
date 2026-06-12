import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const b = await req.json();
  if (b.sito_web) return NextResponse.json({ ok: true }); // honeypot
  if (!b.nome || !b.cognome || !b.email || !b.metodo_pagamento) {
    return NextResponse.json({ error: "Compila tutti i campi obbligatori" }, { status: 400 });
  }
  const { error } = await supabaseAdmin().from("soci").insert({
    tipo: b.tipo === "rinnovo" ? "rinnovo" : "nuovo",
    anno: 2026,
    nome: String(b.nome).trim(),
    cognome: String(b.cognome).trim(),
    email: String(b.email).trim().toLowerCase(),
    telefono: b.telefono || null,
    codice_fiscale: b.codice_fiscale ? String(b.codice_fiscale).trim().toUpperCase() : null,
    data_nascita: b.data_nascita || null,
    indirizzo: b.indirizzo || null,
    citta: b.citta || null,
    cap: b.cap || null,
    metodo_pagamento: b.metodo_pagamento,
  });
  if (error) return NextResponse.json({ error: "Salvataggio non riuscito" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
