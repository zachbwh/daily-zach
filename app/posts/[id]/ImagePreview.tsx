import { FC } from "react";
import { Image, NativeModules, StyleSheet, View } from "react-native";

type ImagePreviewProps = {
  keyboardOpen: boolean;
  imageUrl: string;
};

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const ImagePreview: FC<ImagePreviewProps> = ({ keyboardOpen, imageUrl }) => {
  return (
    <View
      style={[
        styles.imageContainer,
        {
          height: (keyboardOpen ? 0.6 : 1) * styles.imageContainer.height,
        },
      ]}
    >
      <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    margin: "auto",
    alignItems: "center",
    height: 300,
  },
  imagePreview: {
    aspectRatio: 9 / 16,
    height: "100%",
    borderRadius: 16,
  },
});

export default ImagePreview;
