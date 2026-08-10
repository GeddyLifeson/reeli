-- Reeli: add the dislikes table (a private "not for me" toggle next to likes
-- on feed items — unlike likes, no count is ever shown or computable by
-- anyone but the person who dislikes something, by design). Paste into
-- SQL Editor -> Run. Safe to run once on an existing project.

create table if not exists public.dislikes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  ranking_user uuid not null,
  ranking_movie text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, ranking_user, ranking_movie),
  foreign key (ranking_user, ranking_movie)
    references public.rankings(user_id, movie_id) on delete cascade
);
alter table public.dislikes enable row level security;

drop policy if exists "dislikes readable by the person who made them" on public.dislikes;
create policy "dislikes readable by the person who made them"
  on public.dislikes for select using ((select auth.uid()) = user_id);

drop policy if exists "users dislike as themselves" on public.dislikes;
create policy "users dislike as themselves"
  on public.dislikes for insert with check ((select auth.uid()) = user_id);

drop policy if exists "users un-dislike as themselves" on public.dislikes;
create policy "users un-dislike as themselves"
  on public.dislikes for delete using ((select auth.uid()) = user_id);
