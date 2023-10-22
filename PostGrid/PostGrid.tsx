import { FC, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Image, StyleSheet, View } from "react-native";
import { Heading } from "@gluestack-ui/themed";

type Post = {
  id: string;
  image_url: string;
};

const PostGrid: FC = () => {
  const [posts, setPosts] = useState<Post[]>();

  useEffect(() => {
    supabase
      .from("posts")
      .select("id, image_url")
      .then((data) => {
        console.log(data.data);
        setPosts(data.data as Post[]);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Heading style={styles.heading}>
        Posts
      </Heading>
      <View style={styles.imageGrid}>
        {posts?.map((post, index) => (
          <View style={styles.imageContainer}>
            <Image
            key={index}
            source={{ uri: post.image_url }}
            style={styles.imagePreview}
          />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    marginTop: 32
  },
  heading: {
    paddingHorizontal: 4,
    marginBottom: 32,
    fontSize: 40,
    lineHeight: 40
  },
  imageGrid: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "auto",
    margin: "auto",
  },
  imageContainer: {
    width: '25%',
    aspectRatio: 9/16,
    padding: 4
  },
  imagePreview: {
    height: '100%',
    borderRadius: 16
  },
});

export default PostGrid;
