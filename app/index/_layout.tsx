import { View, Text } from "@gluestack-ui/themed";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "expo-router";

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
    <View>
      <Text>Test</Text>
      <Link href="/posts">Posts</Link>
      <Link href="/posts/test">Posts 2</Link>
      <Link href="/camera">Camera</Link>
    </View>
  );
}
