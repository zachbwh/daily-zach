import {
  Camera as ExpoCamera,
  CameraCapturedPicture,
  CameraType,
} from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SwitchCamera, Circle, Image } from "lucide-react-native";
import { supabase } from "../../lib/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import React from "react";

const Camera: React.FC = () => {
  const [cameraReady, setCameraReady] = useState(false);
  let cameraRef = useRef<ExpoCamera>();
  const [type, setType] = useState(CameraType.front);
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
      const pic = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      uploadImage(pic);
    }
  }

  async function uploadImage(picture: CameraCapturedPicture) {
    const url = picture.uri;
    console.log(url);
    const base64 = await FileSystem.readAsStringAsync(url, {
      encoding: "base64",
    });
    const arrayBuffer = decode(base64);
    const postId = uuidv4();
    const fileName = `${postId}.jpeg`;
    try {
      const { data, error } = await supabase.storage
        .from("posts")
        .upload(fileName, arrayBuffer, {
          contentType: "image/jpeg",
        });
      if (error) {
        console.error("failed to upload image");
        // Handle error
        return;
      }
      console.log("uploaded image", data);

      const { data: publicUrlData } = supabase.storage
        .from("posts")
        .getPublicUrl(fileName);

      console.log("fetched public url", publicUrlData);

      const postData = {
        id: postId,
        image_url: publicUrlData.publicUrl,
      };
      const { error: insertError, data: insertData } = await supabase
        .from("posts")
        .insert(postData);
      if (insertError) {
        console.error("failed to upload image post data", {
          insertError,
          postData,
        });
        // Handle error
        return;
      }
      console.log("inserted post into db", data);
    } catch (e) {
      console.error("blah", e);
    }
  }

  const viewPosts = () => {};

  return (
    <View style={styles.container}>
      <ExpoCamera
        style={styles.camera}
        type={type}
        ratio="4:3"
        onCameraReady={() => {
          setCameraReady(true);
        }}
        ref={(c) => {
          if (c) cameraRef.current = c;
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={viewPosts}>
            <Image style={styles.button} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Circle style={styles.button} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <SwitchCamera style={styles.button} />
          </TouchableOpacity>
        </View>
      </ExpoCamera>
    </View>
  );
};

export default Camera;

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
    aspectRatio: 3 / 4,
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
