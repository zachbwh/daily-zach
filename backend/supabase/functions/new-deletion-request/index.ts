// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type PartialDeletionRequest = {
  id: string;
  user_id: string;
};

Deno.serve(async (req) => {
  const body = await req.json();
  const deletionRequest = body.record as PartialDeletionRequest;
  console.log("comment", deletionRequest);

  const supabaseMachineClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    // Should cascade to delete all other related entities
    await supabaseMachineClient.auth.admin.deleteUser(deletionRequest.user_id);

    return new Response("User deleted", {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error handling new deletion request", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
