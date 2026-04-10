-- Run this in Supabase SQL Editor to create the photo_reactions table

create table if not exists photo_reactions (
  id bigint generated always as identity primary key,
  photo_id bigint references photos(id) on delete cascade not null,
  emoji text not null,
  team_name text not null,
  created_at timestamptz default now()
);

-- Unique constraint: one reaction per emoji per team per photo
create unique index photo_reactions_unique on photo_reactions (photo_id, emoji, team_name);

-- Enable RLS but allow all (public app, no auth)
alter table photo_reactions enable row level security;
create policy "photo_reactions_read" on photo_reactions for select using (true);
create policy "photo_reactions_insert" on photo_reactions for insert with check (true);
create policy "photo_reactions_delete" on photo_reactions for delete using (true);
