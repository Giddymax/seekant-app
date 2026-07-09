-- Social links CRUD update for existing Seekant Multimedia Supabase projects.
-- Adds an id-based primary key, a label column, and a sort order so social
-- links can be added/edited/deleted as rows (not just the fixed 7 platforms).
-- Safe to run more than once in the Supabase SQL Editor.

alter table public.social_links add column if not exists id uuid default uuid_generate_v4();
alter table public.social_links add column if not exists label text;
alter table public.social_links add column if not exists sort_order integer not null default 0;

update public.social_links set id = uuid_generate_v4() where id is null;
alter table public.social_links alter column id set not null;

alter table public.social_links drop constraint if exists social_links_pkey;
alter table public.social_links add constraint social_links_pkey primary key (id);

alter table public.social_links drop constraint if exists social_links_platform_key;
alter table public.social_links add constraint social_links_platform_key unique (platform);
