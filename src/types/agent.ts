export type AgentMode = "chat" | "post" | "lead" | "email";
export type ArtifactType = "post" | "leadIdea" | "email";

export interface AgentRequest {
  mode: AgentMode;
  input: string;
  options?: Record<string, unknown>;
  context?: {
    docIds?: string[];
    scraperIds?: string[];
    segmentId?: string | null;
  };
}

export interface AgentResponse {
  ok: boolean;
  mode: AgentMode;
  data: unknown;
  raw: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
  mode?: AgentMode;
}

export interface PostRow {
  id: string;
  title: string | null;
  content: string;
  platforms: string[];
  status: "draft" | "scheduled" | "published" | "error";
  scheduled_at: string | null;
  writing_style: string | null;
  language: string | null;
  cta: string | null;
  translations: Record<string, string> | null;
  origin_idea_id?: string | null;
  created_at: string;
  updated_at: string | null;
  user_id: string;
}

export interface LeadMagnetIdeaRow {
  id: string;
  title: string;
  format: "checklist" | "guide" | "template" | "webinar" | "calculator" | "ebook" | "playbook" | "report" | "other";
  audience: string | null;
  problem: string | null;
  promise: string | null;
  sources: { docIds?: string[]; segmentId?: string | null } | null;
  status: "idea" | "validated" | "parked";
  created_at: string;
  user_id: string;
}

export interface EmailRow {
  id: string;
  subject: string;
  body: string;
  email_type: string | null;
  segment_id: string | null;
  created_at: string;
  user_id: string;
}

// Legacy types for backward compatibility
export interface PostVariant {
  id: string;
  content: string;
  platforms: string[];
  style?: string;
  tone?: string;
  length?: string;
}

export interface LeadMagnet {
  id: string;
  title: string;
  type: 'checklist' | 'guide' | 'calculator' | 'mini-guide';
  content: string;
  hooks?: string[];
}

export interface EmailVariant {
  id: string;
  subject: string;
  body: string;
  emailType?: string;
  segmentId?: string;
}
