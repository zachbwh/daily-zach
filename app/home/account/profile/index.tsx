import { FC, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { supabase } from "@lib/supabase";
import CustomTextInput from "@components/CustomTextInput";
import CustomButton, { buttonStyles } from "@components/CustomButton";
import ProfileImage from "@components/ProfileImage";
import ViewFinder from "@components/Viewfinder";
import { ImageResult } from "expo-image-manipulator";
import { updateProfileImage } from "@lib/updateProfileImage";

type User = {
  id: string;
  user_id: string;
  display_name: string;
  profile_image_url?: string;
};

const Profile: FC = () => {
  const [name, setName] = useState<string>("");
  const [user, setUser] = useState<User>();
  const [viewfinderOn, setViewfinderOn] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = useCallback(async () => {
    setLoading(true);
    console.log("submitting information");
    const { data: upsertData, error: upsertError } = await supabase
      .from("users")
      .update({ display_name: name })
      .eq("id", user?.id);
    setLoading(false);
    console.log(upsertData, upsertError);
  }, [name]);

  const submitProfileImage = async (picture: ImageResult) => {
    setLoading(true);
    try {
      const publicUrl = await updateProfileImage(picture);
      setViewfinderOn(false);
      if (user) {
        setUser({ ...user, profile_image_url: publicUrl });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    supabase
      .from("users")
      .select("id, user_id, display_name, profile_image_url")
      .limit(1)
      .then((data) => {
        console.log(data);
        if (data.data) {
          const user = data.data[0];
          setUser(user);
          setName(user.display_name || "");
        }
      });
  }, []);
  if (!user) {
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
