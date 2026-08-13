-- Lets hero slides use a video instead of (or with) a static image.
-- Safe to run more than once.

alter table public.hero_slides add column if not exists media_type text not null default 'image';
alter table public.hero_slides drop constraint if exists hero_slides_media_type_check;
alter table public.hero_slides add constraint hero_slides_media_type_check
  check (media_type in ('image', 'video'));

alter table public.hero_slides add column if not exists video_url text;

-- New storage bucket for uploaded slide videos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('hero-videos', 'hero-videos', true, 52428800, array['video/mp4','video/webm','video/quicktime'])
on conflict (id) do nothing;

drop policy if exists "Auth users upload hero videos" on storage.objects;
create policy "Auth users upload hero videos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'hero-videos');

drop policy if exists "Public read hero videos" on storage.objects;
create policy "Public read hero videos"
  on storage.objects for select
  using (bucket_id = 'hero-videos');

drop policy if exists "Auth users delete hero videos" on storage.objects;
create policy "Auth users delete hero videos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'hero-videos');
