// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type User = {
  id: string;
  user_id: string;
  created_at: string;
  display_name: string;
  profile_image_url: string;
  vertical: string;
  is_zach: boolean;
};

Deno.serve(async (req) => {
  const body = await req.json();
  const user = body.old_record as User;
  console.log("deleted user", user);

  const supabaseMachineClient = createClient(
    // Supabase API URL - env var exported by default when deployed.
    Deno.env.get("SUPABASE_URL") ?? "",
    // Supabase SERVICE ROLE KEY - Bypasses row level security
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const profileImagePath = user.profile_image_url.split("/users/")[1];

  console.log("profile image path to delete", profileImagePath);

  const { data, error } = await supabaseMachineClient.storage
    .from("users")
    .remove([profileImagePath]);

  console.error(error);

  return new Response(JSON.stringify({ data, error }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/delete-user' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
