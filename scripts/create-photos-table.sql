-- Run this in Supabase SQL Editor to create the photos table + storage bucket

-- 1. Photos metadata table (shared across all teams)
create table if not exists photos (
  id bigint generated always as identity primary key,
  url text not null,
  caption text,
  team_name text,
  uploaded_by text,
  created_at timestamptz default now()
);

-- 2. Enable RLS but allow all (public app, no auth)
alter table photos enable row level security;
create policy "photos_read" on photos for select using (true);
create policy "photos_insert" on photos for insert with check (true);
create policy "photos_delete" on photos for delete using (true);

-- 3. Storage bucket for photos
insert into storage.buckets (id, name, public) values ('photos', 'photos', true)
on conflict (id) do nothing;

-- 4. Storage policies (public read + anon upload)
create policy "photos_bucket_read" on storage.objects for select using (bucket_id = 'photos');
create policy "photos_bucket_insert" on storage.objects for insert with check (bucket_id = 'photos');
