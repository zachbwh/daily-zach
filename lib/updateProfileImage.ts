import { ImageResult } from "expo-image-manipulator";
import { supabase } from "./supabase";
import { uploadPictureToBucket } from "@lib/uploadPictureToBucket";

/**
 *
 * @param picture
 * @returns uploaded image public url
 */
export const updateProfileImage = async (
  picture: ImageResult
): Promise<string> => {
  const publicUrl = await uploadPictureToBucket(picture, "users");

  const sessionResp = await supabase.auth.getSession();
  if (sessionResp.error) {
    throw sessionResp.error;
  }
  const session = sessionResp.data.session;
  if (session === null) {
    throw new Error("Session is null");
  }
  console.log("submitting information");
  const { error: upsertError } = await supabase
    .from("users")
    .update({ profile_image_url: publicUrl })
    .eq("user_id", session.user.id);
  if (upsertError) {
    throw upsertError;
  }
  return publicUrl;
};
