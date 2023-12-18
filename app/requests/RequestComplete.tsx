import { FC, useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

const RequestComplete: FC<{
  imageUrl: string;
  onTapImage: () => void;
}> = ({ imageUrl }) => {
  console.log(imageUrl);
  const animatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1.0,
      duration: 600,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <View style={styles.container}>
      <Animated.Image
        source={{ uri: imageUrl }}
        style={[
          styles.image,
          {
            transform: [
              {
                scale: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.2, 1.5],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 40,
    paddingTop: 48,
    backgroundColor: "blue",
    margin: 40,
  },
  image: {
    shadowColor: "#FFFFFF",
    shadowRadius: 8,
    // width: "auto",
    aspectRatio: 3 / 4,
    backgroundColor: "red",
  },
});

export default RequestComplete;
