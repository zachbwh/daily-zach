import { StyleSheet } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";
import { Camera, GalleryHorizontalEnd, User } from "lucide-react-native";
import { usePushNotifications } from "@lib/usePushNotifications";

const Layout: React.FC = () => {
  const pn = usePushNotifications();
  return (
    <Stack
      initialRouteName="/posts"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000",
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="posts"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="camera"
        options={{
          title: "Camera",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: "Account",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarIcon: {
    color: "white",
  },
});
