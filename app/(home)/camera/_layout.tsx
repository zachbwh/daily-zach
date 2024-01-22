import { StyleSheet, View } from "react-native";
import React from "react";
import { Slot } from "expo-router";

const Layout: React.FC = () => {
  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
