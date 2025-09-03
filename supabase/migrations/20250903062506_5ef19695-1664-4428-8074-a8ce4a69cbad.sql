-- Add source column to vault_docs to distinguish between uploads and CRM-derived docs
ALTER TABLE vault_docs 
ADD COLUMN IF NOT EXISTS source text 
CHECK (source IN ('upload', 'crm')) 
DEFAULT 'upload';