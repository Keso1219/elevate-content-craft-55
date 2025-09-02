// CRM-related TypeScript types

export interface CrmConnection {
  id: string;
  user_id: string;
  provider: string; // More flexible to handle database results
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  scope?: string;
  status: string; // More flexible to handle database results
  last_sync_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CrmObject {
  id: string;
  connection_id: string;
  provider: string;
  object_type: 'company' | 'contact' | 'deal' | 'note';
  external_id: string;
  data: Record<string, any>;
  updated_remote_at?: string;
  indexed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CrmSyncRun {
  id: string;
  connection_id: string;
  started_at: string;
  finished_at?: string;
  status: 'running' | 'success' | 'failed';
  stats?: Record<string, any>;
  error?: string;
}

export interface VaultDoc {
  id: string;
  user_id: string;
  title: string;
  content: string;
  doc_type: string; // More flexible to handle database results
  tags?: string[];
  metadata?: any; // Handle Json type from database
  embedding?: any; // Handle vector type from database
  created_at: string;
  updated_at: string;
}

export interface VaultSourceRecord {
  id: string;
  vault_doc_id: string;
  crm_object_id: string;
  created_at: string;
}

export interface CrmProvider {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
}

export interface CrmStats {
  companies: number;
  contacts: number;
  deals: number;
  notes?: number;
  lastSync?: string;
}

// UI Component Props
export interface CrmConnectionCardProps {
  connection?: CrmConnection;
  provider: CrmProvider;
  stats?: CrmStats;
  onConnect: () => void;
  onSync: () => void;
  onDisconnect: () => void;
}

export interface CrmImportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  connection?: CrmConnection;
  onImport: (config: CrmImportConfig) => void;
}

export interface CrmImportConfig {
  objectTypes: string[];
  autoSync: boolean;
  derivations: string[];
}