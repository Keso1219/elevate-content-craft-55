-- A) Stronger ownership: FK to auth.users (using DO block since IF NOT EXISTS isn't supported for FK)
DO $$
BEGIN
  ALTER TABLE lead_magnet_ideas
  ADD CONSTRAINT lead_magnet_ideas_user_fk
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- E) Default for sources jsonb
ALTER TABLE lead_magnet_ideas
ALTER COLUMN sources SET DEFAULT '{}'::jsonb;

-- (Optional nicety) updated_at on ideas
ALTER TABLE lead_magnet_ideas ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- B) updated_at trigger for posts (and ideas)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END$$;

DROP TRIGGER IF EXISTS trg_posts_set_updated_at ON posts;
CREATE TRIGGER trg_posts_set_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_lmi_set_updated_at ON lead_magnet_ideas;
CREATE TRIGGER trg_lmi_set_updated_at
BEFORE UPDATE ON lead_magnet_ideas
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- C) Scheduling integrity (status 'scheduled' needs scheduled_at)
DO $$
BEGIN
  ALTER TABLE posts
  ADD CONSTRAINT posts_scheduled_requires_time
  CHECK (status <> 'scheduled' OR scheduled_at IS NOT NULL);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END$$;

-- D) Calendar-friendly indexes
CREATE INDEX IF NOT EXISTS posts_user_schedule_idx
  ON posts (user_id, scheduled_at)
  WHERE status = 'scheduled';

CREATE INDEX IF NOT EXISTS posts_user_status_idx
  ON posts (user_id, status);

-- F) RLS for posts (skip if you already have these)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY posts_owner_select ON posts
    FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY posts_owner_insert ON posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY posts_owner_update ON posts
    FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY posts_owner_delete ON posts
    FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;