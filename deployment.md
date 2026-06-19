# Seekant Multimedia — Deployment Guide

> **Audience:** First-time deployers, no prior Supabase/Vercel experience needed.
> **Stack:** Next.js 16 + Supabase + Resend + Vercel
> **Time:** ~30 minutes

---

## Step 1 — Set Up Supabase (Database)

1. Go to [supabase.com](https://supabase.com) → **Start your project** → sign up.
2. Click **New project** and fill in:
   - **Name:** `seekant-multimedia`
   - **Password:** save this somewhere safe
   - **Region:** closest to your users (e.g. Europe West for Ghana)
3. Wait ~2 minutes for the project to spin up.

### Run the database schema

1. In Supabase → **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this project, copy everything, paste it in, and click **Run**.
3. You should see `Success. No rows returned`.

> Already ran it once and got an error? That's fine — the tables already exist.

### Grab your API keys

Go to **Project Settings → API** and copy these three values:

| Key | Where |
|-----|-------|
| Project URL | Under "Project URL" |
| Anon key | Under "Project API keys → anon public" |
| Service role key | Under "Project API keys → service_role" (**keep secret**) |

### Create the first admin account

1. Go to **Authentication → Users → Add user → Create new user**.
2. Enter your email and a password.
3. In **SQL Editor**, run:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

---

## Step 2 — Set Up Resend (Email)

Resend sends quote confirmation emails to customers.

1. Go to [resend.com](https://resend.com) → sign up (free plan works).
2. Go to **API Keys → Create API Key** → name it `seekant-production` → copy the key.

**Optional:** Verify your domain under **Domains → Add Domain** so emails come from your address instead of `@resend.dev`.

---

## Step 3 — Configure Environment Variables

Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@seekantmultimedia.com
NOTIFICATION_EMAIL=info@seekantmultimedia.com
```

> If you skipped domain verification on Resend, set `RESEND_FROM_EMAIL` to `onboarding@resend.dev`.

**Never commit `.env.local` to Git** — it's already in `.gitignore`.

---

## Step 4 — Test Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and verify:

- [ ] Homepage loads with services and hero slides
- [ ] `/admin/login` — log in with your admin account
- [ ] `/quote` — submit a test quote → check your email
- [ ] POS — process a test sale → receipt prints correctly

---

## Step 5 — Deploy to Vercel

### Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/seekant-app.git
git push -u origin main
```

### Import to Vercel

1. Go to [vercel.com](https://vercel.com) → sign up with GitHub.
2. Click **Add New → Project** → select your repo → **Import**.
3. **Add all 6 environment variables** from your `.env.local` file.
4. Click **Deploy** → wait ~2 minutes.

Your site is live at `your-project.vercel.app`.

### Custom domain (optional)

1. In Vercel → **Settings → Domains → Add Domain**.
2. Add the DNS records Vercel gives you at your registrar (GoDaddy, Namecheap, etc.).
3. DNS propagation can take up to 48 hours.

---

## Step 6 — Post-Deployment Checklist

After the site is live, log in at `/admin` and:

- [ ] **Site Content** — add your real address, phone, email
- [ ] **Social Links** — add your actual social media URLs
- [ ] **Hero Slides** — upload your own banner images
- [ ] **Gallery** — upload real photos of your work
- [ ] **Services** — review and customize the default services
- [ ] **Inventory** — set real prices and stock levels
- [ ] Submit a test quote and confirm the notification email arrives
- [ ] Process a test POS sale and confirm the receipt prints

---

## Ongoing Updates

**Code changes:** Push to `main` on GitHub → Vercel auto-deploys in ~2 minutes.

**Adding staff:** Admin panel → Staff Accounts → Add Staff Member. Staff can use POS, view sales, and manage quotes. Admins can do everything.

---

## Admin Panel Quick Reference

| Page | Access | Purpose |
|------|--------|---------|
| Dashboard | Everyone | Revenue overview and recent activity |
| Point of Sale | Everyone | Process in-store sales, print receipts |
| Sales | Everyone | View sale history, update statuses |
| Inventory | Everyone | Manage POS products and stock |
| Quote Requests | Everyone | View/respond to customer quotes |
| Analytics | Admin only | Revenue charts and breakdowns |
| Site Content | Admin only | Edit website text (About, FAQ, Contact, etc.) |
| Hero Slides | Admin only | Manage homepage carousel |
| Gallery | Admin only | Upload/manage portfolio photos |
| Services | Admin only | Edit the services catalog |
| Blog | Admin only | Write and publish articles |
| Social Links | Admin only | Update social media URLs |
| Theme | Admin only | Adjust brand colors |
| Staff Accounts | Admin only | Create/manage staff logins |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Invalid login credentials" | Reset the password in Supabase → Authentication → Users |
| Site loads but content is missing | Check that all 6 env vars are set in Vercel → Settings → Environment Variables, then redeploy |
| No email after quote submission | Verify `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are correct; check domain verification |
| "row-level security policy" error | The user's role is wrong — check their profile in the `profiles` table |
| Images fail to upload | Re-run `supabase/schema.sql` — the storage bucket creation is safe to repeat |
| Receipt prints blank | Pull the latest code from `main` — this was a fixed bug |

---

*Next.js 16 + Supabase + Resend + Tailwind CSS + Vercel*
