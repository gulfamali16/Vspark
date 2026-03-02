-- ============================================================
-- VSpark 2025 — Supabase Database Setup
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Events Table
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  venue TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Registrations Table
CREATE TABLE registrations (
  id BIGSERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  reg_number TEXT NOT NULL,
  department TEXT,
  event_id BIGINT REFERENCES events(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Blogs Table
CREATE TABLE blogs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Highlights Table
CREATE TABLE highlights (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;

-- Allow public read access to events, blogs, highlights
CREATE POLICY "Public can read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public can read blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public can read highlights" ON highlights FOR SELECT USING (true);

-- Allow public insert for registrations
CREATE POLICY "Anyone can register" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can read registrations" ON registrations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete registrations" ON registrations FOR DELETE USING (auth.role() = 'authenticated');

-- Allow authenticated users (admins) to manage all tables
CREATE POLICY "Admins manage events" ON events USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage blogs" ON blogs USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage highlights" ON highlights USING (auth.role() = 'authenticated');

-- ============================================================
-- Sample Data (optional — for testing)
-- ============================================================

INSERT INTO events (title, description, date, venue) VALUES
('VSpark 2025 — Main Event', 'National-level competition featuring 7 categories. Speed programming, e-gaming, web dev, UI/UX, prompt engineering, quiz, and poster design.', '2025-12-10', 'COMSATS University Islamabad, Vehari Campus'),
('Pre-Event Orientation', 'Orientation session for all registered participants.', '2025-12-05', 'CS Department Auditorium'),
('Registration Deadline', 'Last date to register for VSpark 2025.', '2025-12-08', 'Online');

INSERT INTO blogs (title, content, created_at) VALUES
('Why Prompt Engineering is the Skill of 2025', 'Artificial intelligence has transformed how developers work. With ChatGPT, Claude, and Gemini now mainstream tools, the ability to craft precise, effective prompts has become a critical technical skill. VSpark 2025 introduces Prompt Engineering as a new competitive category — here is why that matters for your career.', '2025-11-01'),
('CUI Vehari Wins 1st Place in E-Gaming at Byte & Battle', 'In a thrilling display of skill and teamwork, students from COMSATS University Islamabad Vehari Campus secured first position in the E-Gaming category at the regional Byte and Battle competition. Our team demonstrated exceptional strategy in both FIFA and Tekken rounds.', '2025-10-15');

INSERT INTO highlights (image_url, description) VALUES
('https://via.placeholder.com/600x400/050810/00d4ff?text=Speed+Programming', 'Speed Programming Competition 2024'),
('https://via.placeholder.com/600x400/050810/7c3aed?text=E-Gaming+Finals', 'E-Gaming Championship Finals');

