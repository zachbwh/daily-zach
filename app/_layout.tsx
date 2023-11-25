import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { SafeAreaView, StyleSheet } from "react-native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { usePushNotifications } from "../lib/usePushNotifications";

const Layout: React.FC = () => {
  const pn = usePushNotifications()
  return (
    <SafeAreaView style={styles.safeContainer}>
      <GluestackUIProvider config={config} colorMode="dark">
      <StatusBar style="light" />
        <Slot />
      </GluestackUIProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1
  },
});

export default Layout;
