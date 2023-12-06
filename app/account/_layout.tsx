import { StyleSheet } from "react-native";
import React from "react";
import { View } from "@gluestack-ui/themed";
import { Slot } from "expo-router";

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
