import { FC, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Image, StyleSheet, View } from "react-native";
import { Heading } from "@gluestack-ui/themed";
import { Stack, useLocalSearchParams } from "expo-router";

type Post = {
  id: string;
  image_url: string;
};

const Post: FC = () => {
  const [post, setPost] = useState<Post>();
  const { id: postId } = useLocalSearchParams();
  useEffect(() => {
    supabase
      .from("posts")
      .select("id, image_url")
      .eq("id", postId)
      .then((data) => {
        if (data.data) {
          setPost(data.data[0] as Post);
        }
      });
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Cat" }} />
      <Heading style={styles.heading}>Posts 2</Heading>
      {post && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: post.image_url }} style={styles.imagePreview} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    marginTop: 32,
    flex: 1
  },
  heading: {
    paddingHorizontal: 4,
    marginBottom: 32,
    fontSize: 40,
    lineHeight: 40,
  },
  imageContainer: {
    width: '100%',
    margin: 'auto',
    alignItems: 'center'
  },
  imagePreview: {
    aspectRatio: 9 / 16,
    width: "50%",
    borderRadius: 16,
  },
});

export default Post;
