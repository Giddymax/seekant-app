-- ============================================================
--  SEEKANT MULTIMEDIA — Complete Supabase Schema
--  Run this entire file once in the Supabase SQL Editor.
--  Order matters — do not rearrange sections.
-- ============================================================

-- ─── EXTENSIONS ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";


-- ─── SHARED TRIGGER: updated_at ──────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ════════════════════════════════════════════════════════════
--  TABLES
-- ════════════════════════════════════════════════════════════

-- ─── PROFILES ────────────────────────────────────────────────────────────────
-- One row per Supabase Auth user. Created automatically on signup.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  username    text,
  full_name   text,
  role        text not null default 'staff'
                check (role in ('admin', 'staff')),
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Auto-create a profile row whenever a new Auth user is created
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, username)
  values (
    new.id,
    new.email,
    split_part(new.email, '@', 1)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─── SERVICES ────────────────────────────────────────────────────────────────
create table if not exists public.services (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  category    text not null,
  description text,
  image_url   text,
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger services_updated_at
  before update on public.services
  for each row execute procedure public.set_updated_at();

create index if not exists idx_services_active_sort
  on public.services(active, sort_order);


-- ─── HERO SLIDES ─────────────────────────────────────────────────────────────
create table if not exists public.hero_slides (
  id          uuid primary key default uuid_generate_v4(),
  heading     text not null,
  subtext     text,
  tag         text,
  btn1_label  text,
  btn1_href   text,
  btn2_label  text,
  btn2_href   text,
  image_url   text,
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger hero_slides_updated_at
  before update on public.hero_slides
  for each row execute procedure public.set_updated_at();

create index if not exists idx_hero_slides_active_sort
  on public.hero_slides(active, sort_order);


-- ─── BLOG POSTS ──────────────────────────────────────────────────────────────
create table if not exists public.blog_posts (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  slug         text not null unique,
  category     text,
  excerpt      text,
  content      text,
  cover_url    text,
  status       text not null default 'Draft'
                 check (status in ('Draft', 'Published')),
  author_id    uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute procedure public.set_updated_at();

create index if not exists idx_blog_posts_status_published
  on public.blog_posts(status, published_at desc);
create index if not exists idx_blog_posts_slug
  on public.blog_posts(slug);


-- ─── GALLERY ITEMS ───────────────────────────────────────────────────────────
-- Powers /gallery, /works, and the home portfolio strip.
create table if not exists public.gallery_items (
  id          uuid primary key default uuid_generate_v4(),
  image_url   text not null,
  label       text,
  category    text,
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger gallery_items_updated_at
  before update on public.gallery_items
  for each row execute procedure public.set_updated_at();

create index if not exists idx_gallery_items_active_sort
  on public.gallery_items(active, sort_order);


-- ─── SITE CONTENT (key-value store) ─────────────────────────────────────────
-- Stores all editable text, FAQ, Why-Choose-Us, and theme colours.
create table if not exists public.site_content (
  key        text primary key,
  value      text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger site_content_updated_at
  before update on public.site_content
  for each row execute procedure public.set_updated_at();


-- ─── SOCIAL LINKS ────────────────────────────────────────────────────────────
create table if not exists public.social_links (
  platform   text primary key,
  url        text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger social_links_updated_at
  before update on public.social_links
  for each row execute procedure public.set_updated_at();


-- ─── PRODUCTS (public storefront) ────────────────────────────────────────────
-- The /products page reads from this table (separate from inventory).
create table if not exists public.products (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  category    text,
  price       numeric(10,2),
  image_url   text,
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger products_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

create index if not exists idx_products_active_sort
  on public.products(active, sort_order);


-- ─── INVENTORY ───────────────────────────────────────────────────────────────
-- Physical stock used by the POS terminal. Uses serial (integer) id
-- because the POS client references it as a number.
create table if not exists public.inventory (
  id         serial primary key,
  name       text not null,
  category   text not null default 'Other'
               check (category in ('Print', 'Signage', 'Apparel', 'Design', 'Gifts', 'Other')),
  image_url  text,
  price      numeric(10,2) not null default 0,
  cost_price numeric(10,2) not null default 0,
  stock      integer not null default 0,
  threshold  integer not null default 10,
  is_service boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Migration for existing installs:
-- alter table public.inventory add column if not exists image_url text;
-- alter table public.inventory add column if not exists is_service boolean not null default false;
-- alter table public.inventory add column if not exists cost_price numeric(10,2) not null default 0;

create trigger inventory_updated_at
  before update on public.inventory
  for each row execute procedure public.set_updated_at();

create index if not exists idx_inventory_low_stock
  on public.inventory(stock);


-- ─── SALES ───────────────────────────────────────────────────────────────────
create table if not exists public.sales (
  id             uuid primary key default uuid_generate_v4(),
  sale_ref       text not null unique,
  customer_name  text not null default 'Walk-in',
  customer_phone text,
  total          numeric(10,2) not null,
  discount       numeric(10,2) not null default 0,
  amount_paid    numeric(10,2) not null default 0,
  payment_method text not null
                   check (payment_method in ('Cash', 'Mobile Money', 'Bank Transfer', 'Card')),
  staff_id       uuid references public.profiles(id) on delete set null,
  notes          text,
  status         text not null default 'Completed'
                   check (status in ('Completed', 'Pending', 'Part-Payment', 'Cancelled')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Migration for existing installs (safe to run multiple times):
-- alter table public.sales add column if not exists customer_phone text;
-- alter table public.sales add column if not exists discount numeric(10,2) not null default 0;
-- alter table public.sales add column if not exists amount_paid numeric(10,2) not null default 0;
-- alter table public.sales drop constraint if exists sales_status_check;
-- alter table public.sales add constraint sales_status_check check (status in ('Completed','Pending','Part-Payment','Cancelled'));
-- update public.sales set amount_paid = total where status in ('Completed','Cancelled') and amount_paid = 0;

create trigger sales_updated_at
  before update on public.sales
  for each row execute procedure public.set_updated_at();

create index if not exists idx_sales_created_status
  on public.sales(created_at desc, status);
create index if not exists idx_sales_staff
  on public.sales(staff_id);


-- ─── SALE ITEMS ──────────────────────────────────────────────────────────────
-- Line items for each sale. Deleted automatically when the parent sale is deleted.
create table if not exists public.sale_items (
  id           uuid primary key default uuid_generate_v4(),
  sale_id      uuid not null references public.sales(id) on delete cascade,
  product_id   integer references public.inventory(id) on delete set null,
  is_service   boolean not null default false,
  product_name text not null,
  quantity     numeric(10,2) not null,
  unit_price   numeric(10,2) not null,
  cost_price   numeric(10,2) not null default 0,
  line_total   numeric(10,2) not null,
  created_at   timestamptz not null default now()
);
-- Migration for existing installs:
-- alter table public.sale_items add column if not exists product_id integer references public.inventory(id) on delete set null;
-- alter table public.sale_items add column if not exists is_service boolean not null default false;
-- alter table public.sale_items add column if not exists cost_price numeric(10,2) not null default 0;

create index if not exists idx_sale_items_sale_id
  on public.sale_items(sale_id);


-- ─── QUOTE REQUESTS ──────────────────────────────────────────────────────────
create table if not exists public.quote_requests (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  email        text not null,
  phone        text,
  service_type text not null,
  quantity     text,
  deadline     text,
  details      text not null,
  status       text not null default 'new'
                 check (status in ('new', 'reviewed', 'quoted', 'completed', 'cancelled')),
  created_at   timestamptz not null default now()
);

create index if not exists idx_quote_requests_status_created
  on public.quote_requests(status, created_at desc);


-- ════════════════════════════════════════════════════════════
--  RPC FUNCTIONS
-- ════════════════════════════════════════════════════════════

-- Safely decrements inventory stock by p_qty (floors at 0).
-- Called by the POS after each sale.
create or replace function public.decrement_inventory_stock(p_id integer, p_qty integer)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.inventory
  set stock = greatest(0, stock - p_qty)
  where id = p_id;
end;
$$;


-- ════════════════════════════════════════════════════════════
--  RLS HELPER FUNCTIONS
-- ════════════════════════════════════════════════════════════

create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and active = true
  );
$$;

create or replace function public.is_staff()
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and active = true
  );
$$;


-- ════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════

alter table public.profiles       enable row level security;
alter table public.services       enable row level security;
alter table public.hero_slides    enable row level security;
alter table public.blog_posts     enable row level security;
alter table public.gallery_items  enable row level security;
alter table public.site_content   enable row level security;
alter table public.social_links   enable row level security;
alter table public.products       enable row level security;
alter table public.inventory      enable row level security;
alter table public.sales          enable row level security;
alter table public.sale_items     enable row level security;
alter table public.quote_requests enable row level security;


-- ── profiles ─────────────────────────────────────────────────────────────────
create policy "Own profile is readable"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Admins can manage all profiles"
  on public.profiles for all
  using (public.is_admin());

create policy "Staff can update own profile"
  on public.profiles for update
  using (auth.uid() = id);


-- ── services ─────────────────────────────────────────────────────────────────
create policy "Public can read active services"
  on public.services for select
  using (active = true or public.is_staff());

create policy "Admins manage services"
  on public.services for all
  using (public.is_admin());


-- ── hero_slides ───────────────────────────────────────────────────────────────
create policy "Public can read active slides"
  on public.hero_slides for select
  using (active = true or public.is_staff());

create policy "Admins manage slides"
  on public.hero_slides for all
  using (public.is_admin());


-- ── blog_posts ────────────────────────────────────────────────────────────────
create policy "Public can read published posts"
  on public.blog_posts for select
  using (status = 'Published' or public.is_staff());

create policy "Admins manage blog posts"
  on public.blog_posts for all
  using (public.is_admin());


-- ── gallery_items ─────────────────────────────────────────────────────────────
create policy "Public can read active gallery items"
  on public.gallery_items for select
  using (active = true or public.is_staff());

create policy "Admins manage gallery"
  on public.gallery_items for all
  using (public.is_admin());


-- ── site_content ──────────────────────────────────────────────────────────────
create policy "Anyone can read site content"
  on public.site_content for select
  using (true);

create policy "Admins manage site content"
  on public.site_content for all
  using (public.is_admin());


-- ── social_links ──────────────────────────────────────────────────────────────
create policy "Anyone can read social links"
  on public.social_links for select
  using (true);

create policy "Admins manage social links"
  on public.social_links for all
  using (public.is_admin());


-- ── Explicit Data API grants for editable footer content ─────────────────────
-- RLS policies above still control which rows can be read or changed.
grant select on table public.site_content to anon;
grant select, insert, update, delete on table public.site_content to authenticated;
grant select, insert, update, delete on table public.site_content to service_role;

grant select on table public.social_links to anon;
grant select, insert, update, delete on table public.social_links to authenticated;
grant select, insert, update, delete on table public.social_links to service_role;


-- ── products ──────────────────────────────────────────────────────────────────
create policy "Public can read active products"
  on public.products for select
  using (active = true or public.is_staff());

create policy "Admins manage products"
  on public.products for all
  using (public.is_admin());


-- ── inventory ─────────────────────────────────────────────────────────────────
create policy "Staff can read inventory"
  on public.inventory for select
  using (public.is_staff());

create policy "Admins manage inventory"
  on public.inventory for all
  using (public.is_admin());


-- ── sales ─────────────────────────────────────────────────────────────────────
create policy "Staff can create sales"
  on public.sales for insert
  with check (public.is_staff() and staff_id = auth.uid());

create policy "Staff can read all sales"
  on public.sales for select
  using (public.is_staff());

create policy "Staff can update sale status"
  on public.sales for update
  using (public.is_staff());

create policy "Admins manage all sales"
  on public.sales for all
  using (public.is_admin());


-- ── sale_items ────────────────────────────────────────────────────────────────
create policy "Staff can insert sale items"
  on public.sale_items for insert
  with check (public.is_staff());

create policy "Staff can read sale items"
  on public.sale_items for select
  using (public.is_staff());


-- ── quote_requests ────────────────────────────────────────────────────────────
create policy "Anyone can submit a quote"
  on public.quote_requests for insert
  with check (true);

create policy "Staff can read quotes"
  on public.quote_requests for select
  using (public.is_staff());

create policy "Staff can update quote status"
  on public.quote_requests for update
  using (public.is_staff());

create policy "Admins manage all quotes"
  on public.quote_requests for all
  using (public.is_admin());


-- ════════════════════════════════════════════════════════════
--  STORAGE BUCKETS
-- ════════════════════════════════════════════════════════════
-- These INSERT statements create the buckets.
-- public = true means files are accessible via a public URL.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('hero-images',    'hero-images',    true,  5242880,  array['image/jpeg','image/png','image/webp','image/gif']),
  ('service-images', 'service-images', true,  5242880,  array['image/jpeg','image/png','image/webp','image/gif']),
  ('blog-covers',    'blog-covers',    true,  5242880,  array['image/jpeg','image/png','image/webp','image/gif']),
  ('gallery-images', 'gallery-images', true,  10485760, array['image/jpeg','image/png','image/webp','image/gif']),
  ('product-images', 'product-images', true,  5242880,  array['image/jpeg','image/png','image/webp','image/gif']),
  ('uploads',        'uploads',        false, 10485760, null)
on conflict (id) do nothing;

-- Storage: authenticated users can upload to image buckets
create policy "Auth users upload hero images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'hero-images');

create policy "Public read hero images"
  on storage.objects for select
  using (bucket_id = 'hero-images');

create policy "Auth users delete hero images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'hero-images');

create policy "Auth users upload service images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'service-images');

create policy "Public read service images"
  on storage.objects for select
  using (bucket_id = 'service-images');

create policy "Auth users delete service images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'service-images');

create policy "Auth users upload blog covers"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-covers');

create policy "Public read blog covers"
  on storage.objects for select
  using (bucket_id = 'blog-covers');

create policy "Auth users delete blog covers"
  on storage.objects for delete to authenticated
  using (bucket_id = 'blog-covers');

create policy "Auth users upload gallery images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery-images');

create policy "Public read gallery images"
  on storage.objects for select
  using (bucket_id = 'gallery-images');

create policy "Auth users delete gallery images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'gallery-images');

create policy "Auth users upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images');

create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Auth users delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images');

-- uploads bucket: public can insert (quote attachments); only staff can read
create policy "Anyone can upload quote attachments"
  on storage.objects for insert
  with check (bucket_id = 'uploads');

create policy "Staff can read uploads"
  on storage.objects for select to authenticated
  using (bucket_id = 'uploads');


-- ════════════════════════════════════════════════════════════
--  SEED DATA
-- ════════════════════════════════════════════════════════════

-- ── Default site content ──────────────────────────────────────────────────────
insert into public.site_content (key, value) values
  -- General
  ('about_heading',   'About Seekant Multimedia'),
  ('about_body',      'We are a full-service printing and branding company based in Accra, Ghana. From a single business card to a complete brand identity, we deliver quality across every medium with speed and care.'),
  ('footer_brand_name',     'SEEKANT MULTIMEDIA'),
  ('footer_brand_subtitle', 'Design. Print. Brand.'),
  ('footer_tagline',  'Your trusted printing and branding partner — delivering quality across every medium, from a single business card to a full brand identity.'),
  ('footer_quick_links_title', 'Quick Links'),
  ('footer_services_title',    'Our Services'),
  ('footer_contact_title',     'Contact Us'),
  ('footer_all_services_label', 'All 36 Services →'),
  ('footer_all_services_url',   '/services'),
  ('footer_copyright', '© 2026 Seekant Multimedia. All rights reserved.'),
  ('footer_privacy_label', 'Privacy Policy'),
  ('footer_privacy_url', '#'),
  ('footer_terms_label', 'Terms of Use'),
  ('footer_terms_url', '#'),
  ('footer_quote_label', 'Get a Quote'),
  ('footer_quote_url', '/quote'),
  ('footer_quick_1_label', 'Home'),
  ('footer_quick_1_url', '/'),
  ('footer_quick_2_label', 'About Us'),
  ('footer_quick_2_url', '/about'),
  ('footer_quick_3_label', 'Products'),
  ('footer_quick_3_url', '/products'),
  ('footer_quick_4_label', 'Our Works'),
  ('footer_quick_4_url', '/works'),
  ('footer_quick_5_label', 'Gallery'),
  ('footer_quick_5_url', '/gallery'),
  ('footer_quick_6_label', 'Blog'),
  ('footer_quick_6_url', '/blog'),
  ('footer_quick_7_label', 'Contacts'),
  ('footer_quick_7_url', '/contacts'),
  ('footer_service_1_label', 'Business Cards'),
  ('footer_service_1_url', '/services/business-cards'),
  ('footer_service_2_label', 'Large Format Printing'),
  ('footer_service_2_url', '/services/large-format-printing'),
  ('footer_service_3_label', 'Branding Services'),
  ('footer_service_3_url', '/services/branding-services'),
  ('footer_service_4_label', 'Vehicle Branding'),
  ('footer_service_4_url', '/services/vehicle-branding'),
  ('footer_service_5_label', 'Book Printing'),
  ('footer_service_5_url', '/services/book-printing'),
  ('footer_service_6_label', 'Customized Jerseys'),
  ('footer_service_6_url', '/services/customized-jerseys'),
  -- Contact
  ('contact_address', 'Main Street, City Centre, Accra, Ghana'),
  ('contact_phone',   '+233 XX XXX XXXX'),
  ('contact_email',   'info@seekantmultimedia.com'),
  ('contact_hours',   'Mon–Fri: 8am – 6pm  |  Sat: 9am – 4pm'),
  -- SEO
  ('seo_title',       'Seekant Multimedia — Design. Print. Brand.'),
  ('seo_description', 'Professional printing and branding services in Accra, Ghana. Business cards, banners, vehicle branding, custom jerseys, book printing, and 36+ services.'),
  -- Why Choose Us
  ('why_1_title',     'Fast Turnaround'),
  ('why_1_body',      'Most orders ready in 24–72 hours. Rush jobs available. We never compromise quality for speed.'),
  ('why_2_title',     'Premium Quality'),
  ('why_2_body',      'State-of-the-art equipment and premium materials. Every print is colour-accurate, sharp, and long-lasting.'),
  ('why_3_title',     'Competitive Pricing'),
  ('why_3_body',      'Transparent pricing with no hidden fees. Volume discounts available. Value for every budget.'),
  -- FAQ
  ('faq_1_q', 'What types of printing services do you offer?'),
  ('faq_1_a', 'We offer a full range of printing services including business cards, letterheads, flyers, brochures, banners, vehicle branding, book printing, ID cards, and much more — over 36 services in total.'),
  ('faq_2_q', 'How long does it take to complete an order?'),
  ('faq_2_a', 'Standard orders are typically ready within 24–72 hours. Rush orders can be accommodated for an additional fee. Large or complex orders may require more time — we''ll confirm the timeline when you get a quote.'),
  ('faq_3_q', 'Can I get a price quote for my print job?'),
  ('faq_3_a', 'Absolutely! Fill out our online quote form or walk into our shop. We''ll assess your requirements and provide a transparent, no-obligation quote within a few hours.'),
  ('faq_4_q', 'Can you design or help me design my print job?'),
  ('faq_4_a', 'Yes! Our in-house design team can create your artwork from scratch or refine your existing files. Design services are quoted separately depending on the complexity of the project.'),
  ('faq_5_q', 'Can you scan my hardcopy originals into electronic form?'),
  ('faq_5_a', 'Yes, we offer scanning and digitisation services. We can scan documents, photos, and artworks to high-resolution digital files in PDF, JPG, or PNG format.'),
  -- Brand theme colours
  ('theme_dark', '#15212c'),
  ('theme_gold', '#ddb837'),
  ('theme_pink', '#fd4682'),
  ('theme_blue', '#54b9fd'),
  ('theme_teal', '#315c5a')
on conflict (key) do nothing;

-- ── Default social link placeholders ─────────────────────────────────────────
insert into public.social_links (platform, url) values
  ('facebook',  'https://facebook.com/seekantmultimedia'),
  ('whatsapp',  'https://wa.me/233XXXXXXXXX'),
  ('youtube',   'https://youtube.com/@seekantmultimedia'),
  ('tiktok',    'https://tiktok.com/@seekantmultimedia'),
  ('instagram', 'https://instagram.com/seekantmultimedia'),
  ('twitter',   'https://twitter.com/seekantmultimedia'),
  ('linkedin',  'https://linkedin.com/company/seekantmultimedia')
on conflict (platform) do nothing;

-- ── Sample hero slide ────────────────────────────────────────────────────────
insert into public.hero_slides (heading, subtext, tag, btn1_label, btn1_href, btn2_label, btn2_href, sort_order, active)
values
  ('Design. Print. Brand.',
   'Professional printing and branding services in Accra. From business cards to full vehicle wraps — quality delivered fast.',
   'Seekant Multimedia',
   'Get a Free Quote', '/quote',
   'View Our Works',   '/works',
   0, true),
  ('Custom Jerseys & Apparel',
   'Screen printing, embroidery, and sublimation on any fabric. Corporate uniforms, sports kits, and more.',
   'Apparel Printing',
   'Order Now', '/quote',
   'See Gallery',  '/gallery',
   1, true),
  ('Large Format Printing',
   'Banners, billboards, vehicle wraps, roll-up stands, and trade fair displays — printed vivid and delivered on time.',
   'Signage & Banners',
   'Get a Quote', '/quote',
   null, null,
   2, true)
on conflict do nothing;

-- ── Sample services ───────────────────────────────────────────────────────────
insert into public.services (name, slug, category, description, sort_order, active) values
  ('Business Cards',       'business-cards',       'Print',     'Premium full-colour business cards, matte or gloss finish, single or double sided.',                        1,  true),
  ('Letterheads',          'letterheads',           'Print',     'Custom branded letterheads for professional correspondence.',                                               2,  true),
  ('Flyers & Brochures',   'flyers-brochures',      'Print',     'Eye-catching flyers and multi-page brochures for marketing and events.',                                   3,  true),
  ('Banners & Signage',    'banners-signage',        'Signage',   'Indoor and outdoor banners, pull-up stands, and rigid signage boards.',                                    4,  true),
  ('Roll-Up Banners',      'roll-up-banners',        'Signage',   'Portable retractable display stands — perfect for exhibitions and trade fairs.',                          5,  true),
  ('Vehicle Branding',     'vehicle-branding',       'Signage',   'Full and partial vehicle wraps, stickers, and magnetic signs for cars, buses, and trucks.',               6,  true),
  ('Custom Jerseys',       'custom-jerseys',         'Apparel',   'Sports jerseys and team kits with custom printing, numbers, and names.',                                  7,  true),
  ('Screen Printing',      'screen-printing',        'Apparel',   'Bulk T-shirt and fabric printing using durable screen printing techniques.',                              8,  true),
  ('Polo Shirts & Caps',   'polo-shirts-caps',       'Apparel',   'Branded polo shirts, caps, and workwear for corporate identity.',                                         9,  true),
  ('Embroidery',           'embroidery',             'Apparel',   'High-quality embroidery on uniforms, caps, bags, and any fabric item.',                                   10, true),
  ('Book Printing',        'book-printing',          'Publishing','Short-run and bulk book printing — novels, manuals, course materials, reports, and catalogues.',          11, true),
  ('Branding & Design',    'branding-design',        'Design',    'Logo design, brand identity packages, stationery suites, and marketing materials.',                       12, true),
  ('Mug Printing',         'mug-printing',           'Gifts',     'Full-colour sublimation printing on ceramic mugs — ideal for gifts and promotions.',                      13, true),
  ('ID Card Printing',     'id-card-printing',       'Print',     'Staff ID cards, event badges, and loyalty cards with optional lamination and chip.',                      14, true),
  ('Souvenir Printing',    'souvenir-printing',      'Gifts',     'Custom branded souvenirs — pens, notebooks, bags, keychains, and more.',                                 15, true),
  ('Wedding Stationery',   'wedding-stationery',     'Print',     'Invitations, programs, place cards, and full wedding print suites.',                                      16, true),
  ('Annual Reports',       'annual-reports',         'Publishing','Professionally designed and printed annual reports and company profiles.',                                17, true),
  ('Posters',              'posters',                'Print',     'Large and small format poster printing for events, promotions, and décor.',                               18, true)
on conflict (slug) do nothing;

-- ── Sample inventory items for POS ───────────────────────────────────────────
insert into public.inventory (name, category, price, stock, threshold) values
  ('Business Cards (500)',   'Print',   45.00,  50, 10),
  ('A4 Flyers (1000)',       'Print',   80.00,  30, 5),
  ('Roll-Up Banner 85×200',  'Signage', 120.00, 20, 3),
  ('Custom T-Shirt (each)',  'Apparel', 35.00,  100, 20),
  ('Polo Shirt (each)',      'Apparel', 55.00,  60, 10),
  ('Ceramic Mug (each)',     'Gifts',   25.00,  40, 10),
  ('A3 Poster',              'Print',   15.00,  80, 20),
  ('ID Card (each)',         'Print',   8.00,   150, 30),
  ('Logo Design (basic)',    'Design',  300.00, 999, 1),
  ('Brand Identity Package', 'Design',  800.00, 999, 1)
on conflict do nothing;
