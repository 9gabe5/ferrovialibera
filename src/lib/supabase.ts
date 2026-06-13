import { createClient } from "@supabase/supabase-js";

function env(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Variabile ambiente mancante: ${name}`);
  return value;
}

// Client pubblico (sola lettura: eventi pubblicati, impostazioni)
export const supabasePublic = createClient(
  env("NEXT_PUBLIC_SUPABASE_URL"),
  env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
);

// Client admin (solo lato server, nelle route API)
export function supabaseAdmin() {
  return createClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } },
  );
}
