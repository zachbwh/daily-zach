import { useEffect } from "react";
import { StyleSheet, Animated, ViewStyle, StyleProp, Easing } from "react-native";

const ShakeAnimation: React.FC<{
  children: React.ReactElement;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
        // Animation consists of a sequence of steps
        Animated.sequence([
          Animated.timing(animatedValue, {toValue: 0.0, duration: 1000, easing: Easing.linear, useNativeDriver: true}),
          Animated.timing(animatedValue, {toValue: 1.0, duration: 100, easing: Easing.linear, useNativeDriver: true}),
          Animated.timing(animatedValue, {toValue: -1.0, duration: 200, easing: Easing.linear, useNativeDriver: true}),
          // return to begin position
          Animated.timing(animatedValue, {toValue: 0.0, duration: 100, easing: Easing.linear, useNativeDriver: true}),
          Animated.timing(animatedValue, {toValue: 1.0, duration: 100, easing: Easing.linear, useNativeDriver: true}),
          Animated.timing(animatedValue, {toValue: 0.0, duration: 100, easing: Easing.linear, useNativeDriver: true}),
        ])
      ).start(); 
      console.log("starting animation?")
  }, [])

  return (
    <Animated.View
      style={[
        styles.animationContainer,
        style,
        {
          transform: [
            {
              rotate: animatedValue.interpolate({
                inputRange: [-1, 1],
                outputRange: ["-1deg", "1deg"],
              }),
            //   translateY: animatedValue.interpolate({
            //     inputRange: [-1, 1],
            //     outputRange: [-100, 100],
            //   }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    // flex: 1,
  },
});

export default ShakeAnimation;
