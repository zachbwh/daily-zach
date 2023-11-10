import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import React from "react";
import { Slot } from "expo-router";

const Layout: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <Slot />
    </SafeAreaView>
  );
};

export default Layout;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
