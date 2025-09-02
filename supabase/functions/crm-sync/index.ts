import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { objectTypes = ['company', 'contact', 'deal'], mode = 'backfill' } = await req.json();

    // Get user from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from JWT
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid user token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get active CRM connection
    const { data: connection, error: connectionError } = await supabase
      .from('crm_connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'connected')
      .single();

    if (connectionError || !connection) {
      return new Response(JSON.stringify({ error: 'No active CRM connection found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create sync run record
    const { data: syncRun, error: syncError } = await supabase
      .from('crm_sync_runs')
      .insert({
        connection_id: connection.id,
        started_at: new Date().toISOString(),
        status: 'running'
      })
      .select()
      .single();

    if (syncError) {
      console.error('Failed to create sync run:', syncError);
      return new Response(JSON.stringify({ error: 'Failed to start sync' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Simulate sync process (replace with actual HubSpot API calls)
    try {
      // TODO: Implement actual HubSpot API sync
      console.log(`Starting sync for user ${user.id}, objects: ${objectTypes.join(', ')}`);
      
      // Update sync run as completed
      await supabase
        .from('crm_sync_runs')
        .update({ 
          status: 'success', 
          finished_at: new Date().toISOString(),
          stats: { objectTypes, recordsProcessed: 0 }
        })
        .eq('id', syncRun.id);

      return new Response(JSON.stringify({ 
        syncRunId: syncRun.id,
        status: 'completed',
        message: 'Sync process completed successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (syncProcessError) {
      // Update sync run as failed
      await supabase
        .from('crm_sync_runs')
        .update({ 
          status: 'failed', 
          finished_at: new Date().toISOString(),
          error: syncProcessError.message
        })
        .eq('id', syncRun.id);
      
      throw syncProcessError;
    }

  } catch (error) {
    console.error('Sync API error:', error);
    return new Response(JSON.stringify({ error: 'Sync failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});