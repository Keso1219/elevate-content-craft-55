export type AgentMode = "chat" | "post" | "lead" | "email";

export interface AgentRequest {
  mode: AgentMode;
  input: string;
  options?: Record<string, any>;
  context?: {
    docIds?: string[];
    scraperIds?: string[];
    segmentId?: string | null;
  };
}

export interface AgentResponse {
  ok: boolean;
  mode: AgentMode;
  data: any;
  raw: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
}

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