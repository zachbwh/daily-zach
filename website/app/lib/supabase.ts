import { createClient } from "@supabase/supabase-js";

export const supabaseMachineClient = createClient(
  // Supabase API URL - env var exported by default when deployed.
  process.env.SUPABASE_URL || "",
  // Supabase SERVICE ROLE KEY - Bypasses row level security
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);
