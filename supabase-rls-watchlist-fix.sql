-- ============================================================================
-- Reeli: URGENT FIX — the watchlist stops syncing after the first save.
-- Paste into a FRESH Supabase SQL Editor tab (New query) -> Run.
-- Safe to run more than once. Changes policies only; touches no data.
-- ============================================================================
--
-- THE BUG
-- -------
-- public.watchlist has SELECT, INSERT and DELETE policies (supabase-schema.sql)
-- but no UPDATE policy. The app pushes the watchlist with a PostgREST upsert:
--
--   POST /rest/v1/watchlist?on_conflict=user_id,movie_id
--   Prefer: resolution=merge-duplicates
--
-- which Postgres executes as INSERT ... ON CONFLICT DO UPDATE. Under row-level
-- security that statement needs BOTH an INSERT policy *and* an UPDATE policy —
-- the UPDATE half is checked even when no conflicting row exists.
--
-- So: the very first watchlist push for a (user, movie) succeeds, and every
-- push after it fails with
--
--   ERROR 42501: new row violates row-level security policy for table "watchlist"
--
-- PostgREST returns that as HTTP 403 with no exception thrown, so before the
-- guard added in this release the app swallowed it entirely: the watchlist
-- looked fine locally and silently stopped syncing to the cloud.
--
-- public.rankings already has "users update own rankings", which is why
-- rankings sync correctly and only the watchlist is affected.
--
-- THE FIX
-- -------
-- Add the missing UPDATE policy, scoped exactly like the other watchlist
-- policies: a user may only touch their own rows.
--
-- USING     -> which existing rows this user is allowed to update
-- WITH CHECK -> what those rows are allowed to look like afterwards
--
-- Both are required: without WITH CHECK, a user could update one of their own
-- rows and reassign user_id to somebody else.
--
-- (select auth.uid()) rather than auth.uid() matches supabase-fixes.sql — the
-- subselect is evaluated once per query instead of once per row.

drop policy if exists "users update own watchlist" on public.watchlist;
create policy "users update own watchlist"
  on public.watchlist for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ============================================================================
-- VERIFY
-- ============================================================================
-- Run this afterwards. You should get exactly four rows for public.watchlist:
-- SELECT, INSERT, UPDATE and DELETE. If UPDATE is missing, the statement above
-- did not run.

select
  cmd,
  policyname,
  qual        as using_expression,
  with_check  as with_check_expression
from pg_policies
where schemaname = 'public'
  and tablename  = 'watchlist'
order by
  case cmd
    when 'SELECT' then 1
    when 'INSERT' then 2
    when 'UPDATE' then 3
    when 'DELETE' then 4
    else 5
  end;

-- Expected:
--   SELECT | watchlist readable by owner  | (select auth.uid()) = user_id |
--   INSERT | users insert own watchlist   |                               | (select auth.uid()) = user_id
--   UPDATE | users update own watchlist   | (select auth.uid()) = user_id | (select auth.uid()) = user_id
--   DELETE | users delete own watchlist   | (select auth.uid()) = user_id |
--
-- Then, in the app: sign in, add a movie to your watchlist, remove it, add
-- another. With the policy in place nothing appears in the console and no
-- "Watchlist isn't syncing" toast fires. Without it, both do — the app now
-- reports this failure instead of hiding it (see pushWatchlist in app.js).
