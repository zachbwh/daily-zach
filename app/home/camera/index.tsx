import React from "react";
import ViewFinder from "@components/Viewfinder";
import { ImageResult } from "expo-image-manipulator";
import { uploadPictureToBucket } from "@lib/uploadPictureToBucket";
import { useInsertPost } from "@lib/react-query/posts";

const Camera: React.FC = () => {
  const { mutate } = useInsertPost();
  async function uploadImage(picture: ImageResult) {
    try {
      const publicUrl = await uploadPictureToBucket(picture, "posts");
      mutate({
        image_url: publicUrl,
      });
    } catch (e) {
      console.error("error uploading a new post", e);
    }
  }

  return <ViewFinder onPictureCaptured={uploadImage} />;
};

export default Camera;
