import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  LayoutAnimation,
  NativeModules,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import ImagePreview from "./ImagePreview";
import Comments from "./Comments";
import { usePost } from "@lib/react-query/posts";
import {
  Comment,
  useInsertComment,
  usePostComments,
} from "@lib/react-query/comment";
import CustomTextInput from "@components/CustomTextInput";
import { SendHorizontal } from "lucide-react-native";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const Post: FC = () => {
  const { id: postId } = useLocalSearchParams();
  const { data: comments } = usePostComments(postId as string);
  const { data: post } = usePost(postId as string);
  const { mutate } = useInsertComment();
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<TextInput>(null);

  const submitComment = useCallback(async () => {
    if (inputText) {
      const commentData: Omit<Comment, "id" | "user_id" | "created_at"> = {
        post_id: postId as string,
        parent_id: null,
        text: inputText,
      };
      inputRef.current?.clear();
      mutate(commentData);
    }
  }, [comments, inputText]);

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
      <CustomTextInput
        value={inputText}
        onChangeText={setInputText}
        ref={inputRef}
        iconRight={
          <TouchableOpacity onPress={submitComment}>
            <SendHorizontal color="white" />
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingTop: 32,
    flex: 1,
    backgroundColor: "#000000",
  },
});

export default Post;
