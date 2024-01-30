import React, { useEffect } from "react";
import ViewFinder from "@components/Viewfinder";
import { ImageResult } from "expo-image-manipulator";
import { uploadPictureToBucket } from "@lib/uploadPictureToBucket";
import { useInsertPost } from "@lib/react-query/posts";
import { router, useLocalSearchParams } from "expo-router";
import { useUpdatePostRequest } from "@lib/react-query/post-request";
import { RequestStatus } from "@app/requests/types";
import * as Location from "expo-location";

/**
 * Don't even think about using this, it's so locked down it won't be useful anyone else
 */
const GOOGLE_MAPS_REVERSE_GEOCODE_API =
  "AIzaSyD3euxTd5aRJOhHYI9K66aJQZ1WVrr6yKw";
type AddressComponent = {
  long_name: string;
  types: string[];
};

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
      let location;

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getLastKnownPositionAsync();
          if (loc) {
            const {
              coords: { longitude, latitude },
            } = loc;
            console.log({ longitude, latitude });
            const address = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_REVERSE_GEOCODE_API}`
            ).then((response) => response.json());
            const addressComponents: AddressComponent[] =
              address.results[0]["address_components"];
            const neighborhood = addressComponents.find((component) =>
              component.types.includes("neighborhood")
            )?.long_name;
            const subLocality = addressComponents.find((component) =>
              component.types.includes("sub_locality")
            )?.long_name;
            const locality = addressComponents.find((component) =>
              component.types.includes("locality")
            )?.long_name;
            const administrativeAreaLevel2 = addressComponents.find(
              (component) =>
                component.types.includes("administrative_area_level_2")
            )?.long_name;
            const administrativeAreaLevel1 = addressComponents.find(
              (component) =>
                component.types.includes("administrative_area_level_1")
            )?.long_name;
            const country = addressComponents.find((component) =>
              component.types.includes("country")
            )?.long_name;

            const subArea =
              neighborhood ||
              subLocality ||
              locality ||
              administrativeAreaLevel2 ||
              administrativeAreaLevel1;
            if (subArea) {
              location = `${subArea}, ${country}`;
            } else {
              location = country;
            }
          }
        } else {
          console.error("no location access while uploading post");
        }
      } catch (e) {
        console.error("failed to get location", e);
      }

      await insertPost({
        image_url: publicUrl,
        location: location || "",
        caption: "",
      });
    } catch (e) {
      console.error("error uploading a new post", e);
    }
  }

  return <ViewFinder onPictureCaptured={uploadImage} />;
};

export default Camera;
