import { FC, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Image, StyleSheet, View } from 'react-native';

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
      {posts?.map((post, index) => (
        <Image key={index} source={{uri: post.image_url}} style={styles.imagePreview} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 'auto',
    margin: 'auto'
  },
  imagePreview: {
    width: 90,
    height: 160,
    borderRadius: 16,
    margin: 4
  },
});

export default PostGrid;
