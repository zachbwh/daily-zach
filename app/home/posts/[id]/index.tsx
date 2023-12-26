import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  LayoutAnimation,
  NativeModules,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import ImagePreview from "./ImagePreview";
import { default as Comments } from "./Comments";
import CommentInput from "./CommentInput";
import { usePost } from "@lib/react-query/posts";
import {
  Comment,
  useInsertComment,
  usePostComments,
} from "@lib/react-query/comments";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const Post: FC = () => {
  const { id: postId } = useLocalSearchParams();
  const { data: comments } = usePostComments(postId as string);
  const { data: post } = usePost(postId as string);
  const { mutate } = useInsertComment();

  const submitComment = useCallback(
    async (text: string) => {
      const commentData: Omit<Comment, "id" | "user_id" | "created_at"> = {
        post_id: postId as string,
        parent_id: null,
        text,
      };
      mutate(commentData);
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
      {comments ? (
        <Comments scrollRef={scrollRef} comments={comments} />
      ) : (
        <ActivityIndicator color="white" />
      )}
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
