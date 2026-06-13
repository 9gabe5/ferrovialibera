import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/adminAuth";

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { data, error } = await supabaseAdmin().from("social_post").select("*").order("ordine").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { url, ordine } = await req.json();
  if (!url || !/instagram\.com/.test(url)) {
    return NextResponse.json({ error: "Inserisci un link a un post Instagram" }, { status: 400 });
  }
  const pulito = String(url).split("?")[0].replace(/\/$/, "") + "/";
  const { error } = await supabaseAdmin().from("social_post").insert({ url: pulito, ordine: Number(ordine) || 0 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await req.json();
  const { error } = await supabaseAdmin().from("social_post").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
