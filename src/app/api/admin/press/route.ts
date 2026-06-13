import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/adminAuth";

const CAMPI = ["tipo","titolo","testata","autore","data_pubblicazione","url","estratto","immagine_url","corpo","pubblicato","ordine"];

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { data, error } = await supabaseAdmin().from("press").select("*").order("ordine").order("data_pubblicazione", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const b = await req.json();
  if (!b.titolo) return NextResponse.json({ error: "Il titolo è obbligatorio" }, { status: 400 });
  const nuovo: Record<string, unknown> = { pubblicato: true };
  for (const c of CAMPI) if (b[c] !== undefined && b[c] !== "") nuovo[c] = b[c];
  const { error } = await supabaseAdmin().from("press").insert(nuovo);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id, ...resto } = await req.json();
  const upd: Record<string, unknown> = {};
  for (const c of CAMPI) if (resto[c] !== undefined) upd[c] = resto[c] === "" ? null : resto[c];
  const { error } = await supabaseAdmin().from("press").update(upd).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await req.json();
  const { error } = await supabaseAdmin().from("press").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
