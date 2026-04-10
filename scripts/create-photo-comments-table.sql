-- Run this in Supabase SQL Editor to create the photo_comments table

create table if not exists photo_comments (
  id bigint generated always as identity primary key,
  photo_id bigint references photos(id) on delete cascade not null,
  content text not null,
  team_name text not null,
  created_at timestamptz default now()
);

-- Enable RLS but allow all (public app, no auth)
alter table photo_comments enable row level security;
create policy "photo_comments_read" on photo_comments for select using (true);
create policy "photo_comments_insert" on photo_comments for insert with check (true);
