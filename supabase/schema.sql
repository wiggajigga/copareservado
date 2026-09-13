-- Copa Reservado – stemmetabell
-- Lim inn i Supabase → SQL Editor → Run. Kjøres én gang.

create table if not exists public.stemmer (
  id         uuid primary key default gen_random_uuid(),
  aar        int  not null,
  velger     text not null,                       -- stabil id fra nettleseren
  navn       text not null,
  dag        int  not null check (dag between 1 and 3),
  bane       text,
  oppdatert  timestamptz not null default now(),
  unique (aar, velger, dag)
);

alter table public.stemmer enable row level security;

-- Alle kan lese og stemme. Ingen kan slette: det finnes med vilje ingen delete-policy,
-- så en stemme kan endres av den som avga den, men aldri fjernes av andre.
drop policy if exists stemmer_les      on public.stemmer;
drop policy if exists stemmer_skriv    on public.stemmer;
drop policy if exists stemmer_oppdater on public.stemmer;

create policy stemmer_les      on public.stemmer for select using (true);
create policy stemmer_skriv    on public.stemmer for insert with check (aar >= 2026);
create policy stemmer_oppdater on public.stemmer for update using (true) with check (true);

-- Historikk: når banene er bestemt, arkiveres stemmene inn i data/<år>.js
-- og tabellen kan stå urørt til neste år.
