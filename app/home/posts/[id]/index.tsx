import { FC, useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@lib/supabase";
import {
  Keyboard,
  LayoutAnimation,
  NativeModules,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import ImagePreview from "./ImagePreview";
import { default as Comments, Comment } from "./Comments";
import CommentInput from "./CommentInput";
import { usePost } from "@lib/react-query/posts";

type Post = {
  id: string;
  image_url: string;
  inserted_at: string;
};

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const Post: FC = () => {
  const { id: postId } = useLocalSearchParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const { data: post } = usePost(postId as string);

  const submitComment = useCallback(
    async (text: string) => {
      const commentData: Omit<Comment, "id" | "user_id" | "created_at"> = {
        post_id: postId as string,
        parent_id: null,
        text,
      };
      setComments([
        ...comments,
        {
          id: "temp",
          user_id: "temp",
          created_at: new Date().toISOString(),
          ...commentData,
        },
      ]);
      const { error: insertError, data: insertData } = await supabase
        .from("comments")
        .insert(commentData);
      if (insertError) {
        console.error("failed to upload comment data", {
          insertError,
          commentData,
        });
        // Handle error
        return;
      }
      console.log("inserted comment into db", insertData);
    },
    [comments]
  );

  const scrollRef = useRef<ScrollView>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      LayoutAnimation.easeInEaseOut();
      setKeyboardOpen(true);
      scrollRef.current?.scrollToEnd();
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      LayoutAnimation.easeInEaseOut();
      setKeyboardOpen(false);
      scrollRef.current?.scrollToEnd();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Zach" }}></Stack.Screen>
      {post && (
        <ImagePreview keyboardOpen={keyboardOpen} imageUrl={post.image_url} />
      )}
      <Comments scrollRef={scrollRef} comments={comments} />
      <CommentInput submitComment={submitComment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    marginTop: 32,
    flex: 1,
  },
});

export default Post;
