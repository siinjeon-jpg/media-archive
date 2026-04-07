create extension if not exists pgcrypto;

do $$
begin
  create type public.media_category as enum ('manga', 'anime', 'movie', 'drama', 'novel');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.entry_status as enum ('planned', 'watching', 'completed', 'dropped');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.media_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  slug text not null,
  category public.media_category not null,
  status public.entry_status not null default 'planned',
  rating smallint check (rating between 1 and 10),
  review text not null default '',
  memo text not null default '',
  tags text[] not null default '{}'::text[],
  country text not null default '',
  consumed_on date,
  is_wishlist boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint media_entries_user_slug_key unique (user_id, slug)
);

create index if not exists media_entries_user_consumed_idx
  on public.media_entries (user_id, consumed_on desc nulls last);

create index if not exists media_entries_user_category_idx
  on public.media_entries (user_id, category);

create index if not exists media_entries_user_status_idx
  on public.media_entries (user_id, status);

create index if not exists media_entries_user_wishlist_idx
  on public.media_entries (user_id, is_wishlist);

create index if not exists media_entries_tags_idx
  on public.media_entries using gin (tags);

create or replace function public.set_media_entries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_media_entries_updated_at on public.media_entries;

create trigger set_media_entries_updated_at
before update on public.media_entries
for each row
execute procedure public.set_media_entries_updated_at();

alter table public.media_entries enable row level security;

drop policy if exists "Users can view their own entries" on public.media_entries;
create policy "Users can view their own entries"
on public.media_entries
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own entries" on public.media_entries;
create policy "Users can insert their own entries"
on public.media_entries
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own entries" on public.media_entries;
create policy "Users can update their own entries"
on public.media_entries
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own entries" on public.media_entries;
create policy "Users can delete their own entries"
on public.media_entries
for delete
using (auth.uid() = user_id);
