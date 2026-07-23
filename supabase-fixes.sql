-- Reeli: fixes for the Supabase database linter warnings.
-- Paste into SQL Editor -> Run. Safe to run once on the existing project.

-- ============ 1. Lock down rls_auto_enable() ============
-- This function is NOT part of Reeli's schema (it was likely added by a
-- dashboard assistant). It should not be callable through the public API.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- ============ 2. RLS performance: evaluate auth.uid() once per query ============
-- Same security, better plans: (select auth.uid()) is computed once instead
-- of per-row. Recreates every policy the linter flagged.

drop policy "users insert own profile" on public.profiles;
create policy "users insert own profile"
  on public.profiles for insert with check ((select auth.uid()) = id);
drop policy "users update own profile" on public.profiles;
create policy "users update own profile"
  on public.profiles for update using ((select auth.uid()) = id);

drop policy "users insert own rankings" on public.rankings;
create policy "users insert own rankings"
  on public.rankings for insert with check ((select auth.uid()) = user_id);
drop policy "users update own rankings" on public.rankings;
create policy "users update own rankings"
  on public.rankings for update using ((select auth.uid()) = user_id);
drop policy "users delete own rankings" on public.rankings;
create policy "users delete own rankings"
  on public.rankings for delete using ((select auth.uid()) = user_id);

drop policy "watchlist readable by owner" on public.watchlist;
create policy "watchlist readable by owner"
  on public.watchlist for select using ((select auth.uid()) = user_id);
drop policy "users insert own watchlist" on public.watchlist;
create policy "users insert own watchlist"
  on public.watchlist for insert with check ((select auth.uid()) = user_id);
drop policy "users delete own watchlist" on public.watchlist;
create policy "users delete own watchlist"
  on public.watchlist for delete using ((select auth.uid()) = user_id);

drop policy "users follow as themselves" on public.follows;
create policy "users follow as themselves"
  on public.follows for insert with check ((select auth.uid()) = follower);
drop policy "users unfollow as themselves" on public.follows;
create policy "users unfollow as themselves"
  on public.follows for delete using ((select auth.uid()) = follower);

drop policy "users like as themselves" on public.likes;
create policy "users like as themselves"
  on public.likes for insert with check ((select auth.uid()) = user_id);
drop policy "users unlike as themselves" on public.likes;
create policy "users unlike as themselves"
  on public.likes for delete using ((select auth.uid()) = user_id);
