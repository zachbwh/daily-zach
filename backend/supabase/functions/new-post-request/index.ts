// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const { name } = await req.json();
  const data = {
    message: `Hello ${name}!`,
  };

  const authHeader = req.headers.get("Authorization")!;
  const supabaseClient = createClient(
    // Supabase API URL - env var exported by default when deployed.
    Deno.env.get("SUPABASE_URL") ?? "",
    // Supabase API ANON KEY - env var exported by default when deployed.
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    // Set the Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    { global: { headers: { Authorization: authHeader } } }
  );

  try {
    const { data, error } = await supabaseClient.from("push_notification_subscribers").select("id, expo_push_token, users!inner(email)").eq('users.email', 'zachbwh@gmail.com');
    console.log({ data, error });

    return new Response(JSON.stringify({ data, error }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/new-post-request' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
