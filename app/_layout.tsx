import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { SafeAreaView, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { usePushNotifications } from "../lib/usePushNotifications";
import { Camera, GalleryHorizontalEnd, User } from "lucide-react-native";

const Layout: React.FC = () => {
  const pn = usePushNotifications();
  return (
    <SafeAreaView style={styles.safeContainer}>
      <GluestackUIProvider config={config} colorMode="dark">
        <StatusBar style="light" />
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
              tabBarIcon: () => (
                <GalleryHorizontalEnd style={styles.tabBarIcon} />
              ),
            }}
          />

          <Tabs.Screen
            name="camera"
            options={{
              tabBarLabel: "Camera",
              title: "Camera",
              tabBarIcon: () => <Camera style={styles.tabBarIcon} />,
              unmountOnBlur: true
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
          <Tabs.Screen
            name="auth"
            options={{
              href: null,
            }}
          />
        </Tabs>
      </GluestackUIProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  tabBarIcon: {
    color: "black",
  },
});

export default Layout;
