import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SwitchCamera, Circle } from "lucide-react-native";
import { supabase } from "../lib/supabase";
import * as FileSystem from "expo-file-system";
import { decode, encode } from "base64-arraybuffer";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Buffer } from "buffer";

export default function App() {
  const [cameraReady, setCameraReady] = useState(false);
  let cameraRef = useRef<Camera>();
  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();

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
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  async function takePicture() {
    if (cameraReady && cameraRef.current) {
      const pic = await cameraRef.current.takePictureAsync();
      uploadImage(pic);
    }
  }

  async function uploadImage(picture: CameraCapturedPicture) {
    const url = picture.uri;
    console.log(url);
    const base64 = await FileSystem.readAsStringAsync(url, {
      encoding: 'base64'
    });
    // const bufferThing = new Buffer.Blob([binaryString]);
    // console.log(base64)
    // const formData = new FormData()
    // formData.append('file', photo)

    // const arrayBuffer = decode(`data:image/jpeg;base64${base64}`)
    const arrayBuffer = decode(base64)
    // const arrayBuffer = encode(base64)

    const fileName = `${uuidv4()}.jpeg`;
    // const file = new File([blob], fileName)
    try {
      const { data, error } = await supabase.storage
        .from("posts")
        .upload(fileName, arrayBuffer, {
          contentType: "image/jpeg",
        });
      if (error) {
        console.error("failed to upload image");
        // Handle error
      } else {
        console.log("uploaded image", data);
        // Handle success
      }
    } catch (e) {
      console.error("blah", e);
    }
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ratio="16:9"
        onCameraReady={() => {
          setCameraReady(true);
        }}
        ref={(c) => {
          if (c) cameraRef.current = c;
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Circle style={styles.button} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <SwitchCamera style={styles.button} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexGrow: 1,
    flexDirection: "row",
    margin: 16,
  },
  camera: {
    flex: 1,
    flexGrow: 1,
    aspectRatio: 9 / 16,
    borderRadius: 80,
    overflow: "hidden",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    color: "white",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
