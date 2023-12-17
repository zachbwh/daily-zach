import { FC, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { View, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import SafeAndroidView from "../../../components/SafeAndroidView";
import CustomButton, { buttonStyles } from "../../../components/CustomButton";
import ViewFinder from "../../../components/Viewfinder";
import { ImageResult } from "expo-image-manipulator";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

const ProfileImage: FC = () => {
  const [viewfinderOn, setViewfinderOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

  const submit = async (picture: ImageResult) => {
    setLoading(true);
    const url = picture.uri;
    console.log(url);

    const postId = uuidv4();
    const fileName = `${postId}.jpeg`;
    const base64 = await FileSystem.readAsStringAsync(picture.uri, {
      encoding: "base64",
    });

    const arrayBuffer = decode(base64 || "");

    const { data, error } = await supabase.storage
      .from("users")
      .upload(fileName, arrayBuffer, {
        contentType: "image/jpeg",
      });
    if (error) {
      console.error("failed to upload image", error);
      // Handle error
      return;
    }
    console.log("uploaded image", data);

    const { data: publicUrlData } = supabase.storage
      .from("users")
      .getPublicUrl(fileName);

    const sessionResp = await supabase.auth.getSession();
    if (sessionResp.error) {
      console.log("failed to get session ", sessionResp.error);
    }
    const session = sessionResp.data.session;
    if (session === null) {
      console.log("session is null");
      return;
    }
    console.log("submitting information");
    const { error: upsertError } = await supabase
      .from("users")
      .update({ profile_image_url: publicUrlData.publicUrl })
      .eq("user_id", session.user.id);
    setLoading(false);
    if (upsertError) {
      console.log(upsertError);
    } else {
      router.replace("/signup/requestdemo");
    }
  };
  if (viewfinderOn) {
    return (
      <View style={styles.container}>
        <ViewFinder
          onPictureCaptured={submit}
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
    <SafeAndroidView>
      <View style={[styles.container, { paddingTop: 120 }]}>
        <Text style={styles.header}>Selfie time!</Text>
        <Text style={styles.subtitle}>it's only fair</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <CustomButton
          disabled={loading}
          loading={loading}
          onPress={() => {
            setViewfinderOn(true);
          }}
        >
          <Text style={buttonStyles.primaryButtonText}>Twist my arm</Text>
        </CustomButton>
        <CustomButton
          type="secondary"
          onPress={() => {
            router.replace("/signup/requestdemo");
          }}
        >
          <Text style={buttonStyles.secondaryButtonText}>Maybe later..</Text>
        </CustomButton>
      </View>
    </SafeAndroidView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000000",
    gap: 16,
  },
  header: {
    color: "white",
    fontWeight: "bold",
    fontSize: 32,
  },
  subtitle: {
    color: "#CCCCCC",
    fontWeight: "500",
    fontSize: 16,
    paddingBottom: 48,
  },
  error: {
    color: "#CCCCCC",
    paddingTop: 8,
  },
  cameraWrapper: {
    borderRadius: 500,
    overflow: "hidden",
    aspectRatio: 1,
    width: "100%",
  },
});

export default ProfileImage;
