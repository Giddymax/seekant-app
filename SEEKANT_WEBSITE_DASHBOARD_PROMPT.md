# Seekant Multimedia Website And Dashboard Prompt

Build a complete professional website and admin/staff dashboard for "Seekant Multimedia", a Ghana-based printing, branding, design, publishing, and multimedia company.

Use Next.js 16 App Router, React 19, TypeScript, Supabase, Supabase Auth, server components, server actions, Tailwind/CSS variables, Resend/React Email where needed, and responsive UI patterns. Before coding, read the relevant Next.js 16 guide from `node_modules/next/dist/docs/` because this version may include breaking changes.

## Brand

- Company name: Seekant Multimedia
- Tagline: Design. Print. Brand.
- Industry: printing, branding, signage, apparel printing, book publishing, graphic design, souvenirs, and corporate print services
- Visual style: premium, practical, business-focused, dark navy/charcoal base, strong red accent, gold/blue/pink/teal supporting colors, high contrast, clean typography, real print/branding imagery
- Use the company logo in the navbar, footer, login page, and admin sidebar

## All-Device Responsiveness

- The public website and admin/staff dashboard must work beautifully on phones, tablets, laptops, desktops, and wide screens.
- Design mobile-first, then scale up using responsive grids, flexible layouts, `max-width`, `minmax()`, `clamp()`, wrapping, and safe spacing.
- Verify common widths: 320px, 375px, 414px, 768px, 1024px, 1280px, 1440px, and wider desktop screens.
- No text, buttons, cards, tables, charts, forms, images, nav menus, or dashboard panels may overlap, overflow, or become unreadable.
- Public grids should collapse from multi-column desktop layouts to clean single-column mobile layouts.
- Touch targets should be easy to tap, ideally at least 44px where practical.
- Tables in admin pages should scroll horizontally or transform into mobile-friendly stacked rows.
- Admin forms should become single-column on mobile.
- Sidebar should adapt on smaller screens by collapsing, hiding labels, or becoming mobile navigation.
- POS, sales, inventory, quotes, staff, content, theme, gallery, and blog tools must remain usable on phones and tablets.
- Hero images, headings, CTAs, slide controls, cards, galleries, and forms must stay properly framed on every viewport.

## Public Website

- Build pages for Home, About, Services, individual service detail, Products, Works, Gallery, Blog, blog detail, Quote, Contacts, and info pages for printing, design, and publishing.
- Home page includes editable hero slider, services grid, why-choose-us, portfolio strip, blog preview, and FAQ accordion.
- Navbar is fixed, dark, responsive, and includes logo, brand text, links, services dropdown, mobile hamburger menu, and "Get Quote" CTA.
- Footer is editable from Supabase and includes brand block, tagline, quick links, services links, contact details, social icons, copyright, legal links, newsletter bar, and staff login link.
- Public content should read from Supabase where possible and only show active/published records.

## Quote System

- Create a public quote form storing submissions in `quote_requests`.
- Fields: name, email, phone, service type, quantity, deadline, details, status.
- Support quote email notifications/confirmations with Resend and React Email if configured.

## Admin/Staff Dashboard

- Create a protected `/admin` portal using Supabase Auth.
- Unauthenticated users redirect to `/admin/login`.
- Login page should be dark, branded, responsive, validated, and show toast errors plus first-time setup guidance.
- Dashboard layout has dark UI, sticky/adaptive sidebar, topbar with role/email/title, and role-based navigation.
- Admin sees all sections; staff sees operational sections only.

## Admin Sections

- Dashboard: total revenue, total sales, pending quotes, low-stock items, 6-month revenue chart, quick actions, recent sales.
- POS: create sales, add inventory/service items, customer details, discount, amount paid, payment method, notes, status, sale items, and stock decrementing.
- Sales: list sales, show details, statuses, totals, amount paid, customer info, and sale items.
- Inventory: manage POS products/services with name, category, image, price, stock, threshold, and `is_service`.
- Quotes: view quote requests and update statuses: new, reviewed, quoted, completed, cancelled.
- Content: edit site key-value content for pages, footer, contact, FAQ, SEO, theme, and navigation.
- Hero Slides: create/edit/delete/sort/activate slides with images, headings, CTAs, tags, and subtext.
- Gallery/Works: manage image items with label, category, sort order, and active state.
- Services: create/edit/delete services with name, slug, category, description, image, sort order, and active state.
- Blog: create/edit/delete posts with title, slug, category, excerpt, content, cover, status, author, and published date.
- Pages & Navigation: edit labels, URLs, and page-related content.
- Social Links: manage Facebook, Instagram, Twitter/X, WhatsApp, YouTube, TikTok, and LinkedIn.
- Theme: edit brand colors and apply them through CSS variables.
- Staff Accounts: admin can create, update, activate/deactivate, reset password, change role, and delete staff/admin accounts.

## Receipt Generation

- The POS must generate a receipt immediately after a sale is successfully recorded.
- The receipt must use the saved `sale_ref` returned from the database, not a temporary client-side reference.
- Show an on-screen receipt preview modal after checkout with clear actions for Print and Close.
- The Sales page must allow staff/admin users to reprint receipts for previous sales.
- Receipt printing must use print-specific CSS that hides the dashboard UI and prints only the receipt.
- Receipts must be optimized for 80mm thermal receipt printers while still being readable in browser print preview.
- Use a compact monochrome receipt style with a white background, black text, monospace type, approximately 12px text, and a printable width of about 80mm or 302px.
- Include the company logo at the top of the receipt.
- Include customer payment state clearly: full payment, part payment with balance due, or overpayment with change due.
- Use the same Ghana cedi formatting as the rest of the dashboard.
- Support receipts for both physical products and service items.
- Use saved `sale_items` when reprinting from the Sales page. If line items are missing, show a small fallback note instead of breaking the receipt.
- Receipt data should include the sale date/time, reference, customer, phone, payment method, staff/server where available, optional notes, line items, subtotal, discount, total, amount paid, change, balance due, and customer copy label.

Receipt format:

```text
[LOGO] SEEKANT MULTIMEDIA
       Design. Print. Brand.
       Asuom, Eastern Region, Ghana
       Tel: [contact phone if available]
       www.seekantmultimedia.com
================================
Date: DD/MM/YYYY HH:MM
Ref:  [sale_ref]
Cust: [customer name or Walk-in]
Tel:  [customer phone if available]
Pay:  [Cash | Mobile Money | Bank Transfer | Card]
Serv: [staff/server name if available]
Note: [optional sale note]
--------------------------------
ITEM                    QTY  TOTAL
--------------------------------
[item/service name]     [q]  [line total]
[item/service name]     [q]  [line total]
--------------------------------
SUBTOTAL                     [subtotal]
DISCOUNT                    -[discount, if any]
--------------------------------
TOTAL                        [total]
PAID                         [amount paid]
CHANGE                       [change due, if overpaid]
BALANCE DUE                  [balance due, if part-paid]
================================
Thank you for your patronage!
*** CUSTOMER COPY ***
```

## Supabase

- Create schema for profiles, services, hero_slides, blog_posts, gallery_items, site_content, social_links, products, inventory, sales, sale_items, and quote_requests.
- Include UUID support, `updated_at` trigger, auth profile trigger, RLS helper functions `is_admin()` and `is_staff()`, and secure RLS policies.
- Public can read active/published public content; staff can manage operational data; admins can manage all content and users.
- Create storage buckets: hero-images, service-images, blog-covers, gallery-images, product-images, and uploads.
- Add storage policies for authenticated uploads and public reads where appropriate.
- Seed default hero slides, services, inventory, social links, theme colors, FAQ, footer content, and why-choose-us content.

## Implementation

- Use Supabase server client for server components/actions and browser client for uploads/client interactions.
- Use `revalidatePath` after mutations.
- Use validation, accessible labels, loading states, disabled states, empty states, and toast notifications.
- Keep the public site polished and conversion-focused.
- Keep the dashboard dense, operational, fast to scan, and easy to use.
- Before final delivery, run a production build and visually verify public and admin screens on mobile, tablet, desktop, and wide desktop widths.
