import { supabase } from "@lib/supabase";
import React from "react";
import ViewFinder from "@components/Viewfinder";
import { ImageResult } from "expo-image-manipulator";
import { uploadPictureToBucket } from "@lib/uploadPictureToBucket";

const Camera: React.FC = () => {
  async function uploadImage(picture: ImageResult) {
    try {
      const publicUrl = await uploadPictureToBucket(picture, "posts");
      const postData = {
        image_url: publicUrl,
      };
      const { error } = await supabase.from("posts").insert(postData);
      if (error) {
        throw error;
      }
    } catch (e) {
      console.error("error uploading a new post", e);
    }
  }

  return <ViewFinder onPictureCaptured={uploadImage} />;
};

export default Camera;
