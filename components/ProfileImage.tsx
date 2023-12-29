import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ImageSourcePropType,
  ViewStyle,
} from "react-native";
import { User } from "lucide-react-native";
import React from "react";

type ProfileImageProps = {
  imageSource: ImageSourcePropType | null;
  style?: ViewStyle;
  onPress?: () => void;
};

const ProfileImage: React.FC<ProfileImageProps> = ({
  imageSource,
  onPress,
  style,
}) => {
  let profileImage = (
    <View style={styles.logoContainer}>
      <User style={{ ...styles.image, color: "white" }} size="80%" />
    </View>
  );
  if (imageSource) {
    profileImage = (
      <Image style={styles.image} source={imageSource} resizeMethod="resize" />
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
        {profileImage}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.container, style]}>{profileImage}</View>;
};

export default ProfileImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    aspectRatio: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#222222",
    borderRadius: 50,
    overflow: "hidden",
  },
  logoContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
