-- Posts: extra fields used by Calendar modal
ALTER TABLE posts ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS writing_style text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS language text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS cta text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS translations jsonb;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- Lead Magnet Ideas (brainstorm records, not assets)
CREATE TABLE IF NOT EXISTS lead_magnet_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  format text CHECK (format IN ('checklist','guide','template','webinar','calculator','ebook','playbook','report','other')) DEFAULT 'other',
  audience text,
  problem text,
  promise text,
  sources jsonb,
  status text CHECK (status IN ('idea','validated','parked')) DEFAULT 'idea',
  created_at timestamptz DEFAULT now()
);

-- Link posts to the idea that inspired them
ALTER TABLE posts ADD COLUMN IF NOT EXISTS origin_idea_id uuid REFERENCES lead_magnet_ideas(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS posts_user_created_idx ON posts (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS lmi_user_created_idx ON lead_magnet_ideas (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS posts_origin_idea_idx ON posts (origin_idea_id);

-- RLS
ALTER TABLE lead_magnet_ideas ENABLE ROW LEVEL SECURITY;

-- Lead Magnet Ideas policies
CREATE POLICY "lmi_read" ON lead_magnet_ideas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "lmi_write" ON lead_magnet_ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lmi_update" ON lead_magnet_ideas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "lmi_delete" ON lead_magnet_ideas FOR DELETE USING (auth.uid() = user_id);