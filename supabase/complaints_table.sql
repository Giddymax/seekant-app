-- Run this in your Supabase SQL editor to create the complaints table

create table if not exists public.complaints (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  status     text not null default 'New',
  created_at timestamptz not null default now()
);

-- Allow anyone to insert (public complaint form)
alter table public.complaints enable row level security;

create policy "Anyone can submit a complaint"
  on public.complaints for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read complaints"
  on public.complaints for select
  to authenticated
  using (true);

create policy "Admins can update complaint status"
  on public.complaints for update
  to authenticated
  using (true);

create policy "Admins can delete complaints"
  on public.complaints for delete
  to authenticated
  using (true);
