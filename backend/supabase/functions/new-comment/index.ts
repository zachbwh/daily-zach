// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type PartialComment = {
  id: string;
  post_id: string;
  user_id: string;
};

Deno.serve(async (req) => {
  const body = await req.json();
  const comment = body.record as PartialComment;
  console.log("comment", comment);

  const supabaseMachineClient = createClient(
    // Supabase API URL - env var exported by default when deployed.
    Deno.env.get("SUPABASE_URL") ?? "",
    // Supabase SERVICE ROLE KEY - Bypasses row level security
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { data: subscribersWithPushTokens, error: subscriberError } =
      await supabaseMachineClient
        .from("post_subscribers")
        .select(
          "users(user_id, push_notification_subscribers(subscription_token))"
        )
        .eq("post_id", comment.post_id)
        .eq("is_subscribed", true);
    // .neq("user_id", comment.user_id);
    console.log({ subscribersWithPushTokens, subscriberError });
    const subscriptionTokens: string[] = [];
    subscribersWithPushTokens
      .filter(({ users }) => users.user_id !== comment.user_id)
      .forEach((subscriber) => {
        subscriber?.users.push_notification_subscribers.forEach(
          (subscriber) => {
            subscriptionTokens.push(subscriber.subscription_token);
          }
        );
      });

    const shouldAddPostSubscriber = !subscribersWithPushTokens.some(
      ({ users }) => users.user_id === comment.user_id
    );
    if (shouldAddPostSubscriber) {
      await supabaseMachineClient.from("post_subscribers").insert({
        user_id: comment.user_id,
        post_id: comment.post_id,
        is_subscribed: true,
      });
    }

    subscriptionTokens.forEach((subscription_token) => {
      fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        body: JSON.stringify({
          to: subscription_token,
          title: "New comment",
          body: "Someone has replied to a Zach selfie you're following",
          data: {
            type: "COMMENT",
            request_id: comment.id,
            url: `/posts/${comment.post_id}`,
          },
        }),
        headers: {
          host: "exp.host",
          accept: "application/json",
          "accept-encoding": "gzip, deflate",
          "content-type": "application/json",
        },
      });
    });

    return new Response("New comment handled sucessfully", {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error handling new comment", error);
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
