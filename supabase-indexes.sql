-- Reeli: indexes for the query patterns the app actually issues.
-- Paste into a FRESH Supabase SQL Editor tab (New query) -> Run.
-- Safe to run more than once; safe to run on an existing database.
--
-- Nothing here changes data or policies — it only adds indexes.
--
-- Already covered elsewhere, deliberately NOT repeated here:
--   rankings(user_id, ...)   -> leading column of primary key (user_id, movie_id)
--   watchlist(user_id, ...)  -> leading column of primary key (user_id, movie_id)
--   follows(follower, ...)   -> leading column of primary key (follower, followee)
--   likes(user_id, ...)      -> leading column of PK (user_id, ranking_user, ranking_movie)
--   rankings(user_id, updated_at desc) -> rankings_feed_idx in supabase-schema.sql
--   profiles(lower(handle)), profiles(lower(display_name)) -> supabase-schema.sql
--
-- Postgres can only use a composite index when the *leading* column is
-- constrained, so the queries below currently fall back to sequential scans.

-- ============ 1. Community scores on a movie ============
-- loadCommunityScores(): /rankings?movie_id=eq.<id>&limit=200
-- movie_id is the SECOND column of the rankings primary key, so this query
-- scans every ranking row in the table. This is the most impactful index here —
-- it runs every time anyone opens a movie detail sheet.
create index if not exists rankings_movie_id_idx
  on public.rankings (movie_id);

-- ============ 2. "Who added me as a Reelmate" ============
-- refreshNotifs(): /follows?followee=eq.<me>
-- followee is the second column of the follows primary key.
create index if not exists follows_followee_idx
  on public.follows (followee, created_at desc);

-- ============ 3. "Who liked my rankings" + the feed's likes(count) embed ============
-- refreshNotifs(): /likes?ranking_user=eq.<me>&user_id=neq.<me>
-- refreshCloudFeed(): likes(count) joins on (ranking_user, ranking_movie)
-- The (ranking_user, ranking_movie) foreign key has NO index of its own, which
-- also makes deleting a ranking slower than it needs to be (the FK cascade has
-- to scan likes).
create index if not exists likes_ranking_idx
  on public.likes (ranking_user, ranking_movie);

-- ============ 4. Ordered reads within one user (optional but cheap) ============
-- pullCloud(): /rankings?user_id=eq.<me>&order=bucket,position
--              /watchlist?user_id=eq.<me>&order=added_at.desc
-- The primary keys already narrow these to one user, so these only avoid a
-- small in-memory sort. Include them if pulls feel slow with a large list.
create index if not exists rankings_user_order_idx
  on public.rankings (user_id, bucket, position);
create index if not exists watchlist_user_added_idx
  on public.watchlist (user_id, added_at desc);

-- ============ 5. "New on Reeli" suggestions (optional) ============
-- renderFeed(): /profiles?order=created_at.desc&limit=8
create index if not exists profiles_created_at_idx
  on public.profiles (created_at desc);
