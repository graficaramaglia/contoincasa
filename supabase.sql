-- ContoInCasa: crea le tabelle nel database Supabase.
-- Incolla tutto questo testo in Supabase → SQL Editor → New query, poi premi "Run".

create table if not exists public.fisse (
  id text primary key,
  casa text not null check (casa in ('napoli','colla')),   -- 'colla' = Casa Colle
  nome text not null,
  categoria text,
  importo numeric not null default 0,
  giorno int not null check (giorno between 1 and 31),
  ricorrenza text not null default 'mensile',
  "meseInizio" int not null default 1,
  esempio boolean default false,
  creato_il timestamptz default now()
);

create table if not exists public.movimenti (
  id text primary key,
  casa text not null check (casa in ('napoli','colla')),
  data date not null,
  categoria text,
  descrizione text,
  importo numeric not null default 0,
  esempio boolean default false,
  creato_il timestamptz default now()
);

create table if not exists public.pagamenti (
  id text primary key,
  "fissaId" text not null references public.fisse(id) on delete cascade,
  mese text not null,
  importo numeric,
  "pagataIl" date
);

-- Sicurezza: solo chi ha fatto l'accesso (tu e tua moglie) può leggere e scrivere
alter table public.fisse     enable row level security;
alter table public.movimenti enable row level security;
alter table public.pagamenti enable row level security;

create policy "solo famiglia" on public.fisse     for all to authenticated using (true) with check (true);
create policy "solo famiglia" on public.movimenti for all to authenticated using (true) with check (true);
create policy "solo famiglia" on public.pagamenti for all to authenticated using (true) with check (true);

-- Aggiornamento in tempo reale tra i due telefoni
alter publication supabase_realtime add table public.fisse, public.movimenti, public.pagamenti;
