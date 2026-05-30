-- Restrict inventory writes to admins only.
-- Staff users can still view inventory for POS and stock checks.

drop policy if exists "Staff can update inventory" on public.inventory;
drop policy if exists "Staff can insert inventory" on public.inventory;

