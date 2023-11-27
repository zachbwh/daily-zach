import { CameraCapturedPicture } from "expo-camera";
import { StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import ViewFinder from "./viewfinder";
import { FlipType, manipulateAsync, SaveFormat } from "expo-image-manipulator";

const Camera: React.FC = () => {
  async function uploadImage(picture: CameraCapturedPicture) {
    const url = picture.uri;
    console.log(url);

    const postId = uuidv4();
    const fileName = `${postId}.jpeg`;
    try {
      const manipResult = await manipulateAsync(
        url,
        [
          { resize: { height: 1200, width: 900 } },
          { flip: FlipType.Horizontal },
        ],
        { format: SaveFormat.JPEG, compress: 0.5 }
      );

      const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
        encoding: "base64",
      });

      const arrayBuffer = decode(base64 || "");

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

  return <ViewFinder onPictureCaptured={uploadImage} />;
};

export default Camera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    padding: 8,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
    flexGrow: 1,
  },
  cameraContainer: {
    borderRadius: 20,
    overflow: "hidden",
    aspectRatio: 3 / 4,
    width: "100%",
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
