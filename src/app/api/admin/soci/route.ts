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

export async function PATCH(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id, stato, note } = await req.json();
  const upd: Record<string, unknown> = {};
  if (stato) upd.stato = stato;
  if (note !== undefined) upd.note = note;
  const { error } = await supabaseAdmin().from("soci").update(upd).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
