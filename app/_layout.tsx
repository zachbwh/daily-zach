import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { SafeAreaView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

const Layout: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <GluestackUIProvider config={config} colorMode="dark">
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: "#000000",
            },
            headerTintColor: "#fff",
            statusBarColor: "#000000"
          }}
        >
          <Stack.Screen
            name="home"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              // Set the presentation mode to modal for our modal route.
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="signup"
            options={{
              // Set the presentation mode to modal for our modal route.
              presentation: "modal",
            }}
          />
        </Stack>
      </GluestackUIProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
});

export default Layout;
