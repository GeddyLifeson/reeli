-- "Where to watch" cache for the where-to-watch Edge Function. Run once in the
-- Supabase SQL editor.
--
-- One row per IMDb id + country holding the trimmed Streaming Availability
-- answer (an empty array means "checked, nowhere"). The function refetches a
-- row once it is older than 7 days, which keeps Reeli well inside the API's
-- free 1,000 requests a month.
--
-- RLS is on with no policies at all: the anon key can neither read nor write
-- this table. Only the Edge Function touches it, with the service-role key.

create table if not exists public.watch_providers (
  imdb_id     text not null check (imdb_id ~ '^tt[0-9]{1,10}$'),
  country     text not null default 'us' check (country ~ '^[a-z]{2}$'),
  options     jsonb not null default '[]'::jsonb,
  fetched_at  timestamptz not null default now(),
  primary key (imdb_id, country)
);

alter table public.watch_providers enable row level security;

-- Handy checks (SQL editor):
--   select count(*), max(fetched_at) from public.watch_providers;
--   select imdb_id, jsonb_array_length(options) from public.watch_providers order by fetched_at desc limit 20;
