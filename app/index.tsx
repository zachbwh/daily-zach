import { FC, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { Loader2Icon } from "lucide-react-native";
import { View, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";

const Index: FC = () => {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then((response) => {
      if (response.data.session) {
        console.log("found session, directing to /home!");
        router.replace("/home/posts");
      } else {
        router.replace("/login");
      }
    });
  }, []);

  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [spinAnim]);

  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinAnim.interpolate<string>({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Loader2Icon style={styles.loadingIcon} />
      </Animated.View>
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
  loadingIcon: {
    color: "white",
  },
});

export default Index;
