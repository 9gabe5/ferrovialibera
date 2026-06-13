-- ============================================
-- FerroViaLibera — Rassegna stampa (pagina Press)
-- Incolla nel SQL Editor ed esegui (Run)
-- ============================================
create table if not exists press (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tipo text not null default 'articolo' check (tipo in ('articolo','intervista')),
  titolo text not null,
  testata text,
  autore text,
  data_pubblicazione date,
  url text,
  estratto text,
  immagine_url text,
  corpo text,            -- usato per le interviste pubblicate sul sito
  pubblicato boolean not null default true,
  ordine int not null default 0
);

alter table press enable row level security;

create policy "press pubblici in lettura" on press
  for select using (pubblicato = true);

create index if not exists idx_press_ordine on press(ordine, data_pubblicazione desc);

-- Articolo Gay.it già pronto
insert into press (tipo, titolo, testata, autore, data_pubblicazione, url, estratto, immagine_url) values
('articolo',
 'Quello che non racconti non cambia mai',
 'Gay.it',
 'Francesca Di Feo',
 '2025-05-01',
 'https://www.gay.it/intervista-ferrovialibera-1-maggio',
 'Dove i binari non sono solo quelli del treno: un''associazione di ferrovierə rainbow offre uno spazio di supporto, aggregazione e rappresentanza a chi, ancora oggi, deve nascondere una parte di sé sul posto di lavoro.',
 'https://www.gay.it/wp-content/uploads/2025/04/intervista-ferrovialibera-1-maggio-1200x675.jpg');
