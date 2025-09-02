import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const url = new URL(req.url);
    const provider = url.searchParams.get('provider') || 'hubspot';

    if (provider !== 'hubspot') {
      return new Response(JSON.stringify({ error: 'Provider not supported' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate state for security
    const state = crypto.randomUUID();
    
    // Construct HubSpot OAuth URL
    const authUrl = new URL('https://app.hubspot.com/oauth/authorize');
    authUrl.searchParams.set('client_id', Deno.env.get('HUBSPOT_CLIENT_ID') || '');
    authUrl.searchParams.set('redirect_uri', `${Deno.env.get('SITE_URL')}/vault?oauth=callback&provider=hubspot`);
    authUrl.searchParams.set('scope', 'crm.objects.companies.read crm.objects.contacts.read crm.objects.deals.read');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('response_type', 'code');

    // Store state in a secure way (you might want to use a database for production)
    const response = new Response(JSON.stringify({ 
      authUrl: authUrl.toString(),
      state 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

    // Set state cookie
    response.headers.set('Set-Cookie', `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`);

    return response;
  } catch (error) {
    console.error('OAuth start error:', error);
    return new Response(JSON.stringify({ error: 'Failed to initiate OAuth flow' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});