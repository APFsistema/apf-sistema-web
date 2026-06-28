create extension if not exists "pgcrypto";

create table if not exists public.competitions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  branch text not null default 'Masculino',
  type text not null default 'Torneo',
  category text,
  status text not null default 'Inscripción abierta',
  start_date date,
  venue text,
  inscription text,
  prize text,
  format text default 'Zonas + Playoffs',
  playoffs text default 'Sin playoffs',
  description text,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.pairs (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid references public.competitions(id) on delete cascade,
  pair_name text not null,
  player1 text not null,
  player2 text not null,
  phone text,
  status text not null default 'Confirmada',
  created_at timestamptz not null default now()
);

alter table public.competitions enable row level security;
alter table public.pairs enable row level security;

drop policy if exists "read competitions" on public.competitions;
drop policy if exists "insert competitions" on public.competitions;
drop policy if exists "update competitions" on public.competitions;
drop policy if exists "delete competitions" on public.competitions;
create policy "read competitions" on public.competitions for select using (true);
create policy "insert competitions" on public.competitions for insert with check (true);
create policy "update competitions" on public.competitions for update using (true);
create policy "delete competitions" on public.competitions for delete using (true);

drop policy if exists "read pairs" on public.pairs;
drop policy if exists "insert pairs" on public.pairs;
drop policy if exists "update pairs" on public.pairs;
drop policy if exists "delete pairs" on public.pairs;
create policy "read pairs" on public.pairs for select using (true);
create policy "insert pairs" on public.pairs for insert with check (true);
create policy "update pairs" on public.pairs for update using (true);
create policy "delete pairs" on public.pairs for delete using (true);
