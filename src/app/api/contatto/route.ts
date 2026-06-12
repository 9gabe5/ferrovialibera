import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { notificaAdmin } from "@/lib/notifiche";

export async function POST(req: Request) {
  const b = await req.json();
  if (b.sito_web) return NextResponse.json({ ok: true });
  if (!b.email || !b.messaggio) {
    return NextResponse.json({ error: "Email e messaggio sono obbligatori" }, { status: 400 });
  }
  const { error } = await supabaseAdmin().from("messaggi").insert({
    nome: b.nome || null,
    email: String(b.email).trim().toLowerCase(),
    messaggio: String(b.messaggio).slice(0, 5000),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await notificaAdmin(
    `Nuovo messaggio da ${b.nome || b.email}`,
    `Da: ${b.nome || "—"} (${b.email})\n\n${String(b.messaggio).slice(0, 1000)}`
  );
  return NextResponse.json({ ok: true });
}
