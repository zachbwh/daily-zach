import { StyleSheet } from "react-native";
import React from "react";
import { Slot } from "expo-router";
import { View } from "@gluestack-ui/themed";

const Layout: React.FC = () => {
  return (
    <View style={styles.container} backgroundColor="black" >
      <Slot />
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
