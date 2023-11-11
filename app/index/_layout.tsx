import { Text, View } from "@gluestack-ui/themed";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "expo-router";
import { Platform, StatusBar, StyleSheet } from "react-native";

const App: React.FC = () => {
  const [, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View style={styles.safeContainer} backgroundColor="black">
      <Text>Test</Text>
      <Link href="/posts">
        <Text>Posts</Text>
      </Link>
      <Link href="/camera">
        <Text>Camera</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default App;
