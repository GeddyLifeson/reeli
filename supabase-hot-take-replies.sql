-- Reeli: add the hot_take_replies table — debate threads under a hot take.
-- A "hot take" is just the `note` on someone else's ranking row, never its
-- own table, so a reply ties to that (ranking_user, ranking_movie) pair,
-- exactly like likes/dislikes already do. Paste into SQL Editor -> Run. Safe
-- to run once on an existing project.

create table if not exists public.hot_take_replies (
  id bigint generated always as identity primary key,
  ranking_user uuid not null,
  ranking_movie text not null,
  author uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 280),
  created_at timestamptz not null default now(),
  foreign key (ranking_user, ranking_movie)
    references public.rankings(user_id, movie_id) on delete cascade
);
alter table public.hot_take_replies enable row level security;

drop policy if exists "hot take replies readable by everyone" on public.hot_take_replies;
create policy "hot take replies readable by everyone"
  on public.hot_take_replies for select using (true);

drop policy if exists "users reply as themselves" on public.hot_take_replies;
create policy "users reply as themselves"
  on public.hot_take_replies for insert with check ((select auth.uid()) = author);

drop policy if exists "users delete their own replies" on public.hot_take_replies;
create policy "users delete their own replies"
  on public.hot_take_replies for delete using ((select auth.uid()) = author);

create index if not exists hot_take_replies_take_idx
  on public.hot_take_replies (ranking_movie, ranking_user, created_at);
