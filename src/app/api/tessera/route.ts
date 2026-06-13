import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createHash } from "crypto";

export const dynamic = "force-dynamic";

// Numero tessera deterministico dall'email
function numeroTessera(email: string, anno: number) {
  const h = createHash("sha256").update(email).digest("hex");
  const n = (parseInt(h.slice(0, 6), 16) % 9000) + 1000;
  return `FVL · ${anno} · ${n}`;
}

export async function POST(req: Request) {
  const b = await req.json();
  const email = String(b.email || "").trim().toLowerCase();
  const dob = String(b.data_nascita || "").trim();
  if (!email || !dob) {
    return NextResponse.json({ error: "Inserisci email e data di nascita" }, { status: 400 });
  }
  const annoCorrente = new Date().getFullYear();
  const { data, error } = await supabaseAdmin()
    .from("soci")
    .select("nome, cognome, citta, anno, stato, data_nascita, note, created_at")
    .eq("email", email);
  if (error) return NextResponse.json({ error: "Errore di ricerca" }, { status: 500 });

  const approvati = (data ?? []).filter((r) => r.stato === "approvato");
  const dobOk = approvati.some((r) => r.data_nascita === dob);
  const inRegola = approvati.some((r) => r.anno === annoCorrente);

  if (approvati.length === 0 || !dobOk) {
    return NextResponse.json({ error: "non_trovato" }, { status: 404 });
  }
  if (!inRegola) {
    return NextResponse.json({ error: "non_in_regola", anno: annoCorrente }, { status: 403 });
  }

  // dati per la tessera
  const recente = [...approvati].sort((a, b) => b.anno - a.anno)[0];
  const anniApprovati = approvati.map((r) => r.anno);
  const socioDal = Math.min(...anniApprovati);
  const citta = approvati.map((r) => r.citta).filter(Boolean)[0] || "";

  return NextResponse.json({
    nome: recente.nome,
    cognome: recente.cognome,
    citta,
    socio_dal: socioDal,
    anno: annoCorrente,
    numero: numeroTessera(email, annoCorrente),
  });
}
