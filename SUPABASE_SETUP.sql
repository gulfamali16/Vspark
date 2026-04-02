-- ============================================================
-- VSpark v2 — Complete Supabase Setup
-- Run this ENTIRE file in Supabase SQL Editor
-- ============================================================

-- 1. Competitions Table (with fee, date announcement)
CREATE TABLE IF NOT EXISTS competitions (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Technical',
  short_desc TEXT,
  fee INTEGER DEFAULT 0,
  color TEXT DEFAULT '#00d4ff',
  rules TEXT,
  prizes TEXT,
  is_active BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  date_announced BOOLEAN DEFAULT false,
  event_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Registration Requests Table (replaces old registrations)
CREATE TABLE IF NOT EXISTS registration_requests (
  id BIGSERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  reg_number TEXT NOT NULL,
  institute TEXT NOT NULL,
  department TEXT,
  competition_id BIGINT REFERENCES competitions(id) ON DELETE SET NULL,
  fee_amount INTEGER DEFAULT 0,
  transaction_id TEXT NOT NULL,
  screenshot_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  temp_password TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Credential Notifications (track emails to send)
CREATE TABLE IF NOT EXISTS credential_notifications (
  id BIGSERIAL PRIMARY KEY,
  reg_id BIGINT REFERENCES registration_requests(id),
  email TEXT NOT NULL,
  student_name TEXT,
  temp_password TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Events Table
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  time TEXT,
  venue TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Highlights Table
CREATE TABLE IF NOT EXISTS highlights (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Results Table (Competition Results with Rankings)
CREATE TABLE IF NOT EXISTS competition_results (
  id BIGSERIAL PRIMARY KEY,
  competition_id BIGINT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  first_place TEXT,
  first_place_info TEXT,
  second_place TEXT,
  second_place_info TEXT,
  third_place TEXT,
  third_place_info TEXT,
  result_description TEXT,
  result_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  announced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Site Settings Table (key-value store)
CREATE TABLE IF NOT EXISTS site_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE credential_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read competitions" ON competitions FOR SELECT USING (is_active = true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public read highlights" ON highlights FOR SELECT USING (true);
CREATE POLICY "Public read results" ON competition_results FOR SELECT USING (is_published = true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- Public can submit registration requests
CREATE POLICY "Anyone can submit request" ON registration_requests FOR INSERT WITH CHECK (true);

-- Authenticated (admin) full access
CREATE POLICY "Admin all competitions" ON competitions USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all reg requests" ON registration_requests USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all notifications" ON credential_notifications USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all events" ON events USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all blogs" ON blogs USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all highlights" ON highlights USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all results" ON competition_results USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all settings" ON site_settings USING (auth.role() = 'authenticated');

-- ============================================================
-- Seed Default Competitions
-- ============================================================
INSERT INTO competitions (title, category, short_desc, fee, color, rules, prizes, is_active, is_new) VALUES
('Speed Programming', 'Technical', 'Race against time solving algorithmic challenges', 300, '#00d4ff', 'Solo or teams of 2
IDEs are allowed
No internet access
3 problems in 2 hours
Judged by correctness & speed', '1st: PKR 10,000
2nd: PKR 6,000
3rd: PKR 3,000', true, false),
('E-Gaming: FIFA', 'Gaming', 'Battle in FIFA tournaments — claim your throne', 200, '#7c3aed', 'Single elimination bracket
Default console settings
FIFA: 6-minute halves
No custom controllers', '1st: PKR 8,000
2nd: PKR 5,000
3rd: PKR 2,500', true, false),
('E-Gaming: Tekken', 'Gaming', 'Battle in Tekken — best fighter wins', 200, '#7c3aed', 'Single elimination
Best of 3 rounds
Default characters allowed
No modded controllers', '1st: PKR 8,000
2nd: PKR 5,000
3rd: PKR 2,500', true, false),
('Web Development', 'Technical', 'Build a stunning website under pressure', 350, '#ff6b00', 'Teams of up to 3
4-hour time limit
HTML/CSS/JS only
Theme given on day', '1st: PKR 12,000
2nd: PKR 7,000
3rd: PKR 4,000', true, false),
('UI/UX Design', 'Creative', 'Design beautiful interfaces in Figma', 250, '#ffd700', 'Solo competition
Figma or Adobe XD
3-hour design sprint
Present to judges', '1st: PKR 9,000
2nd: PKR 5,500
3rd: PKR 3,000', true, false),
('Prompt Engineering', 'AI', 'Master AI communication and prompting', 200, '#00ff88', 'Solo or pair
ChatGPT/Claude provided
5 challenge rounds
Scored on output quality', '1st: PKR 8,000
2nd: PKR 5,000
3rd: PKR 2,500', true, true),
('CS Quiz', 'Knowledge', 'Test your CS knowledge vs the best', 150, '#ff3d77', 'Teams of 2
MCQ + Rapid fire rounds
Buzzer system
45-minute session', '1st: PKR 6,000
2nd: PKR 4,000
3rd: PKR 2,000', true, false),
('Poster Designing', 'Creative', 'Create compelling visual art on a CS theme', 200, '#00d4ff', 'Solo
Any design tool
3-hour limit
A3 size output', '1st: PKR 5,000
2nd: PKR 3,000
3rd: PKR 1,500', true, false);

-- Seed Events
INSERT INTO events (title, description, date, time, venue) VALUES
('VSpark Main Event', 'National-level competition featuring 8 categories including speed programming, e-gaming, web development, UI/UX design, prompt engineering, quiz competition, and poster designing.', '2025-12-10', '08:00 AM', 'COMSATS University Islamabad, Vehari Campus'),
('Registration Deadline', 'Last date to submit your registration request and payment.', '2025-12-08', '11:59 PM', 'Online');

-- Seed Site Settings
INSERT INTO site_settings (key, value) VALUES
('payment_account', '03XX-XXXXXXX'),
('payment_account_name', 'JazzCash'),
('payment_account_title', 'VSpark COMSATS Vehari'),
('event_date', '2025-12-10'),
('event_venue', 'COMSATS University Islamabad, Vehari Campus'),
('event_status', 'registration_open'),
('site_email', 'vspark@cuivehari.edu.pk')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- IMPORTANT MANUAL STEPS (see README)
-- ============================================================
-- 1. Enable Email Auth in Supabase Authentication settings
-- 2. Create admin user in Authentication > Users
-- 3. Enable "service_role" for admin user creation
-- 4. Configure SMTP for sending credential emails (optional)
-- ============================================================

-- ============================================================
-- MIGRATION: Add University & Prize Fields (Run if needed)
-- ============================================================
-- Uncomment and run these if the columns don't exist:
-- ALTER TABLE competition_results ADD COLUMN IF NOT EXISTS first_university TEXT;
-- ALTER TABLE competition_results ADD COLUMN IF NOT EXISTS second_university TEXT;
-- ALTER TABLE competition_results ADD COLUMN IF NOT EXISTS third_university TEXT;
-- ALTER TABLE competition_results ADD COLUMN IF NOT EXISTS cash_prize TEXT;
-- ============================================================

-- ============================================================
-- MIGRATION: Remove Description from Highlights (Run if needed)
-- ============================================================
-- Uncomment and run this to remove the description column:
-- ALTER TABLE highlights DROP COLUMN IF EXISTS description;
-- ============================================================
