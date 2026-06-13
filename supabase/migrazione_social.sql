-- ============================================
-- FerroViaLibera — Post Instagram (pagina Social)
-- Incolla nel SQL Editor ed esegui (Run)
-- ============================================
create table if not exists social_post (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  url text not null,
  ordine int not null default 0
);

alter table social_post enable row level security;

create policy "social pubblici in lettura" on social_post
  for select using (true);

create index if not exists idx_social_ordine on social_post(ordine, created_at desc);
