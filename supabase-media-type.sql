-- Reeli: split rankings into three independent pools — movies, TV shows and
-- anime — instead of one combined list. Paste into SQL Editor -> Run. Safe to
-- run once on an existing project; every existing row is assumed to be a
-- movie (the only kind Reeli tracked before this).

alter table public.rankings
  add column if not exists media_type text not null default 'movie'
    check (media_type in ('movie','show','anime'));

alter table public.watchlist
  add column if not exists media_type text not null default 'movie'
    check (media_type in ('movie','show','anime'));

-- the profile sheet pulls "top 10 movies / top 10 shows / top 10 anime" as
-- three separate queries (user_id + media_type, ordered by score)
create index if not exists rankings_type_idx on public.rankings (user_id, media_type, score desc);
