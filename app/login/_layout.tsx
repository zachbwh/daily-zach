import { View, StyleSheet } from "react-native";
import { Slot } from "expo-router";

const Layout: React.FC = () => {
  return (
    <View style={styles.container} >
        <Slot />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
});

export default Layout;
