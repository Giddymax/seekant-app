-- Nav items and page hero images. Safe to run more than once.

insert into public.site_content (key, value) values
  -- Navbar items (label + URL pairs; clear label to hide item)
  ('nav_1_label', 'Home'),       ('nav_1_url', '/'),
  ('nav_2_label', 'About'),      ('nav_2_url', '/about'),
  ('nav_3_label', 'Services'),   ('nav_3_url', '/services'),
  ('nav_4_label', 'Products'),   ('nav_4_url', '/products'),
  ('nav_5_label', 'Our Works'),  ('nav_5_url', '/works'),
  ('nav_6_label', 'Gallery'),    ('nav_6_url', '/gallery'),
  ('nav_7_label', 'Blog'),       ('nav_7_url', '/blog'),
  ('nav_8_label', 'Contacts'),   ('nav_8_url', '/contacts'),

  -- Page hero background images (leave empty to keep the plain dark colour)
  ('page_hero_about_image',    ''),
  ('page_hero_services_image', ''),
  ('page_hero_gallery_image',  ''),
  ('page_hero_works_image',    ''),
  ('page_hero_blog_image',     ''),
  ('page_hero_contacts_image', ''),
  ('page_hero_quote_image',    '')
on conflict (key) do nothing;
