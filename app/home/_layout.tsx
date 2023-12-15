import { StyleSheet } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Camera, GalleryHorizontalEnd, User } from "lucide-react-native";
import { usePushNotifications } from "../../lib/usePushNotifications";

const Layout: React.FC = () => {
  const pn = usePushNotifications();
  return (
    <Tabs
      initialRouteName="/posts"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000",
        },
        headerTintColor: "#fff",
        tabBarActiveBackgroundColor: "#000",
        tabBarInactiveBackgroundColor: "#000",
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#fff",
      }}
      sceneContainerStyle={{ backgroundColor: "black" }}
    >
      <Tabs.Screen
        name="posts"
        options={{
          tabBarLabel: "Zachs",
          title: "Zachs",
          tabBarIcon: () => <GalleryHorizontalEnd style={styles.tabBarIcon} />,
        }}
      />

      <Tabs.Screen
        name="camera"
        options={{
          tabBarLabel: "Camera",
          title: "Camera",
          tabBarIcon: () => <Camera style={styles.tabBarIcon} />,
          unmountOnBlur: true,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarLabel: "Account",
          title: "Account",
          tabBarIcon: () => <User style={styles.tabBarIcon} />,
        }}
      />
    </Tabs>
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
