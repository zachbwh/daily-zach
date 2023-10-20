import { GluestackUIProvider, Box, Text } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import Auth from "./Auth";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Camera from "./Camera";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <GluestackUIProvider config={config}>
      <Box
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        {!session && <Auth />}
        {session && <Camera />}
      </Box>
    </GluestackUIProvider>
  );
}
