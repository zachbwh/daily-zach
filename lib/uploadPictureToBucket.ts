import { ImageResult } from "expo-image-manipulator";
import { supabase } from "./supabase";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

/**
 *
 * @param picture
 * @param bucketName
 * @returns uploaded image public url
 */
export const uploadPictureToBucket = async (
  picture: ImageResult,
  bucketName: string
): Promise<string> => {
  const url = picture.uri;
  console.log(url);

  const imageId = uuidv4();
  const fileName = `${imageId}.jpeg`;
  const base64 = await FileSystem.readAsStringAsync(picture.uri, {
    encoding: "base64",
  });

  const arrayBuffer = decode(base64 || "");

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, arrayBuffer, {
      contentType: "image/jpeg",
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};
