import { FC, useEffect } from "react";
import { supabase } from "@lib/supabase";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { usePathname, useRouter } from "expo-router";

const Index: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then((response) => {
      if (response.data.session) {
        if (["/", ""].includes(pathname)) {
          console.log("found session, directing to /posts!");
          router.replace("/posts");
        } else {
          console.log(
            "Non initial route found, not redirecting so deep linking works"
          );
        }
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
