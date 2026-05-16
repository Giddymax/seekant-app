-- Typography theme defaults. Safe to run more than once.
insert into public.site_content (key, value) values
  ('theme_font_family',   'Poppins'),
  ('theme_text_color',    '#737a80'),
  ('theme_heading_color', '#1a181d')
on conflict (key) do nothing;
