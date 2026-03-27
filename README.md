# VSpark — COMSATS University Islamabad, Vehari Campus

> National-level coding competition and innovation showcase by the Department of Computer Science.

**Live URLs:**
- 🌐 https://vspark.gulfamali.me
- 🌐 https://vspark-omega.vercel.app
- 🔐 Admin Panel: https://vspark.gulfamali.me/admin/login

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router DOM v6 |
| Build Tool | Create React App (react-scripts 5) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Email | EmailJS |
| File Hosting | GitHub (screenshot URLs) |
| Deployment | Vercel |
| Domain | vspark.gulfamali.me |

---

## Project Structure

```
vspark/
├── public/
│   ├── images/
│   │   ├── vspark.png              # Header logo
│   │   ├── vspark-footer.png       # Footer logo
│   │   ├── csdep.png               # CS Department logo
│   │   ├── abdullah-sir.png        # Team Lead photo
│   │   ├── gulfam-ali.png          # Developer photo
│   │   └── ali-hassan.png          # Developer photo
│   └── index.html
├── src/
│   ├── admin/
│   │   ├── components/
│   │   │   ├── AdminRoute.js       # Auth guard + role checker
│   │   │   └── AdminSidebar.js     # Sidebar with permission-based nav
│   │   └── pages/
│   │       ├── AdminLogin.js       # Admin/assistant login (blocks students)
│   │       ├── AdminDashboard.js   # Overview + stats + pending alerts
│   │       ├── AdminRegistrations.js # Review/approve/reject requests
│   │       ├── AdminCompetitions.js  # Manage competitions + fees + dates
│   │       ├── AdminSchedule.js    # Rooms, time slots, schedule assignments
│   │       ├── AdminDepartment.js  # Faculty, programs, achievements
│   │       ├── AdminEvents.js      # Manage event listings
│   │       ├── AdminBlogs.js       # Create/edit blog posts
│   │       ├── AdminHighlights.js  # Photo gallery management
│   │       ├── AdminAssistants.js  # Create limited-access assistant accounts
│   │       └── AdminSettings.js    # Payment account, event config
│   ├── components/
│   │   ├── Navbar.js               # Responsive navbar with mobile drawer
│   │   ├── Footer.js               # Footer with dual logos
│   │   └── ParticlesBg.js          # Animated canvas background
│   ├── lib/
│   │   └── supabase.js             # Supabase client
│   ├── pages/
│   │   ├── Home.js                 # Landing page + team section
│   │   ├── Competitions.js         # Live competitions from DB
│   │   ├── Events.js               # Event schedule + status banner
│   │   ├── Register.js             # Registration request form
│   │   ├── Login.js                # Participant login
│   │   ├── StudentCard.js          # Digital participation card + QR
│   │   ├── Blogs.js                # Blog listing + achievements section
│   │   ├── BlogDetail.js           # Individual blog post
│   │   ├── Highlights.js           # Photo gallery
│   │   └── Department.js           # CS Department — faculty, programs, achievements
│   ├── App.js                      # Route definitions
│   ├── index.js                    # React entry point
│   └── index.css                   # Global styles + responsive breakpoints
└── package.json
```

---

## Supabase Database Schema

### `competitions`
| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| title | text | Competition name |
| category | text | Technical / Gaming / Creative / AI |
| short_desc | text | Brief description |
| fee | integer | Registration fee (PKR) |
| color | text | Hex color for UI theming |
| rules | text | Newline-separated rules |
| prizes | text | Newline-separated prize tiers |
| is_active | boolean | Visible on website |
| is_new | boolean | Shows NEW badge |
| date_announced | boolean | Whether date is set |
| event_date | timestamptz | Scheduled date/time |

### `registration_requests`
| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| student_name | text | Full name |
| email | text | Student email |
| phone | text | Phone number |
| reg_number | text | University/roll number |
| institute | text | University / school / college |
| department | text | Academic department |
| competition_id | bigint | FK → competitions |
| fee_amount | integer | Fee at time of registration |
| transaction_id | text | Payment transaction ID |
| screenshot_url | text | Payment proof image URL |
| status | text | pending / approved / rejected |
| temp_password | text | Generated on approval |
| approved_at | timestamptz | Approval timestamp |

### `rooms`
| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| name | text | Room name |
| location | text | Physical location |
| capacity | integer | Max participants |
| is_active | boolean | Available for scheduling |

### `time_slots`
| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| label | text | e.g. "Morning Session 1" |
| start_time | time | Start time |
| end_time | time | End time |
| event_date | date | Which day |

### `schedules`
| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| competition_id | bigint | FK → competitions (unique) |
| room_id | bigint | FK → rooms |
| time_slot_id | bigint | FK → time_slots |
| max_capacity | integer | Override room capacity |
| notes | text | Instructions for participants |

### `faculty`
| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| name | text | Full name |
| designation | text | e.g. Assistant Professor |
| specialization | text | Research area |
| bio | text | Biography |
| image_url | text | Profile photo URL |
| github_url | text | GitHub profile |
| linkedin_url | text | LinkedIn profile |
| email | text | Contact email |
| is_hod | boolean | Head of Department |
| display_order | integer | Sort order |
| is_active | boolean | Visible on website |

### `programs`
| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| title | text | Program name |
| degree | text | BS / MS / PhD |
| duration | text | e.g. "4 Years" |
| description | text | Program overview |
| total_seats | integer | Annual intake |
| is_active | boolean | Visible on website |

### `admin_assistants`
| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| name | text | Assistant name |
| email | text | Login email (unique) |
| permissions | jsonb | Array of permission keys |
| is_active | boolean | Can login or not |

### `blogs`
| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| title | text | Blog title |
| content | text | HTML content |
| image_url | text | Cover image |
| created_at | timestamptz | Publication date |

### `highlights`
| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| image_url | text | Gallery image |
| description | text | Caption |

### `events`
| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Primary key |
| title | text | Event name |
| description | text | Details |
| date | date | Event date |
| time | text | Time string |
| venue | text | Location |
| image_url | text | Cover image |

### `site_settings`
| Column | Type | Description |
|--------|------|-------------|
| key | text | Setting key (unique) |
| value | text | Setting value |

**Site settings keys:**
| Key | Description |
|-----|-------------|
| `payment_account` | JazzCash/EasyPaisa/bank number |
| `payment_account_name` | Bank or service name |
| `payment_account_title` | Account holder name |
| `event_date` | Main event date |
| `event_venue` | Venue name |
| `event_status` | upcoming / registration_open / registration_closed / ongoing / completed |
| `site_email` | Contact email |
| `achievement_blog_ids` | JSON array of blog IDs shown as achievements |

### `credential_notifications`
Tracks generated credentials for approved students.

---

## Environment Variables

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_SUPABASE_SERVICE_KEY=your-service-role-key
```

Set in Vercel → Project Settings → Environment Variables.

---

## Public Website Routes

| Route | Page |
|-------|------|
| `/` | Home — hero, stats, competitions preview, team |
| `/competitions` | All competitions with fees, rules, prizes, dates |
| `/events` | Event schedule with live status banner |
| `/register` | Registration request form with payment info |
| `/login` | Participant login (credentials from admin) |
| `/card` | Digital participation card + QR code (login required) |
| `/blogs` | Blog listing + Department Achievements section |
| `/blogs/:id` | Individual blog post |
| `/highlights` | Photo gallery |
| `/department` | CS Department — faculty, programs, achievements |

---

## Admin Panel Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/admin/login` | Public | Admin/assistant login only |
| `/admin` | Admin + Assistants | Dashboard with stats and pending alerts |
| `/admin/registrations` | perm: registrations | Review, approve, reject requests |
| `/admin/competitions` | perm: competitions | Manage competitions, fees, dates |
| `/admin/schedule` | perm: schedule | Rooms, time slots, schedule assignments |
| `/admin/events` | perm: events | Event management |
| `/admin/department` | perm: department | Faculty, programs, achievements |
| `/admin/blogs` | perm: blogs | Blog management |
| `/admin/highlights` | perm: highlights | Gallery management |
| `/admin/assistants` | Admin only | Create/manage assistant accounts |
| `/admin/settings` | perm: settings | Payment account, event config |

---

## Registration & Approval Flow

```
Student visits /register
        ↓
Fills form: name, email, institute, department,
reg number, competition, transaction ID, screenshot URL
        ↓
Request saved → status: "pending"
        ↓
Admin sees pending alert on dashboard
        ↓
Admin opens registration → reviews payment screenshot
        ↓
Admin clicks "Approve & Send Credentials"
        ↓
System:
  1. Creates Supabase Auth user automatically
  2. Generates password (VSpark@XXXXXX)
  3. Sends email via EmailJS with credentials
  4. Updates status to "approved"
        ↓
Student receives email → logs in at /login
        ↓
Student sees digital participation card with QR code
        ↓
On event day → admin scans QR to verify attendance
```

---

## Role & Access Control

### Super Admin
- Hardcoded email in `AdminRoute.js` and `AdminLogin.js`
- Full access to all pages and features
- Can create assistant accounts

### Assistant
- Created via Admin → Assistants page
- Permissions selected by super admin
- Only sees permitted sections in sidebar
- Cannot access unpermitted pages (shows "No Permission" screen)

### Student (Participant)
- Logs in at `/login` (public site) — **never** `/admin/login`
- If student tries `/admin/login` → automatically redirected to `/login`
- If student tries any `/admin/*` URL → redirected to `/card`

### Available assistant permissions
`registrations` · `competitions` · `schedule` · `events` · `department` · `blogs` · `highlights` · `settings`

---

## Email System (EmailJS)

Provider: **EmailJS** (free tier — 200 emails/month)

Configuration in `AdminRegistrations.js`:
```js
const EMAILJS_SERVICE_ID  = 'service_gzvzpnr';
const EMAILJS_TEMPLATE_ID = 'template_5ucrbhb';
const EMAILJS_PUBLIC_KEY  = 'HpOhKt9TbldjRD-wn';
```

Email template variables:
| Variable | Value |
|----------|-------|
| `to_email` | Student's email |
| `student_name` | Student's full name |
| `student_email` | Student's email (displayed in body) |
| `password` | Generated password |
| `competition` | Competition title |
| `site_url` | https://vspark.gulfamali.me |

---

## Digital Participation Card

Each approved student gets a card at `/card` containing:
- Their name, reg number, institute, department
- Competition they registered for
- Assigned room and time slot (if scheduled by admin)
- QR code encoding their registration data
- Download / Print button

QR code is generated via `api.qrserver.com` (free, no API key needed).

On event day, scanning the QR instantly shows the student's registration details for verification.

---

## Schedule System

Admin can:
1. **Create rooms** — name, location, capacity
2. **Create time slots** — label, date, start/end time
3. **Assign competitions** — link competition → room → time slot
4. **Auto-suggest room** — system picks the smallest room that fits registered student count
5. **View occupancy** — live capacity bar per competition

Assigned schedule appears automatically on the student's digital card.

---

## CS Department Page

Three tabs managed entirely from Admin → CS Department:

**Faculty tab** — profile photo, name, designation, specialization, bio, GitHub, LinkedIn, email. HOD is highlighted separately at the top.

**Programs tab** — degree programs with duration, description, and seat count.

**Achievements tab** — admin selects which blog posts appear as "Department Achievements". Clicking an achievement opens the full blog post.

---

## Development Team

| Role | Name | LinkedIn |
|------|------|----------|
| Team Lead | Muhammad Abdullah | https://www.linkedin.com/in/abdullahwale/ |
| Developer | Gulfam Ali (FA23-BSE-030) | https://www.linkedin.com/in/gulfam-a1i/ |
| Developer | Ali Hassan (FA23-BSE-024) | https://www.linkedin.com/in/ali-hassan-45b9b53b0/ |

**Supervisor:** Dr. Tahir Rashid
**Institution:** COMSATS University Islamabad, Vehari Campus

---

## Competitions (8 categories)

| Competition | Fee | Category |
|-------------|-----|----------|
| Speed Programming | PKR 300 | Technical |
| E-Gaming: FIFA | PKR 200 | Gaming |
| E-Gaming: Tekken | PKR 200 | Gaming |
| Web Development | PKR 350 | Technical |
| UI/UX Design | PKR 250 | Creative |
| Prompt Engineering | PKR 200 | AI (NEW) |
| CS Quiz | PKR 150 | Knowledge |
| Poster Designing | PKR 200 | Creative |

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#050810` |
| Accent (cyan) | `#00d4ff` |
| Accent (orange) | `#ff6b00` |
| Accent (purple) | `#7c3aed` |
| Gold | `#ffd700` |
| Text primary | `#e8eaf6` |
| Text secondary | `#8892b0` |
| Font — Display | Bebas Neue |
| Font — Body | Rajdhani |
| Font — Code/Labels | JetBrains Mono |

---

*VSpark — Ignite Your Potential*
*COMSATS University Islamabad, Vehari Campus — Department of Computer Science*
