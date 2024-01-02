import { FC, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  ImageSourcePropType,
  Text,
} from "react-native";
import CustomButton, { buttonStyles } from "@components/CustomButton";

const RequestComplete: FC<{
  image: ImageSourcePropType;
  onNext: () => void;
}> = ({ image, onNext }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1.0,
      duration: 1500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Animated.Image
          source={image}
          resizeMethod="resize"
          style={[
            styles.image,
            {
              transform: [
                {
                  scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.0],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
      <Text style={styles.caption}>Your Latest Zach!</Text>
      <View style={styles.ctaWrapper}>
        <CustomButton
          onPress={() => {
            onNext();
          }}
        >
          <Text style={buttonStyles.primaryButtonText}>See more Zachs!</Text>
        </CustomButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flex: 1,
    width: "100%",
  },
  imageContainer: {
    shadowColor: "#FFFFFF",
    shadowRadius: 24,
    shadowOpacity: 0.6,
    aspectRatio: 3 / 4,
    padding: 40,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  image: {
    borderRadius: 16,
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
  },
  ctaWrapper: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingBottom: 48,
    width: "100%",
  },
  caption: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 24,
  },
});

export default RequestComplete;
