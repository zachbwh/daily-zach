// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type PostRequest = {
  id: string;
  created_at: string;
  requestor_id: string;
  post_id: string;
  status: string;
};

type Message = {
  to: string;
  title: string;
  body: string;
  data: any;
};

Deno.serve(async (req) => {
  const body = await req.json();
  const postRequest = body.record as PostRequest;
  console.log("post request", postRequest);

  if ("ACKNOWLEDGED" !== postRequest.status && !postRequest.post_id) {
    console.log(
      "Post request update does not meet the push notification criteria, return early"
    );
    return new Response(JSON.stringify({ postRequest }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }

  const supabaseMachineClient = createClient(
    // Supabase API URL - env var exported by default when deployed.
    Deno.env.get("SUPABASE_URL") ?? "",
    // Supabase SERVICE ROLE KEY - Bypasses row level security
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { data: pushNotificationTokens, error } = await supabaseMachineClient
      .from("push_notification_subscribers")
      .select("subscription_token")
      .eq("user_id", postRequest.requestor_id);

    const messages: Message[] = pushNotificationTokens?.map((token) => {
      if (postRequest.post_id) {
        return {
          to: token.subscription_token,
          title: "You asked, Zach responded",
          body: "Check out your latest Zach selfie here!",
          data: {
            request_id: postRequest.id,
            url: `/posts/${postRequest.post_id}`,
          },
        };
      } else {
        return {
          to: token.subscription_token,
          title: "Zach Update:",
          body: "Zach is responding to your request, tap here to track his progress",
          data: {
            request_id: postRequest.id,
            url: `/post-requests/${postRequest.id}`,
          },
        };
      }
    });

    console.log({ pushNotificationTokens, error });
    messages?.forEach((message) => {
      fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        body: JSON.stringify(message),
        headers: {
          host: "exp.host",
          accept: "application/json",
          "accept-encoding": "gzip, deflate",
          "content-type": "application/json",
        },
      });
    });

    return new Response(JSON.stringify({ pushNotificationTokens, error }), {
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
