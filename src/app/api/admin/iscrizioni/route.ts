import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/adminAuth";

export async function GET(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const eventoId = searchParams.get("evento_id");
  let q = supabaseAdmin().from("iscrizioni_eventi").select("*").order("created_at", { ascending: false });
  if (eventoId) q = q.eq("evento_id", eventoId);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
