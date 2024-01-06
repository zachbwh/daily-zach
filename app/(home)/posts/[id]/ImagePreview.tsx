import { FC } from "react";
import { Image, StyleSheet, View } from "react-native";

type ImagePreviewProps = {
  imageUrl: string;
};

const ImagePreview: FC<ImagePreviewProps> = ({ imageUrl }) => {
  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    margin: "auto",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
  },
  imagePreview: {
    aspectRatio: 3 / 4,
    width: "100%",
    borderRadius: 16,
  },
});

export default ImagePreview;
