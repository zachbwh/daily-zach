import { FC, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

const Index: FC = () => {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then((response) => {
      if (response.data.session) {
        console.log("found session, directing to /home!");
        router.replace("/home/posts");
      } else {
        router.replace("/signup");
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator color="#FFFFFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Index;
