import { FC, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import CustomTextInput from "@components/CustomTextInput";
import CustomButton, { buttonStyles } from "@components/CustomButton";
import ProfileImage from "@components/ProfileImage";
import ViewFinder from "@components/Viewfinder";
import { ImageResult } from "expo-image-manipulator";
import { updateProfileImage } from "@lib/updateProfileImage";
import { useUpdateUser, useCurrentUser } from "@lib/react-query/user";

const Profile: FC = () => {
  const [name, setName] = useState<string>("");
  const [viewfinderOn, setViewfinderOn] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: user, isLoading } = useCurrentUser();
  useEffect(() => {
    if (user) {
      setName(user.display_name);
    }
  }, [user]);
  const { mutate: updateUser } = useUpdateUser();

  const submit = useCallback(async () => {
    setLoading(true);
    try {
      await updateUser({ user: { display_name: name }, userId: user?.id });
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [name]);

  const submitProfileImage = async (picture: ImageResult) => {
    setLoading(true);
    try {
      await updateProfileImage(picture);
      setViewfinderOn(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="white" />
      </View>
    );
  }
  if (viewfinderOn) {
    return (
      <View style={styles.container}>
        <ViewFinder
          onPictureCaptured={submitProfileImage}
          cameraWrapperStyle={styles.cameraWrapper}
          dimensionsConfig={{
            aspectRatio: "1:1",
            height: 900,
            width: 900,
          }}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.profileImageWrapper}>
        <ProfileImage
          imageSource={
            user?.profile_image_url ? { uri: user?.profile_image_url } : null
          }
          onPress={() => {
            setViewfinderOn(true);
          }}
        />
      </View>
      <CustomTextInput
        autoCapitalize="words"
        autoComplete="name"
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      <CustomButton disabled={loading} loading={loading} onPress={submit}>
        <Text style={buttonStyles.primaryButtonText}>Update Details</Text>
      </CustomButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: "#000000",
    gap: 16,
    padding: 8,
  },
  icon: {
    color: "yellow",
  },
  text: {
    color: "white",
  },
  loadingContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  profileImageWrapper: {
    height: 120,
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  cameraWrapper: {
    borderRadius: 500,
    overflow: "hidden",
    aspectRatio: 1,
    width: "100%",
  },
});

export default Profile;
