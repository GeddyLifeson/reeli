-- Reeli database schema (Supabase / Postgres)
-- Paste this whole file into: Supabase dashboard -> SQL Editor -> Run.
-- Safe to run once on a fresh project.

-- ============ profiles: one row per signed-up user ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null check (handle ~ '^[a-z0-9_]{3,20}$'),
  display_name text not null check (char_length(display_name) between 1 and 40),
  avatar_hue int not null default 172,
  taste jsonb,                        -- {"genres":[...], "dirs":[...]} for suggestions
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles readable by everyone"
  on public.profiles for select using (true);
create policy "users insert own profile"
  on public.profiles for insert with check ((select auth.uid()) = id);
create policy "users update own profile"
  on public.profiles for update using ((select auth.uid()) = id);

-- case-insensitive people search by handle or name
create index profiles_handle_idx on public.profiles (lower(handle));
create index profiles_name_idx on public.profiles (lower(display_name));

-- ============ rankings: one row per (user, movie) ============
create table public.rankings (
  user_id uuid not null references public.profiles(id) on delete cascade,
  movie_id text not null,             -- IMDb id (tt...), AniList id (al:...), or library/custom id
  title text not null,
  year int, genre text, director text, poster text,
  media_type text not null default 'movie' check (media_type in ('movie','show','anime')),
  bucket text not null check (bucket in ('loved','fine','disliked')),
  position int not null,              -- order within the bucket (and media_type)
  score numeric(3,1) not null,
  note text check (char_length(note) <= 280),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, movie_id)
);
alter table public.rankings enable row level security;
create policy "rankings readable by everyone"
  on public.rankings for select using (true);
create policy "users insert own rankings"
  on public.rankings for insert with check ((select auth.uid()) = user_id);
create policy "users update own rankings"
  on public.rankings for update using ((select auth.uid()) = user_id);
create policy "users delete own rankings"
  on public.rankings for delete using ((select auth.uid()) = user_id);

create index rankings_feed_idx on public.rankings (user_id, updated_at desc);
-- profile sheet pulls "top 10 movies / top 10 shows / top 10 anime" as three
-- separate queries (user_id + media_type, ordered by score)
create index rankings_type_idx on public.rankings (user_id, media_type, score desc);

-- ============ watchlist: private to each user ============
create table public.watchlist (
  user_id uuid not null references public.profiles(id) on delete cascade,
  movie_id text not null,
  title text not null,
  year int, genre text, director text, poster text,
  media_type text not null default 'movie' check (media_type in ('movie','show','anime')),
  added_at timestamptz not null default now(),
  primary key (user_id, movie_id)
);
alter table public.watchlist enable row level security;
create policy "watchlist readable by owner"
  on public.watchlist for select using ((select auth.uid()) = user_id);
create policy "users insert own watchlist"
  on public.watchlist for insert with check ((select auth.uid()) = user_id);
create policy "users delete own watchlist"
  on public.watchlist for delete using ((select auth.uid()) = user_id);

-- ============ follows: reelmates ============
create table public.follows (
  follower uuid not null references public.profiles(id) on delete cascade,
  followee uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower, followee),
  check (follower <> followee)
);
alter table public.follows enable row level security;
create policy "follows readable by everyone"
  on public.follows for select using (true);
create policy "users follow as themselves"
  on public.follows for insert with check ((select auth.uid()) = follower);
create policy "users unfollow as themselves"
  on public.follows for delete using ((select auth.uid()) = follower);

-- ============ likes on feed items ============
create table public.likes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  ranking_user uuid not null,
  ranking_movie text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, ranking_user, ranking_movie),
  foreign key (ranking_user, ranking_movie)
    references public.rankings(user_id, movie_id) on delete cascade
);
alter table public.likes enable row level security;
create policy "likes readable by everyone"
  on public.likes for select using (true);
create policy "users like as themselves"
  on public.likes for insert with check ((select auth.uid()) = user_id);
create policy "users unlike as themselves"
  on public.likes for delete using ((select auth.uid()) = user_id);

-- ============ dislikes: a private "not for me" toggle, not a second public
-- tally — unlike likes, only the person who dislikes something can see that
-- they did, so no count is ever shown or computable by anyone else ============
create table public.dislikes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  ranking_user uuid not null,
  ranking_movie text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, ranking_user, ranking_movie),
  foreign key (ranking_user, ranking_movie)
    references public.rankings(user_id, movie_id) on delete cascade
);
alter table public.dislikes enable row level security;
create policy "dislikes readable by the person who made them"
  on public.dislikes for select using ((select auth.uid()) = user_id);
create policy "users dislike as themselves"
  on public.dislikes for insert with check ((select auth.uid()) = user_id);
create policy "users un-dislike as themselves"
  on public.dislikes for delete using ((select auth.uid()) = user_id);

-- ============ rewatches: an append-only log, one row per watch ============
-- never touches the ranking/score — just a fun tally of how many times
-- you've watched something you already ranked
create table public.rewatches (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  movie_id text not null,
  watched_at timestamptz not null default now(),
  foreign key (user_id, movie_id) references public.rankings(user_id, movie_id) on delete cascade
);
alter table public.rewatches enable row level security;
create policy "rewatches readable by everyone"
  on public.rewatches for select using (true);
create policy "users log their own rewatches"
  on public.rewatches for insert with check ((select auth.uid()) = user_id);
create policy "users delete their own rewatch entries"
  on public.rewatches for delete using ((select auth.uid()) = user_id);

-- ============ watch_parties: a shared watchlist between two Reelmates ============
-- Deliberately separate from public.watchlist above (which is private, owner-only
-- readable, and never touched by this feature) — a watch party is a second,
-- distinct concept: one row per (owner, partner) pair, readable by BOTH of
-- them. Storing one row per undirected pair (rather than two rows, one per
-- direction) keeps the RLS policy a single boolean check — "am I the owner or
-- the partner?" — instead of needing a matching mirror row kept in sync on
-- every insert/delete. Starting a party is enough to prove intent; there is no
-- separate accept flow, so `owner` is just whoever clicked first.
create table public.watch_parties (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references public.profiles(id) on delete cascade,
  partner uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(owner, partner),
  check (owner <> partner)
);
alter table public.watch_parties enable row level security;
create policy "watch parties readable by owner or partner"
  on public.watch_parties for select using ((select auth.uid()) in (owner, partner));
create policy "users start a watch party as the owner"
  on public.watch_parties for insert with check ((select auth.uid()) = owner);
create policy "only the owner deletes their watch party"
  on public.watch_parties for delete using ((select auth.uid()) = owner);

-- reverse lookup: "is there already a party where I'm the partner?" (the
-- primary key already covers "where I'm the owner")
create index watch_parties_partner_idx on public.watch_parties (partner);

-- ============ watch_party_items: one row per title added to a watch party ============
create table public.watch_party_items (
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
-- every policy below joins back through party_id to watch_parties to ask the
-- same question watch_parties' own policy asks: is the caller the owner or
-- the partner of the party this item belongs to?
create policy "watch party items readable by either party"
  on public.watch_party_items for select using (
    exists (select 1 from public.watch_parties wp
      where wp.id = party_id and (select auth.uid()) in (wp.owner, wp.partner)));
create policy "either party adds items"
  on public.watch_party_items for insert with check (
    (select auth.uid()) = added_by
    and exists (select 1 from public.watch_parties wp
      where wp.id = party_id and (select auth.uid()) in (wp.owner, wp.partner)));
create policy "either party removes items"
  on public.watch_party_items for delete using (
    exists (select 1 from public.watch_parties wp
      where wp.id = party_id and (select auth.uid()) in (wp.owner, wp.partner)));

create index watch_party_items_party_idx on public.watch_party_items (party_id);
