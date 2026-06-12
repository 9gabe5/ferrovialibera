# 🏳️‍🌈🚂 FerroViaLibera.it

Sito istituzionale di **FerroViaLibera APS** — Associazione di Ferrovierə LGBTQ+.
Costruito in casa, senza piattaforme terze.

## Stack
Next.js 14 · Supabase · Tailwind CSS · Vercel

## Funzionalità
- Tesseramento e rinnovo con verifica pagamento (PayPal / bonifico)
- Eventi in stile tabellone partenze, con iscrizione online
- Pannello admin (`/admin`): soci, eventi, iscrizioni, messaggi, export CSV
- Negozio predisposto ma disattivato (flag `negozio_attivo` in `impostazioni`)

## Setup
1. Esegui `supabase/schema.sql` nel SQL Editor di Supabase
2. Su Vercel imposta le variabili di `.env.example`
3. Deploy automatico a ogni push su `main`

⚠️ Le chiavi NON vanno mai committate: questo repo è pubblico.
