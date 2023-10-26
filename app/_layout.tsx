import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { Stack } from "expo-router/stack";

const Layout: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <GluestackUIProvider config={config}>
        <Stack>{children}</Stack>
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
