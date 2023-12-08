import { StyleSheet, Text } from "react-native";
import React from "react";
import { View } from "@gluestack-ui/themed";
import { Slot, Tabs } from "expo-router";
import { Camera, GalleryHorizontalEnd, User } from "lucide-react-native";

const Layout: React.FC = () => {
  return (
    <Tabs
      initialRouteName="/posts"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000",
        },
        headerTintColor: "#fff",
      }}
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
    color: "black",
  },
});
