import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@lib/react-query/client";
import * as Sentry from "@sentry/react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

Sentry.init({
  dsn: "https://610ad180f152a1fabe2dee1656411a65@o4506469600526336.ingest.sentry.io/4506469664292864",
});

const Layout: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ActionSheetProvider useCustomActionSheet={true}>
        <View style={styles.safeContainer}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              headerStyle: {
                backgroundColor: "#000000",
              },
              headerTintColor: "#fff",
              statusBarColor: "#000000",
            }}
          >
            <Stack.Screen
              name="(home)"
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
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="signup"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </View>
      </ActionSheetProvider>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
});

export default Sentry.wrap(Layout);
