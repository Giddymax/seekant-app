# Seekant Multimedia — Setup & Deployment Guide

> **Who this is for:** Anyone setting up this project for the first time, with no prior knowledge of Supabase or Vercel.
> **Time needed:** 30–45 minutes.

---

## What You're Setting Up

| Piece | What it does |
|---|---|
| **Supabase** | The database and file storage (like a smart spreadsheet + file cabinet in the cloud) |
| **Resend** | Sends email confirmations when customers submit quote requests |
| **Vercel** | Hosts the website live on the internet |

---

## Part 1 — Supabase (Database & Storage)

### 1.1 Create a Supabase Account & Project

1. Go to **[supabase.com](https://supabase.com)** and click **Start your project**.
2. Sign up with GitHub or email.
3. Click **New project**.
4. Fill in:
   - **Organization:** create one if prompted (use your business name)
   - **Name:** `seekant-multimedia`
   - **Database Password:** create a strong password and **save it somewhere safe** — you will need it later
   - **Region:** choose the one closest to Ghana (e.g. *Europe West* or *US East*)
5. Click **Create new project** and wait ~2 minutes for it to spin up.

---

### 1.2 Run the Database Schema

This step creates all the tables, rules, and sample data the website needs.

1. In your Supabase project, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open the file `supabase/schema.sql` from this project folder.
4. Copy **all** of its contents (Ctrl+A, Ctrl+C).
5. Paste it into the SQL Editor (Ctrl+V).
6. Click the green **Run** button (or press Ctrl+Enter).
7. You should see `Success. No rows returned` at the bottom — that means it worked.

> **If you see an error:** Read the error message. The most common cause is running the script twice. If so, skip to step 1.3 — the tables are already created.

---

### 1.3 Get Your API Keys

1. In Supabase, click **Project Settings** (gear icon, bottom-left).
2. Click **API** in the sub-menu.
3. You need three values — copy each one and keep them handy:

   | Key | Where to find it |
   |---|---|
   | **Project URL** | Under "Project URL" — looks like `https://xxxx.supabase.co` |
   | **Anon / public key** | Under "Project API keys → anon public" |
   | **Service role key** | Under "Project API keys → service_role" — **keep this secret** |

---

### 1.4 Create the First Admin Account

This creates the login that lets you access the admin panel.

1. In Supabase, click **Authentication** in the left sidebar.
2. Click **Users**, then **Add user → Create new user**.
3. Enter your email address and a strong password.
4. Click **Create user**.
5. Now click **SQL Editor** again and run this query (replace the email with yours):

```sql
update public.profiles
set role = 'admin'
where email = 'your-email@example.com';
```

6. Click **Run**. Your account is now an admin.

> **To add staff members later:** Go to **Admin → Staff Accounts** on the website after it's live. Staff members can use the POS and view sales but cannot edit website content.

---

## Part 2 — Resend (Email)

Resend sends automatic email confirmations to customers when they submit a quote.

### 2.1 Create a Resend Account

1. Go to **[resend.com](https://resend.com)** and sign up (free plan is fine to start).
2. Click **API Keys** in the sidebar.
3. Click **Create API Key**, name it `seekant-production`, and copy the key (starts with `re_`).

### 2.2 Verify Your Domain (Recommended)

Without domain verification, emails come from a Resend test address. To send from `info@seekantmultimedia.com`:

1. In Resend, click **Domains → Add Domain**.
2. Enter your domain (e.g. `seekantmultimedia.com`).
3. Follow the DNS instructions Resend gives you — add the records to wherever your domain is registered (GoDaddy, Namecheap, etc.).
4. Wait up to 24 hours for DNS to verify.

> **Skip for now:** You can skip domain verification initially and use the Resend test email. Emails will still be sent but from a `@resend.dev` address.

---

## Part 3 — Environment Variables

Environment variables are secret settings the website needs to connect to Supabase and Resend. **Never commit these to Git.**

### 3.1 Create the Local Environment File

1. In the project folder, find the file `.env.local`.
2. Open it in any text editor (Notepad, VS Code, etc.).
3. Replace every `placeholder` value with your real values:

```env
# ─── Supabase ──────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...

# ─── Resend (email) ────────────────────────────────────────
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@seekantmultimedia.com
NOTIFICATION_EMAIL=info@seekantmultimedia.com
```

4. Save the file.

> **Important:** `RESEND_FROM_EMAIL` must match your verified domain on Resend. If you skipped domain verification, use `onboarding@resend.dev` temporarily.

---

## Part 4 — Test Locally

Before going live, confirm everything works on your computer.

### 4.1 Install Dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

### 4.2 Start the Development Server

```bash
npm run dev
```

Open your browser and go to **http://localhost:3000**. You should see the Seekant Multimedia website.

### 4.3 Test the Admin Login

1. Go to **http://localhost:3000/admin/login**
2. Enter the email and password you created in step 1.4.
3. You should be redirected to the Admin Dashboard.

### 4.4 Test a Quote Submission

1. Go to **http://localhost:3000/quote**
2. Fill in the form and submit.
3. Check your `NOTIFICATION_EMAIL` inbox — you should receive an email.
4. In the admin panel, go to **Quote Requests** — the submission should appear there.

### 4.5 Test the POS Receipt

1. In the admin panel, go to **Point of Sale**.
2. Click a product to add it to the cart.
3. Click **Process Sale**.
4. Your browser's print dialog should open with the receipt.

---

## Part 5 — Deploy to Vercel

Vercel hosts the website live on the internet for free.

### 5.1 Push to GitHub

If the project is not already on GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
```

Then create a new repository on **[github.com](https://github.com)** and follow the instructions to push.

### 5.2 Create a Vercel Account & Import the Project

1. Go to **[vercel.com](https://vercel.com)** and sign up with GitHub.
2. Click **Add New → Project**.
3. Find and select your GitHub repository.
4. Click **Import**.

### 5.3 Add Environment Variables in Vercel

**This step is critical** — without it, the live site cannot connect to Supabase.

1. On the import screen, expand **Environment Variables**.
2. Add each variable from your `.env.local` file one by one:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon/public key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your service role key |
   | `RESEND_API_KEY` | Your Resend API key |
   | `RESEND_FROM_EMAIL` | `noreply@seekantmultimedia.com` |
   | `NOTIFICATION_EMAIL` | `info@seekantmultimedia.com` |

3. Click **Deploy**.
4. Wait ~2 minutes for the build to complete.
5. Vercel gives you a URL like `seekant-app.vercel.app` — click **Visit** to see your live site.

### 5.4 Connect a Custom Domain (Optional)

To use `www.seekantmultimedia.com` instead of the Vercel URL:

1. In Vercel, go to your project → **Settings → Domains**.
2. Click **Add Domain** and enter your domain.
3. Vercel shows you DNS records to add — go to your domain registrar (GoDaddy, Namecheap, etc.) and add them.
4. Wait up to 48 hours for the domain to go live.

---

## Part 6 — Post-Deployment Checklist

Run through this after the site is live:

- [ ] Visit the live URL and confirm the homepage loads correctly
- [ ] Visit `/admin/login` and log in successfully
- [ ] Go to **Site Content** and fill in your real business address, phone, and email
- [ ] Go to **Site Content → Footer Social Icons** and add your real social media URLs
- [ ] Go to **Hero Slides** and upload your own images (replace placeholder content)
- [ ] Go to **Gallery** and upload real photos of your work
- [ ] Go to **Services** and review/edit the 18 default services
- [ ] Go to **Inventory** and update prices and stock levels for your products
- [ ] Submit a test quote from `/quote` and confirm you receive the notification email
- [ ] Process a test sale from the POS and confirm the receipt prints correctly
- [ ] Check the Dashboard and confirm it shows the test sale

---

## Admin Panel Reference

Once logged in at `/admin`, here is what each page does:

| Page | Who can access | What it does |
|---|---|---|
| Dashboard | Staff + Admin | Overview of revenue, quotes, and recent sales |
| Point of Sale | Staff + Admin | Process in-store sales and print receipts |
| Sales | Staff + Admin | View all past sales and update status |
| Inventory | Staff + Admin | Manage products used in the POS |
| Analytics | **Admin only** | Revenue charts, quote breakdowns, top products |
| Site Content | **Admin only** | Edit all text on the website (About, Contact, FAQ, Why Choose Us) and manage footer social media links |
| Hero Slides | **Admin only** | Manage homepage carousel slides |
| Gallery | **Admin only** | Upload and manage photos shown on Gallery and Works pages |
| Services | **Admin only** | Manage the list of services shown on the website |
| Blog | **Admin only** | Write and publish blog articles |
| Quote Requests | Staff + Admin | View and respond to customer quote submissions |
| Theme | **Admin only** | Adjust brand colours |
| Staff Accounts | **Admin only** | Create and manage staff login accounts |

---

## Troubleshooting

**"Invalid login credentials" on the admin login page**
→ Double-check the email and password in Supabase under Authentication → Users. Reset the password from there if needed.

**Website loads but shows no services, slides, or gallery photos**
→ Your Supabase environment variables are probably not set correctly in Vercel. Go to Vercel → Project → Settings → Environment Variables and check all six values are present and correct. Then re-deploy.

**Quote form submits but I receive no email**
→ Check that `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are correct. Also verify your domain in Resend (Part 2.2).

**POS receipt prints blank (no items listed)**
→ This was a known bug that has been fixed. Make sure you are using the latest version of the code.

**"new row violates row-level security policy" error in Supabase logs**
→ You are trying to write to a table without being logged in, or with a 'staff' account trying to do an admin-only action. Check the user's role in Supabase under Authentication → Users → click the user → view the profiles table.

**Images fail to upload in the admin panel**
→ The storage buckets must be created. Re-run the SQL schema from `supabase/schema.sql` — the `insert into storage.buckets` section is safe to run again (it uses `on conflict do nothing`).

---

## Updating the Site in the Future

Any changes pushed to the `main` branch on GitHub will automatically re-deploy on Vercel within ~2 minutes. No manual steps needed.

To add new staff:
1. Log in as an admin.
2. Go to **Admin → Staff Accounts → Add Staff Member**.
3. Enter their name, email, role (staff or admin), and a temporary password.
4. Tell them to log in and change their password.

---

*Built with Next.js · Supabase · Tailwind CSS · Vercel*
