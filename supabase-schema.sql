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
  on public.profiles for insert with check (auth.uid() = id);
create policy "users update own profile"
  on public.profiles for update using (auth.uid() = id);

-- case-insensitive people search by handle or name
create index profiles_handle_idx on public.profiles (lower(handle));
create index profiles_name_idx on public.profiles (lower(display_name));

-- ============ rankings: one row per (user, movie) ============
create table public.rankings (
  user_id uuid not null references public.profiles(id) on delete cascade,
  movie_id text not null,             -- IMDb id (tt...) or library/custom id
  title text not null,
  year int, genre text, director text, poster text,
  bucket text not null check (bucket in ('loved','fine','disliked')),
  position int not null,              -- order within the bucket
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
  on public.rankings for insert with check (auth.uid() = user_id);
create policy "users update own rankings"
  on public.rankings for update using (auth.uid() = user_id);
create policy "users delete own rankings"
  on public.rankings for delete using (auth.uid() = user_id);

create index rankings_feed_idx on public.rankings (user_id, updated_at desc);

-- ============ watchlist: private to each user ============
create table public.watchlist (
  user_id uuid not null references public.profiles(id) on delete cascade,
  movie_id text not null,
  title text not null,
  year int, genre text, director text, poster text,
  added_at timestamptz not null default now(),
  primary key (user_id, movie_id)
);
alter table public.watchlist enable row level security;
create policy "watchlist readable by owner"
  on public.watchlist for select using (auth.uid() = user_id);
create policy "users insert own watchlist"
  on public.watchlist for insert with check (auth.uid() = user_id);
create policy "users delete own watchlist"
  on public.watchlist for delete using (auth.uid() = user_id);

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
  on public.follows for insert with check (auth.uid() = follower);
create policy "users unfollow as themselves"
  on public.follows for delete using (auth.uid() = follower);

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
  on public.likes for insert with check (auth.uid() = user_id);
create policy "users unlike as themselves"
  on public.likes for delete using (auth.uid() = user_id);
