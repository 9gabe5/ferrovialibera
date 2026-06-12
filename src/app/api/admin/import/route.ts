import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/adminAuth";

// Import massivo di soci da CSV (anni passati): righe già parse-ate dal client
export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { righe } = await req.json();
  if (!Array.isArray(righe) || righe.length === 0) {
    return NextResponse.json({ error: "Nessuna riga da importare" }, { status: 400 });
  }
  if (righe.length > 2000) {
    return NextResponse.json({ error: "Massimo 2000 righe per volta" }, { status: 400 });
  }
  const pulite = righe
    .filter((r: any) => r.nome && r.cognome && r.anno)
    .map((r: any) => ({
      tipo: Number(r.anno) <= 2023 ? "nuovo" : (r.tipo === "nuovo" ? "nuovo" : "rinnovo"),
      anno: Number(r.anno),
      nome: String(r.nome).trim(),
      cognome: String(r.cognome).trim(),
      email: r.email
        ? String(r.email).trim().toLowerCase()
        : `${String(r.nome + "." + r.cognome).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "")}@soci.ferrovialibera.it`,
      telefono: r.telefono || null,
      codice_fiscale: r.codice_fiscale ? String(r.codice_fiscale).trim().toUpperCase() : null,
      data_nascita: r.data_nascita || null,
      citta: r.citta || null,
      indirizzo: r.indirizzo || null,
      metodo_pagamento: r.metodo_pagamento === "bonifico" ? "bonifico" : r.metodo_pagamento === "paypal" ? "paypal" : null,
      stato: "approvato",
      note: r.note || "import storico",
    }));
  const { error, count } = await supabaseAdmin()
    .from("soci")
    .insert(pulite, { count: "exact" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, importate: count ?? pulite.length });
}
