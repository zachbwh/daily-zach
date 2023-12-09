import { Platform, SafeAreaView, StyleSheet, StatusBar } from "react-native";

const SafeAndroidView: React.FC<{children: React.ReactElement}> = ({children}) => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
});

export default SafeAndroidView;
