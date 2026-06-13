import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Riga = { nome: string; cognome: string; citta: string | null; email: string; anno: number; stato: string; data_nascita: string | null; note: string | null; created_at: string };

function chiave(r: Riga) {
  return (r.email || `${r.nome}-${r.cognome}`).toLowerCase().trim();
}
// data di prima iscrizione di una riga: usa "pagato YYYY-MM-DD" nelle note, altrimenti l'anno
function quando(r: Riga): string {
  const m = (r.note || "").match(/pagato (\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  return `${r.anno}-01-01`;
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
    .select("nome, cognome, citta, email, anno, stato, data_nascita, note, created_at");
  if (error) return NextResponse.json({ error: "Errore di ricerca" }, { status: 500 });

  const righe = (data ?? []) as Riga[];
  const approvate = righe.filter((r) => r.stato === "approvato");

  // Raggruppo per persona, calcolo la data di PRIMA iscrizione di ciascuna
  const persone = new Map<string, { primaIscr: string; tiebreak: string }>();
  for (const r of approvate) {
    const k = chiave(r);
    const q = quando(r);
    const cur = persone.get(k);
    if (!cur || q < cur.primaIscr) {
      persone.set(k, { primaIscr: q, tiebreak: `${r.cognome} ${r.nome}`.toLowerCase() });
    }
  }
  // Ordino per data di prima iscrizione (poi cognome), assegno il progressivo
  const ordinate = Array.from(persone.entries())
    .sort((a, b) => a[1].primaIscr.localeCompare(b[1].primaIscr) || a[1].tiebreak.localeCompare(b[1].tiebreak));
  const progressivo = new Map<string, number>();
  ordinate.forEach(([k], i) => progressivo.set(k, i + 1));

  // Verifico il richiedente
  const mie = approvate.filter((r) => r.email === email);
  const dobOk = mie.some((r) => r.data_nascita === dob);
  const inRegola = mie.some((r) => r.anno === annoCorrente);

  if (mie.length === 0 || !dobOk) {
    return NextResponse.json({ error: "non_trovato" }, { status: 404 });
  }
  if (!inRegola) {
    return NextResponse.json({ error: "non_in_regola", anno: annoCorrente }, { status: 403 });
  }

  const recente = [...mie].sort((a, b) => b.anno - a.anno)[0];
  const socioDal = Math.min(...mie.map((r) => r.anno));
  const citta = mie.map((r) => r.citta).filter(Boolean)[0] || "";
  const numero = progressivo.get(email) ?? 0;

  return NextResponse.json({
    nome: recente.nome,
    cognome: recente.cognome,
    citta,
    socio_dal: socioDal,
    anno: annoCorrente,
    numero: `N° ${String(numero).padStart(3, "0")}`,
  });
}
