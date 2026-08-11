-- Reeli: add watch_parties + watch_party_items — a shared "watch together"
-- list two Reelmates can both add to and see, separate from (and in addition
-- to) each person's own private watchlist (public.watchlist, untouched by
-- this migration). One row per (owner, partner) pair rather than two mirrored
-- rows per pair, so the RLS policies stay a single "am I the owner or the
-- partner?" check. Paste into SQL Editor -> Run. Safe to run once on an
-- existing project.

create table if not exists public.watch_parties (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references public.profiles(id) on delete cascade,
  partner uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(owner, partner),
  check (owner <> partner)
);
alter table public.watch_parties enable row level security;

drop policy if exists "watch parties readable by owner or partner" on public.watch_parties;
create policy "watch parties readable by owner or partner"
  on public.watch_parties for select using ((select auth.uid()) in (owner, partner));

drop policy if exists "users start a watch party as the owner" on public.watch_parties;
create policy "users start a watch party as the owner"
  on public.watch_parties for insert with check ((select auth.uid()) = owner);

drop policy if exists "only the owner deletes their watch party" on public.watch_parties;
create policy "only the owner deletes their watch party"
  on public.watch_parties for delete using ((select auth.uid()) = owner);

create index if not exists watch_parties_partner_idx on public.watch_parties (partner);

create table if not exists public.watch_party_items (
  id bigint generated always as identity primary key,
  party_id uuid not null references public.watch_parties(id) on delete cascade,
  movie_id text not null,
  title text not null,
  year int, genre text, director text, poster text,
  media_type text not null default 'movie' check (media_type in ('movie','show','anime')),
  added_by uuid not null references public.profiles(id),
  added_at timestamptz not null default now(),
  unique(party_id, movie_id)
);
alter table public.watch_party_items enable row level security;

drop policy if exists "watch party items readable by either party" on public.watch_party_items;
create policy "watch party items readable by either party"
  on public.watch_party_items for select using (
    exists (select 1 from public.watch_parties wp
      where wp.id = party_id and (select auth.uid()) in (wp.owner, wp.partner)));

drop policy if exists "either party adds items" on public.watch_party_items;
create policy "either party adds items"
  on public.watch_party_items for insert with check (
    (select auth.uid()) = added_by
    and exists (select 1 from public.watch_parties wp
      where wp.id = party_id and (select auth.uid()) in (wp.owner, wp.partner)));

drop policy if exists "either party removes items" on public.watch_party_items;
create policy "either party removes items"
  on public.watch_party_items for delete using (
    exists (select 1 from public.watch_parties wp
      where wp.id = party_id and (select auth.uid()) in (wp.owner, wp.partner)));

create index if not exists watch_party_items_party_idx on public.watch_party_items (party_id);
