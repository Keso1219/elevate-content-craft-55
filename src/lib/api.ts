import { supabase } from "@/integrations/supabase/client";
import type { AgentRequest, AgentResponse } from "@/types/agent";

export async function callAgent(payload: AgentRequest): Promise<AgentResponse> {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session?.session?.access_token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await supabase.functions.invoke('agent', {
      body: payload,
      headers: {
        Authorization: `Bearer ${session.session.access_token}`,
      },
    });

    if (response.error) {
      throw new Error(response.error.message || 'Agent request failed');
    }

    return response.data;
  } catch (error) {
    console.error("Agent API error:", error);
    throw error;
  }
}

// Helper functions for database operations
export async function savePostToLibrary(content: string, platforms: string[], style?: string) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      content,
      platforms,
      style,
      status: 'draft',
      source: 'generated'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function schedulePost(content: string, platforms: string[], scheduledAt: string, style?: string) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      content,
      platforms,
      style,
      status: 'scheduled',
      scheduled_at: scheduledAt,
      source: 'generated'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveLeadMagnet(title: string, type: string, content: string, hooks?: string[]) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('lead_magnets')
    .insert({
      user_id: user.id,
      title,
      type,
      content,
      hooks
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveEmail(subject: string, body: string, emailType?: string, segmentId?: string) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('emails')
    .insert({
      user_id: user.id,
      subject,
      body,
      email_type: emailType,
      segment_id: segmentId
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}