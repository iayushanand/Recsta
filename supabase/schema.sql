-- Recsta Supabase schema - run this in Dashboard > SQL Editor
-- Enables storing user data: genres, profile, status, friends, top movies, prefs

-- 1. Enable uuid generation
create extension if not exists "pgcrypto";

-- 2. Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  status_text text default 'Hi, I am using Recsta!',
  favorite_decade text default '2010s',
  favorite_runtime text default '90–120 min',
  preferred_language text default 'English',
  favorite_director text default 'Christopher Nolan',
  languages text[] default array['English','Hindi','Japanese'],
  horror_enabled boolean default true,
  anime_enabled boolean default true,
  musicals_enabled boolean default false,
  friends_count int default 0,
  saved_count int default 0,
  watched_count int default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-create profile on new auth user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict (id) do update set
    email = excluded.email,
    display_name = coalesce(excluded.display_name, public.profiles.display_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. User genres (many-to-many, mirrors constants/genres.ts)
create table if not exists public.user_genres (
  user_id uuid not null references public.profiles(id) on delete cascade,
  genre_id text not null,
  created_at timestamp with time zone default now(),
  primary key (user_id, genre_id),
  check (genre_id in ('action','animation','comedy','documentary','drama','fantasy','horror','musical','romance','scifi','thriller','western'))
);

-- 4. Top movies per user
create table if not exists public.user_top_movies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  genre_image_id text, -- e.g. 'scifi' maps to assets/images/genre/scifi.jpg
  position int not null default 0,
  created_at timestamp with time zone default now(),
  unique(user_id, position)
);

-- 5. Friendships (only between app users)
create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  friend_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'accepted' check (status in ('pending','accepted','blocked')),
  created_at timestamp with time zone default now(),
  unique(user_id, friend_id),
  check (user_id != friend_id)
);

-- Indexes
create index if not exists user_genres_user_id_idx on public.user_genres(user_id);
create index if not exists user_top_movies_user_id_idx on public.user_top_movies(user_id);
create index if not exists friendships_user_id_idx on public.friendships(user_id);
create index if not exists friendships_friend_id_idx on public.friendships(friend_id);

-- 6. Enable RLS
alter table public.profiles enable row level security;
alter table public.user_genres enable row level security;
alter table public.user_top_movies enable row level security;
alter table public.friendships enable row level security;

-- 7. Policies: authenticated users can read all profiles, but only update own
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- user_genres policies
drop policy if exists "Users can manage own genres" on public.user_genres;
create policy "Users can manage own genres"
  on public.user_genres for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Anyone can read genres" on public.user_genres;
create policy "Anyone can read genres"
  on public.user_genres for select
  using (true);

-- user_top_movies policies
drop policy if exists "Anyone can read top movies" on public.user_top_movies;
create policy "Anyone can read top movies"
  on public.user_top_movies for select using (true);

drop policy if exists "Users manage own top movies" on public.user_top_movies;
create policy "Users manage own top movies"
  on public.user_top_movies for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- friendships policies
drop policy if exists "Users can read friendships" on public.friendships;
create policy "Users can read friendships"
  on public.friendships for select
  using (auth.uid() = user_id or auth.uid() = friend_id);

drop policy if exists "Users can manage friendships" on public.friendships;
create policy "Users can manage friendships"
  on public.friendships for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 8. Seed helper: ensure existing auth users get profiles (run once)
-- insert into public.profiles (id, email) select id, email from auth.users on conflict do nothing;

-- 9. Update default status for new users and migrate existing defaults (run after initial schema)
alter table public.profiles alter column status_text set default 'Hi, I am using Recsta!';
update public.profiles set status_text = 'Hi, I am using Recsta!' where status_text = 'Cinema is therapy.';
