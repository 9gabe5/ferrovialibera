-- ============================================
-- FerroViaLibera — Schema Supabase
-- Incolla tutto nel SQL Editor ed esegui (Run)
-- ============================================

-- SOCI: richieste di tesseramento e rinnovo
create table if not exists soci (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tipo text not null default 'nuovo' check (tipo in ('nuovo','rinnovo')),
  anno int not null default 2026,
  nome text not null,
  cognome text not null,
  email text not null,
  telefono text,
  codice_fiscale text,
  data_nascita date,
  indirizzo text,
  citta text,
  cap text,
  paese text default 'Italia',
  metodo_pagamento text check (metodo_pagamento in ('paypal','bonifico')),
  stato text not null default 'in_attesa' check (stato in ('in_attesa','approvato','respinto')),
  note text
);

-- EVENTI
create table if not exists eventi (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  titolo text not null,
  descrizione text,
  data_inizio timestamptz not null,
  data_fine timestamptz,
  luogo text,
  binario text,            -- tocco da tabellone: "Binario 1 Est", "Google Meet"...
  immagine_url text,
  link_esterno text,
  registrazione_aperta boolean not null default true,
  pubblicato boolean not null default true
);

-- ISCRIZIONI agli eventi
create table if not exists iscrizioni_eventi (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  evento_id uuid not null references eventi(id) on delete cascade,
  nome text not null,
  email text not null,
  telefono text,
  note text
);

-- MESSAGGI dal form contatti
create table if not exists messaggi (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome text,
  email text not null,
  messaggio text not null,
  letto boolean not null default false
);

-- IMPOSTAZIONI (feature flag e parametri)
create table if not exists impostazioni (
  chiave text primary key,
  valore text
);

insert into impostazioni (chiave, valore) values
  ('quota_anno', '2026'),
  ('quota_importo', '20'),
  ('paypal_link', 'https://www.paypal.com/paypalme/ferrovialibera/20'),
  ('iban', 'IT50F3609201600494285350895'),
  ('iban_intestatario', 'FerroViaLibera APS'),
  ('negozio_attivo', 'false')
on conflict (chiave) do nothing;

-- ============================================
-- RLS: tutto blindato. Le scritture passano SOLO
-- dalle API del sito (service role). In lettura
-- pubblica: solo eventi pubblicati e impostazioni.
-- ============================================
alter table soci enable row level security;
alter table eventi enable row level security;
alter table iscrizioni_eventi enable row level security;
alter table messaggi enable row level security;
alter table impostazioni enable row level security;

create policy "eventi pubblici in lettura" on eventi
  for select using (pubblicato = true);

create policy "impostazioni pubbliche in lettura" on impostazioni
  for select using (true);

-- Indici utili
create index if not exists idx_soci_stato on soci(stato);
create index if not exists idx_soci_anno on soci(anno);
create index if not exists idx_eventi_data on eventi(data_inizio desc);
create index if not exists idx_iscrizioni_evento on iscrizioni_eventi(evento_id);
