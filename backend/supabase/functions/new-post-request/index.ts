// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type PostRequest = {
  id: string,
  created_at: string
  requestor_id: string
  status: string
}

Deno.serve(async (req) => {
  console.log("hello");

  const body = await req.json()
  const postRequest = body.record as PostRequest
  console.log("post request", postRequest)

  const supabaseClient = createClient(
    // Supabase API URL - env var exported by default when deployed.
    Deno.env.get("SUPABASE_URL") ?? "",
    // Supabase SERVICE ROLE KEY - Bypasses row level security
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { data, error } = await supabaseClient
      .from("push_notification_subscribers")
      .select("subscription_token")
      // Zach's user id lol
      .eq("user_id", "e35767c0-8e3b-4b15-ae2b-a48044a43cd0");

    console.log({ data, error });
    data?.forEach((token) => {
      fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        body: JSON.stringify({
          to: token.subscription_token,
          title: "Time for a daily Zach!",
          body: "Cyrus wants to see you :)",
        }),
        headers: {
          host: "exp.host",
          accept: "application/json",
          "accept-encoding": "gzip, deflate",
          "content-type": "application/json",
        },
      });
    });

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
