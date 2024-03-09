import { FC, useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import SafeAndroidView from "@components/SafeAndroidView";
import CustomButton, { buttonStyles } from "@components/CustomButton";
import ViewFinder from "@components/Viewfinder";
import { ImageResult } from "expo-image-manipulator";
import { updateProfileImage } from "@lib/updateProfileImage";
import { Camera as ExpoCamera } from "expo-camera";

const ProfileImage: FC = () => {
  const [viewfinderOn, setViewfinderOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [permission, requestPermission] = ExpoCamera.useCameraPermissions();
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    if (!permission?.granted && !permissionRequested) {
      setPermissionRequested(true);
      void requestPermission();
    }
  }, [permission]);

  const submit = async (picture: ImageResult) => {
    setLoading(true);
    try {
      await updateProfileImage(picture);
    } catch (error) {
      console.error(error);
    }
    router.replace("/signup/requestdemo");
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
        <Text style={styles.header}>Snap a selfie for me!</Text>
        <Text style={styles.subtitle}>it's only fair</Text>
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
  cameraWrapper: {
    borderRadius: 500,
    overflow: "hidden",
    aspectRatio: 1,
    width: "100%",
  },
});

export default ProfileImage;
