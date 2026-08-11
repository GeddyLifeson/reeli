-- Reeli: add the rewatches table — an append-only log, one row per watch,
-- that never touches a ranking/score, just tallies how many times someone's
-- watched something they already ranked. Paste into SQL Editor -> Run. Safe
-- to run once on an existing project.

create table if not exists public.rewatches (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  movie_id text not null,
  watched_at timestamptz not null default now(),
  foreign key (user_id, movie_id) references public.rankings(user_id, movie_id) on delete cascade
);
alter table public.rewatches enable row level security;

drop policy if exists "rewatches readable by everyone" on public.rewatches;
create policy "rewatches readable by everyone"
  on public.rewatches for select using (true);

drop policy if exists "users log their own rewatches" on public.rewatches;
create policy "users log their own rewatches"
  on public.rewatches for insert with check ((select auth.uid()) = user_id);

drop policy if exists "users delete their own rewatch entries" on public.rewatches;
create policy "users delete their own rewatch entries"
  on public.rewatches for delete using ((select auth.uid()) = user_id);
