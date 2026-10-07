-- Newsletter signups. Run once in the Supabase SQL editor.
--
-- Anyone (signed in or not) may INSERT an address, and nobody may read the
-- table through the public anon key: there is deliberately no SELECT policy,
-- so the list is only visible from the dashboard or the service-role key.
-- The client inserts with `Prefer: return=minimal` for that reason; asking
-- PostgREST to return the row would need SELECT and fail with 401.

create table if not exists public.newsletter_subscribers (
  id          bigint generated always as identity primary key,
  email       text not null check (length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  user_id     uuid references auth.users(id) on delete set null,
  source      text not null default 'profile' check (length(source) <= 40),
  created_at  timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- one row per address regardless of case; a repeat signup is a 409, not a dupe
create unique index if not exists newsletter_subscribers_email_key
  on public.newsletter_subscribers (lower(email));

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "anyone can subscribe" on public.newsletter_subscribers;
create policy "anyone can subscribe" on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (unsubscribed_at is null and (user_id is null or user_id = auth.uid()));

-- Export for the sending service (run in the SQL editor, then download CSV):
--   select email from public.newsletter_subscribers where unsubscribed_at is null order by created_at;
