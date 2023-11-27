import {
    Camera as ExpoCamera,
    CameraCapturedPicture,
    CameraType,
  } from "expo-camera";
  import { useRef, useState } from "react";
  import { StyleSheet, TouchableOpacity } from "react-native";
  import { Button, Text, View } from "@gluestack-ui/themed";
  import { Circle } from "lucide-react-native";
  import React from "react";

  type ViewFinderProps = {
    onPictureCaptured: (picture: CameraCapturedPicture) => void
  }
  
  const ViewFinder: React.FC<ViewFinderProps> = ({onPictureCaptured}) => {
    const [cameraReady, setCameraReady] = useState(false);
    let cameraRef = useRef<ExpoCamera>();
    const [permission, requestPermission] = ExpoCamera.useCameraPermissions();
  
    if (!permission) {
      // Camera permissions are still loading
      return <View />;
    }
  
    if (!permission.granted) {
      // Camera permissions are not granted yet
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: "center" }}>
            We need your permission to show the camera
          </Text>
          <Button onPress={requestPermission}><Text>Grant Permission</Text></Button>
        </View>
      );
    }
  
    async function takePicture() {
      if (cameraReady && cameraRef.current) {
        const pic = await cameraRef.current.takePictureAsync({ quality: 1 });
        onPictureCaptured(pic);
      }
    }
  
    return (
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <ExpoCamera
            style={styles.camera}
            type={CameraType.front}
            ratio="4:3"
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
            <Circle style={styles.button} />
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
      backgroundColor: 'black'
    },
    camera: {
      flex: 1,
      flexGrow: 1,
    },
    cameraContainer: {
      borderRadius: 20,
      overflow: "hidden",
      aspectRatio: 3 / 4,
      width: "100%"
    },
    buttonContainer: {
      flex: 1,
      flexGrow: 0,
      margin: 24,
      width: "100%",
    },
    button: {
      flex: 1,
      alignItems: "center",
      color: "white",
    },
    text: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
    },
  });
  