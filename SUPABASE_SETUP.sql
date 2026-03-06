-- ============================================================
-- VSpark — Supabase Database Setup
-- Run this entire SQL in your Supabase SQL Editor
-- ============================================================

-- MANUAL SUPABASE STEPS:
-- 1. Run this entire SQL in Supabase SQL Editor
-- 2. In Authentication > Settings: enable Email provider, enable "Confirm Email"
-- 3. In Authentication > Email Templates: customize the confirmation email template
-- 4. In Edge Functions: deploy function named "approve-registration" that:
--    a. Receives { registration_id }
--    b. Creates a Supabase auth user with the student's email and a generated password
--    c. Sends the password to the student's email using Supabase's built-in email or Resend
-- 5. In Authentication > Settings: set Site URL to https://vspark-beta.vercel.app
-- 6. Enable "Leaked Password Protection" for security
-- 7. In Table Editor > registrations: verify all new columns are present
-- 8. In Table Editor > site_settings: set payment_account to your actual account details

-- ============================================================
-- 1. Events Table
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  venue TEXT,
  image_url TEXT,
  category TEXT,
  registration_fee INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add registration_fee column if upgrading from existing schema
ALTER TABLE events ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_fee INTEGER DEFAULT 0;

-- ============================================================
-- 2. Registrations Table
-- ============================================================
CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  institution_type TEXT,
  institution_name TEXT,
  reg_number TEXT,
  department TEXT,
  competition_id BIGINT REFERENCES events(id) ON DELETE SET NULL,
  event_id BIGINT REFERENCES events(id) ON DELETE SET NULL,
  event_name TEXT,
  transaction_id TEXT,
  screenshot_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add new columns if upgrading from existing schema
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS institution_type TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS institution_name TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS transaction_id TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS screenshot_url TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS event_name TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- ============================================================
-- 3. Blogs Table
-- ============================================================
CREATE TABLE IF NOT EXISTS blogs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. Highlights Table
-- ============================================================
CREATE TABLE IF NOT EXISTS highlights (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. Site Settings Table
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert defaults (do nothing if already exists)
INSERT INTO site_settings (key, value) VALUES
  ('event_date', NULL),
  ('event_venue', 'COMSATS University Islamabad, Vehari Campus'),
  ('event_time', 'TBA'),
  ('payment_account', 'JazzCash: 0300-0000000 (Account Title: VSpark)')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 6. Competitions Table (dedicated, separate from events)
-- ============================================================
CREATE TABLE IF NOT EXISTS competitions (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  icon TEXT,
  registration_fee INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public can read blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public can read highlights" ON highlights FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read competitions" ON competitions FOR SELECT USING (true);

-- Allow public insert for registrations
CREATE POLICY "Anyone can register" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can read registrations" ON registrations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update registrations" ON registrations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete registrations" ON registrations FOR DELETE USING (auth.role() = 'authenticated');

-- Allow authenticated users (admins) to manage all tables
CREATE POLICY "Admins manage events" ON events USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage blogs" ON blogs USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage highlights" ON highlights USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage competitions" ON competitions USING (auth.role() = 'authenticated');

-- ============================================================
-- Sample Data (optional — for testing)
-- ============================================================

INSERT INTO events (title, description, date, venue, category, registration_fee) VALUES
('VSpark — Main Event', 'National-level competition featuring 7 categories. Speed programming, e-gaming, web dev, UI/UX, prompt engineering, quiz, and poster design.', '2025-12-10', 'COMSATS University Islamabad, Vehari Campus', 'Main Event', 0),
('Pre-Event Orientation', 'Orientation session for all registered participants.', '2025-12-05', 'CS Department Auditorium', 'Orientation', 0),
('Registration Deadline', 'Last date to register for VSpark.', '2025-12-08', 'Online', 'Deadline', 0)
ON CONFLICT DO NOTHING;

INSERT INTO blogs (title, content, created_at) VALUES
('Why Prompt Engineering is the Skill of the Future', 'Artificial intelligence has transformed how developers work. With ChatGPT, Claude, and Gemini now mainstream tools, the ability to craft precise, effective prompts has become a critical technical skill. VSpark introduces Prompt Engineering as a new competitive category — here is why that matters for your career.', '2025-11-01'),
('CUI Vehari Wins 1st Place in E-Gaming at Byte & Battle', 'In a thrilling display of skill and teamwork, students from COMSATS University Islamabad Vehari Campus secured first position in the E-Gaming category at the regional Byte and Battle competition. Our team demonstrated exceptional strategy in both FIFA and Tekken rounds.', '2025-10-15')
ON CONFLICT DO NOTHING;

INSERT INTO highlights (image_url, description) VALUES
('https://via.placeholder.com/600x400/050810/00d4ff?text=Speed+Programming', 'Speed Programming Competition'),
('https://via.placeholder.com/600x400/050810/7c3aed?text=E-Gaming+Finals', 'E-Gaming Championship Finals')
ON CONFLICT DO NOTHING;
