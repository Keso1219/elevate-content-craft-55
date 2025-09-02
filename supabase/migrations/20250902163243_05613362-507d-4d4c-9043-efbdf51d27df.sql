-- Create CRM integration tables with proper RLS policies
-- This enables HubSpot integration and Knowledge Vault derivations

-- 1) CRM Connections table
CREATE TABLE IF NOT EXISTS public.crm_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('hubspot','salesforce','pipedrive')),
  access_token TEXT,           -- store encrypted
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scope TEXT,
  status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected','disconnected','error')),
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- 2) CRM Objects (generic envelope per provider)
CREATE TABLE IF NOT EXISTS public.crm_objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES crm_connections(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  object_type TEXT NOT NULL,   -- 'company'|'contact'|'deal'|'note'
  external_id TEXT NOT NULL,   -- provider object id
  data JSONB NOT NULL,
  updated_remote_at TIMESTAMPTZ,
  indexed_at TIMESTAMPTZ,      -- when embedded/derived
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(connection_id, object_type, external_id)
);

-- 3) Sync runs (for observability)
CREATE TABLE IF NOT EXISTS public.crm_sync_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES crm_connections(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running','success','failed')),
  stats JSONB,
  error TEXT
);

-- 4) Knowledge Vault documents table (if not exists)
CREATE TABLE IF NOT EXISTS public.vault_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  doc_type TEXT NOT NULL,  -- 'icp_snapshot'|'company_profile'|'persona'|'objection_library'|'deal_summary'
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(1536),  -- for semantic search
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5) Vault source linking (traceability of derived docs)
CREATE TABLE IF NOT EXISTS public.vault_source_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_doc_id UUID NOT NULL REFERENCES vault_docs(id) ON DELETE CASCADE,
  crm_object_id UUID NOT NULL REFERENCES crm_objects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(vault_doc_id, crm_object_id)
);

-- Enable RLS on all tables
ALTER TABLE public.crm_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_sync_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_source_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crm_connections
CREATE POLICY "Users can manage their own CRM connections" ON public.crm_connections
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for crm_objects
CREATE POLICY "Users can access CRM objects from their connections" ON public.crm_objects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM crm_connections c
      WHERE c.id = crm_objects.connection_id AND c.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM crm_connections c
      WHERE c.id = crm_objects.connection_id AND c.user_id = auth.uid()
    )
  );

-- RLS Policies for crm_sync_runs
CREATE POLICY "Users can view their own sync runs" ON public.crm_sync_runs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM crm_connections c
      WHERE c.id = crm_sync_runs.connection_id AND c.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM crm_connections c
      WHERE c.id = crm_sync_runs.connection_id AND c.user_id = auth.uid()
    )
  );

-- RLS Policies for vault_docs
CREATE POLICY "Users can manage their own vault documents" ON public.vault_docs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for vault_source_records
CREATE POLICY "Users can access vault source links for their documents" ON public.vault_source_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM vault_docs v
      JOIN crm_objects o ON o.id = vault_source_records.crm_object_id
      JOIN crm_connections c ON c.id = o.connection_id
      WHERE v.id = vault_source_records.vault_doc_id
        AND v.user_id = auth.uid()
        AND c.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM vault_docs v
      JOIN crm_objects o ON o.id = vault_source_records.crm_object_id
      JOIN crm_connections c ON c.id = o.connection_id
      WHERE v.id = vault_source_records.vault_doc_id
        AND v.user_id = auth.uid()
        AND c.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_crm_connections_user_id ON crm_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_objects_connection_id ON crm_objects(connection_id);
CREATE INDEX IF NOT EXISTS idx_crm_objects_external_id ON crm_objects(external_id);
CREATE INDEX IF NOT EXISTS idx_crm_sync_runs_connection_id ON crm_sync_runs(connection_id);
CREATE INDEX IF NOT EXISTS idx_vault_docs_user_id ON vault_docs(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_docs_doc_type ON vault_docs(doc_type);
CREATE INDEX IF NOT EXISTS idx_vault_source_records_vault_doc_id ON vault_source_records(vault_doc_id);
CREATE INDEX IF NOT EXISTS idx_vault_source_records_crm_object_id ON vault_source_records(crm_object_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_crm_connections_updated_at BEFORE UPDATE ON crm_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_objects_updated_at BEFORE UPDATE ON crm_objects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vault_docs_updated_at BEFORE UPDATE ON vault_docs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();