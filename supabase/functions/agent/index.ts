// deno-lint-ignore-file no-explicit-any
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini"; // fast, cost-efficient

function corsHeaders(req: Request) {
  const origin = req.headers.get("Origin") ?? "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req) });
  }

  try {
    const { mode, input, options, context } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    // Identify user from JWT
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser(jwt);
    if (userErr || !user) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders(req) });
    }

    // Fetch lightweight RAG context (best-effort; ignore failures)
    async function loadContext() {
      const uid = user.id;
      const docIds = context?.docIds ?? [];
      const scraperIds = context?.scraperIds ?? [];
      const segmentId = context?.segmentId ?? null;

      const pieces: string[] = [];

      // Try to load vault docs
      if (docIds.length) {
        try {
          const { data } = await supabase
            .from("vault_docs")
            .select("title, content")
            .in("id", docIds)
            .eq("user_id", uid)
            .limit(6);
          data?.forEach((d) => pieces.push(`DOC: ${d.title}\n${d.content?.slice(0, 2000)}`));
        } catch (e) {
          console.log("Failed to load vault docs:", e);
        }
      }

      // Try to load scraped items (may not exist)
      if (scraperIds.length) {
        try {
          const { data } = await supabase
            .from("reddit_docs")
            .select("title, content")
            .in("external_id", scraperIds)
            .limit(6);
          data?.forEach((s) => pieces.push(`SCRAPE: ${s.title}\n${s.content?.slice(0, 1500)}`));
        } catch (e) {
          console.log("Failed to load scraped items:", e);
        }
      }

      // Try to load CRM segment (may not exist)
      if (segmentId) {
        try {
          const { data } = await supabase
            .from("crm_objects")
            .select("data")
            .eq("id", segmentId)
            .single();
          if (data?.data) pieces.push(`CRM: ${JSON.stringify(data.data).slice(0, 2000)}`);
        } catch (e) {
          console.log("Failed to load CRM segment:", e);
        }
      }

      return pieces.join("\n\n---\n\n");
    }

    const rag = await loadContext();

    const systemPrompts: Record<string, string> = {
      chat:
        "You are Elev8, an AI content assistant. Answer using the user's brand voice. If context is provided, cite it using [Doc], [Scrape], or [CRM] brackets at the end of paragraphs. Be helpful, concise, and actionable.",
      post:
        "You generate social posts. Return 3-5 concise, platform-optimized variants as a JSON array of strings. Include emoji sparingly and strong hooks. Respect style/tone/length if provided. Format: [\"post1\", \"post2\", \"post3\"]",
      lead:
        "You create lead magnets (checklist, guide, calculator prompt, mini-guide). Be actionable, structured, and concise. Return structured content with clear headings and bullet points. If asked for hooks, also return 3 short hook ideas.",
      email:
        "You write segmented B2B emails. Be clear, benefits-first, include a CTA. Match type (Welcome/Nurture/Re-engage). Return requested number of variants as JSON array with subject and body: [{\"subject\": \"...\", \"body\": \"...\"}]",
    };

    type ChatMsg = { role: "system" | "user" | "assistant"; content: string };
    const messages = [
      { role: "system", content: systemPrompts[mode] ?? systemPrompts.chat },
      rag ? { role: "system", content: `Context:\n${rag}` } : null,
      { role: "user", content: JSON.stringify({ mode, input, options }) },
    ].filter((m): m is ChatMsg => Boolean(m));

    console.log(`Agent request - Mode: ${mode}, User: ${user.id}, Context length: ${rag.length}`);

    const openaiRes = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")!}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.8,
      }),
    });

    if (!openaiRes.ok) {
      const t = await openaiRes.text();
      console.error("OpenAI error:", t);
      return new Response(`OpenAI error: ${t}`, { status: 500, headers: corsHeaders(req) });
    }

    const data = await openaiRes.json();
    const text = data.choices?.[0]?.message?.content ?? "";

    // Persist session
    await supabase.from("agent_sessions").insert({
      user_id: user.id,
      mode,
      input,
      output: text,
      meta: { options, hasContext: Boolean(rag) },
    });

    // OPTIONAL convenience parsing by mode
    let parsed: unknown = text;
    try {
      // If the model returned JSON, parse it
      parsed = JSON.parse(text);
    } catch {
      // leave as plain text
    }

    return new Response(JSON.stringify({ ok: true, mode, data: parsed, raw: text }), {
      headers: { "Content-Type": "application/json", ...corsHeaders(req) },
    });
  } catch (e) {
    console.error("Agent function error:", e);
    return new Response(String(e?.message ?? e), { status: 500, headers: corsHeaders(req) });
  }
});
