# VSpark — COMSATS University Islamabad, Vehari Campus

## Setup Guide

### 1. Install dependencies
```bash
npm install
```

### 2. Supabase Setup
1. Go to https://supabase.com → create project
2. Go to **SQL Editor** → paste & run `SUPABASE_SETUP.sql`
3. Copy your URL and anon key from **Settings → API**

### 3. Environment variables
```bash
cp .env.example .env
```
Fill in your Supabase URL and anon key.

### 4. Supabase Manual Steps (IMPORTANT)

#### A. Enable Email Authentication
- Go to **Authentication → Providers → Email**
- Enable it, turn OFF "Confirm email" for easier testing

#### B. Create Admin User
- Go to **Authentication → Users → Add User**
- Enter admin email + password
- Check "Auto Confirm User"

#### C. Enable Admin User Creation (for approving students)
- Go to **Settings → API**
- Copy the **service_role** key (keep secret!)
- Add to .env as: `REACT_APP_SUPABASE_SERVICE_KEY=your-service-role-key`

#### D. Update Site URL in Supabase
- **Authentication → URL Configuration**
- Site URL: `https://your-vercel-url.vercel.app`
- Redirect URLs: `https://your-vercel-url.vercel.app/**`

### 5. Run locally
```bash
npm start
```

### 6. Deploy to Vercel
1. Push to GitHub
2. Import on vercel.com
3. Add all env variables in Vercel project settings
4. Deploy

---

## Flow: Student Registration

```
Student fills form → submits request → admin sees in dashboard
Admin reviews payment + screenshot → clicks Approve
→ Supabase creates user account → credentials stored
→ Admin manually emails or system sends login details
→ Student logs in at /login with those credentials
```

## Admin Panel Routes
| Route | Description |
|-------|-------------|
| /admin/login | Admin login |
| /admin | Dashboard with pending request alerts |
| /admin/registrations | Review/approve/reject requests |
| /admin/competitions | Add/edit competitions + fees + date announcements |
| /admin/events | Manage events |
| /admin/blogs | Manage blogs |
| /admin/highlights | Manage gallery |
| /admin/settings | Payment account, event date, site config |

## Note on Credential Emails
When admin clicks "Approve", the system:
1. Creates a Supabase Auth user with a temp password
2. Stores the credentials in `credential_notifications` table
3. Admin should manually email the student OR set up Supabase Edge Functions for automatic email sending

To check pending emails: Go to **Admin → Registrations** → approved ones show the generated password in the review modal.
