import { Camera as ExpoCamera, CameraType } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  View,
  Image,
  Animated,
  Easing,
  Text,
} from "react-native";
import { Circle, Check, X } from "lucide-react-native";
import React from "react";
import { ActivityIndicator } from "react-native";
import {
  FlipType,
  ImageResult,
  SaveFormat,
  manipulateAsync,
} from "expo-image-manipulator";

type ViewFinderProps = {
  onPictureCaptured: (picture: ImageResult) => Promise<void>;
  dimensionsConfig?: {
    aspectRatio: string;
    height: number;
    width: number;
  };
  cameraWrapperStyle?: StyleProp<ViewStyle>;
};

const ViewFinder: React.FC<ViewFinderProps> = ({
  onPictureCaptured,
  dimensionsConfig = {
    aspectRatio: "4:3",
    height: 1200,
    width: 900,
  },
  cameraWrapperStyle = styles.cameraContainer,
}) => {
  const [cameraReady, setCameraReady] = useState(false);
  const [pictureConfirmed, setPictureConfirmed] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [picture, setPicture] = useState<ImageResult | undefined>();
  let cameraRef = useRef<ExpoCamera>();
  const [permission, requestPermission] = ExpoCamera.useCameraPermissions();

  useEffect(() => {
    if (!permission?.granted && !permissionRequested) {
      setPermissionRequested(true);
      void requestPermission();
    }
  }, [permission]);

  const animatedFadeValue = new Animated.Value(0);
  useEffect(() => {
    if (pictureConfirmed && picture) {
      console.log("restart animation for some reason", {pictureConfirmed, picture})
      Animated.sequence([
        Animated.timing(animatedFadeValue, {
          toValue: 1.0,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animatedFadeValue, {
          toValue: 1.0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(async () => {
        await onPictureCaptured(picture);
        setPicture(undefined);
        setPictureConfirmed(false);
      });
    }
  }, [pictureConfirmed, picture]);

  async function takePicture() {
    if (cameraReady && cameraRef.current) {
      const pic = await cameraRef.current.takePictureAsync({ quality: 1 });

      const manipResult = await manipulateAsync(
        pic.uri,
        [
          {
            resize: {
              height: dimensionsConfig.height,
              width: dimensionsConfig.width,
            },
          },
          { flip: FlipType.Horizontal },
        ],
        { format: SaveFormat.JPEG, compress: 0.5 }
      );

      setPicture(manipResult);
    }
  }

  if (picture) {
    return (
      <View style={styles.container}>
        <View style={cameraWrapperStyle}>
          <Image
            source={{ uri: picture.uri }}
            style={styles.camera}
            alt="idk you tell me what's in the image"
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setPicture(undefined);
            }}
          >
            <X style={styles.button} size={56} absoluteStrokeWidth={true} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setPictureConfirmed(true);
            }}
          >
            <Check style={styles.button} size={56} absoluteStrokeWidth={true} />
          </TouchableOpacity>
        </View>
        {pictureConfirmed && (
          <Animated.View
            style={[styles.textContainer, { opacity: animatedFadeValue }]}
          >
            <Text style={styles.text}>You look great!</Text>
          </Animated.View>
        )}
      </View>
    );
  }

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={styles.container}>
        <ActivityIndicator color="white" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={cameraWrapperStyle}>
        <ExpoCamera
          style={styles.camera}
          type={CameraType.front}
          ratio={dimensionsConfig.aspectRatio}
          onCameraReady={() => {
            setCameraReady(true);
          }}
          ref={(c) => {
            if (c) cameraRef.current = c;
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Circle style={styles.button} size={56} absoluteStrokeWidth={true} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ViewFinder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    padding: 8,
  },
  camera: {
    flex: 1,
    flexGrow: 1,
  },
  cameraContainer: {
    borderRadius: 24,
    overflow: "hidden",
    aspectRatio: 3 / 4,
    width: "100%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    margin: 24,
    width: "100%",
    justifyContent: "space-around",
    gap: 8,
    maxHeight: 56,
  },
  button: {
    flex: 1,
    alignItems: "center",
    color: "white",
    flexGrow: 1,
    height: 56,
    width: 56,
    maxWidth: 56,
  },
  textContainer: {
    position: "absolute",
    backgroundColor: "#000000",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 48,
    fontWeight: "300",
    color: "white",
  },
});
