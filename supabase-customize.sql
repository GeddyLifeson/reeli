-- Reeli: profile photos + synced appearance settings.
-- Paste into a FRESH Supabase SQL Editor tab (New query) -> Run.
-- Safe to run more than once.

-- new profile columns
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists ui jsonb;

-- public avatars bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- storage policies: anyone can view; users manage only their own file,
-- which is named {their-user-id}.jpg
drop policy if exists "avatar images publicly readable" on storage.objects;
create policy "avatar images publicly readable"
  on storage.objects for select using (bucket_id = 'avatars');

drop policy if exists "users upload own avatar" on storage.objects;
create policy "users upload own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (select auth.uid())::text = split_part(name, '.', 1));

drop policy if exists "users replace own avatar" on storage.objects;
create policy "users replace own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and (select auth.uid())::text = split_part(name, '.', 1));

drop policy if exists "users delete own avatar" on storage.objects;
create policy "users delete own avatar"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (select auth.uid())::text = split_part(name, '.', 1));
