-- Footer settings update for existing Seekant Multimedia Supabase projects.
-- Safe to run more than once in the Supabase SQL Editor.

insert into public.site_content (key, value) values
  ('footer_brand_name', 'SEEKANT MULTIMEDIA'),
  ('footer_brand_subtitle', 'Design. Print. Brand.'),
  ('footer_tagline', 'Your trusted printing and branding partner — delivering quality across every medium, from a single business card to a full brand identity.'),
  ('footer_quick_links_title', 'Quick Links'),
  ('footer_services_title', 'Our Services'),
  ('footer_contact_title', 'Contact Us'),
  ('footer_all_services_label', 'All 36 Services →'),
  ('footer_all_services_url', '/services'),
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
  ('footer_service_6_url', '/services/customized-jerseys')
on conflict (key) do nothing;

insert into public.social_links (platform, url) values
  ('facebook', 'https://facebook.com/seekantmultimedia'),
  ('instagram', 'https://instagram.com/seekantmultimedia'),
  ('twitter', 'https://twitter.com/seekantmultimedia'),
  ('whatsapp', 'https://wa.me/233XXXXXXXXX'),
  ('youtube', 'https://youtube.com/@seekantmultimedia'),
  ('tiktok', 'https://tiktok.com/@seekantmultimedia'),
  ('linkedin', 'https://linkedin.com/company/seekantmultimedia')
on conflict (platform) do nothing;

grant select on table public.site_content to anon;
grant select, insert, update, delete on table public.site_content to authenticated;
grant select, insert, update, delete on table public.site_content to service_role;

grant select on table public.social_links to anon;
grant select, insert, update, delete on table public.social_links to authenticated;
grant select, insert, update, delete on table public.social_links to service_role;
