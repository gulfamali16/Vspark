# VSpark 2025 — COMSATS University Islamabad, Vehari Campus
## Full-Stack Event Management Website

---

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Go to https://supabase.com and create a free project
2. Go to **SQL Editor** and paste the contents of `SUPABASE_SETUP.sql`
3. Click **Run** to create all tables with RLS policies and sample data
4. Go to **Settings → API** to get your URL and anon key

### 3. Configure Environment
```bash
cp .env.example .env
```
Edit `.env` with your Supabase credentials:
```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Create Admin User
In your Supabase dashboard:
1. Go to **Authentication → Users**
2. Click **Invite User** or **Add User**
3. Enter your admin email and password
4. Use these credentials to log in at `/admin/login`

### 5. Start Development Server
```bash
npm start
```

### 6. Build for Production
```bash
npm run build
```
Deploy the `build/` folder to Vercel, Netlify, or any static host.

---

## 📁 Project Structure
```
vspark/
├── src/
│   ├── components/          # Shared components (Navbar, Footer, Particles)
│   ├── pages/               # Public website pages
│   │   ├── Home.js
│   │   ├── Competitions.js
│   │   ├── Events.js
│   │   ├── Register.js
│   │   ├── Blogs.js
│   │   ├── BlogDetail.js
│   │   ├── Highlights.js
│   │   └── Department.js
│   ├── admin/
│   │   ├── components/      # Admin sidebar, auth guard
│   │   └── pages/           # Admin dashboard pages
│   │       ├── AdminLogin.js
│   │       ├── AdminDashboard.js
│   │       ├── AdminEvents.js
│   │       ├── AdminRegistrations.js
│   │       ├── AdminBlogs.js
│   │       └── AdminHighlights.js
│   └── lib/
│       └── supabase.js      # Supabase client config
├── SUPABASE_SETUP.sql       # Database schema + RLS policies
├── .env.example             # Environment variables template
└── README.md
```

## 🌐 Pages
| Route | Description |
|-------|-------------|
| `/` | Home — Hero, competitions preview, internship highlight |
| `/competitions` | All 7 competitions with expandable details |
| `/events` | Upcoming events with dates and venues |
| `/register` | Student registration form |
| `/blogs` | Blog listing |
| `/blogs/:id` | Individual blog post |
| `/highlights` | Photo gallery with lightbox |
| `/department` | CS Department showcase |
| `/admin/login` | Admin authentication |
| `/admin` | Dashboard with stats |
| `/admin/events` | Manage events |
| `/admin/registrations` | View/export registrations |
| `/admin/blogs` | Manage blog posts |
| `/admin/highlights` | Manage gallery |

## 🎨 Design System
- **Primary**: #00d4ff (Cyan)
- **Accent**: #ff6b00 (Orange)
- **Purple**: #7c3aed
- **Gold**: #ffd700
- **Background**: #050810 (Deep Navy)
- **Fonts**: Bebas Neue (headings), Rajdhani (body), JetBrains Mono (code/labels)

## 📊 Database Tables
- `events` — Event listings
- `registrations` — Student registrations
- `blogs` — Blog posts
- `highlights` — Gallery images

