import React, { useEffect } from "react";
import ViewFinder from "@components/Viewfinder";
import { ImageResult } from "expo-image-manipulator";
import { uploadPictureToBucket } from "@lib/uploadPictureToBucket";
import { useInsertPost } from "@lib/react-query/posts";
import { router, useLocalSearchParams } from "expo-router";
import { useUpdatePostRequest } from "@lib/react-query/post-request";
import { RequestStatus } from "@app/requests/types";

const Camera: React.FC = () => {
  const data = useLocalSearchParams();
  const postRequestId = data["postRequestId"];
  const { mutate: updatePostRequest } = useUpdatePostRequest();
  useEffect(() => {
    if (typeof postRequestId === "string") {
      updatePostRequest({
        requestId: postRequestId,
        data: {
          status: RequestStatus.ACKNOWLEDGED,
        },
      });
    }
  }, [data]);
  const { mutate: insertPost, data: postData } = useInsertPost();
  useEffect(() => {
    if (typeof postRequestId === "string" && postData && postData.data) {
      const insertedPost = postData.data[0];
      updatePostRequest({
        requestId: postRequestId,
        data: {
          status: RequestStatus.COMPLETED,
          post_id: insertedPost.id,
        },
      });
      router.replace(`/posts/${insertedPost.id}`);
    }
  }, [postRequestId, postData]);
  async function uploadImage(picture: ImageResult) {
    try {
      if (typeof postRequestId === "string") {
        await updatePostRequest({
          requestId: postRequestId,
          data: {
            status: RequestStatus.UPLOADING,
          },
        });
      }
      const publicUrl = await uploadPictureToBucket(picture, "posts");
      await insertPost({
        image_url: publicUrl,
      });
    } catch (e) {
      console.error("error uploading a new post", e);
    }
  }

  return <ViewFinder onPictureCaptured={uploadImage} />;
};

export default Camera;
