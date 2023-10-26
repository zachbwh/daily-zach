import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { SafeAreaView, StyleSheet } from "react-native";
import { Slot } from "expo-router";

const Layout: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <GluestackUIProvider config={config}>
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
