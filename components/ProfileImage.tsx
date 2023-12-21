import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ImageSourcePropType,
} from "react-native";
import { User } from "lucide-react-native";
import React from "react";

type ProfileImageProps = {
  imageSource: ImageSourcePropType | null;
};

const ProfileImage: React.FC<ProfileImageProps> = ({ imageSource }) => {
  let profileImage = (
    <View style={styles.logoContainer}>
      <User style={styles.image} size="80%" />
    </View>
  );
  if (imageSource) {
    profileImage = <Image style={styles.image} source={imageSource} />;
  }

  return (
    <TouchableOpacity style={styles.container}>{profileImage}</TouchableOpacity>
  );
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
    color: "white",
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
