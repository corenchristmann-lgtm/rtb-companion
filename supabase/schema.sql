-- RTB Companion — Full Schema

CREATE TABLE IF NOT EXISTS challenges (
  id SERIAL PRIMARY KEY,
  position INTEGER NOT NULL,
  company TEXT NOT NULL,
  emoji TEXT,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  challenge_description TEXT NOT NULL,
  format TEXT NOT NULL,
  skills TEXT[],
  tips TEXT[],
  briefing_notes TEXT,
  jury TEXT[],
  contact_name TEXT,
  contact_phone TEXT,
  prize TEXT DEFAULT '1 000 €',
  transport_to_next TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  members TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS checklist_items (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER REFERENCES challenges(id),
  label TEXT NOT NULL,
  is_checked BOOLEAN DEFAULT FALSE,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  challenge_id INTEGER REFERENCES challenges(id),
  score INTEGER CHECK (score >= 1 AND score <= 5),
  free_notes TEXT,
  strength TEXT,
  improvement TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, challenge_id)
);

CREATE TABLE IF NOT EXISTS challenge_status (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER REFERENCES challenges(id) UNIQUE,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_transit', 'active', 'completed')),
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ
);

-- RLS policies (open for single-user app)
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on challenges" ON challenges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on checklist_items" ON checklist_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on notes" ON notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on challenge_status" ON challenge_status FOR ALL USING (true) WITH CHECK (true);
