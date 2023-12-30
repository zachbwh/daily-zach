import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  NativeModules,
  Platform,
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
import { useHeaderHeight } from "@react-navigation/elements";
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
  const height = useHeaderHeight();

  const submitComment = useCallback(
    async (text: string) => {
      if (inputText) {
        const commentData: Omit<Comment, "id" | "user_id" | "created_at"> = {
          post_id: postId as string,
          parent_id: null,
          text,
        };
        inputRef.current?.clear();
        mutate(commentData);
      }
    },
    [comments, inputText]
  );

  const scrollRef = useRef<ScrollView>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={height - 16}
    >
      <View style={styles.innerContainer}>
        <Stack.Screen options={{ headerTitle: "Zach" }} />
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
          onSubmitEditing={({ nativeEvent: { text } }) => {
            submitComment(text);
          }}
          iconRight={
            <TouchableOpacity onPress={() => submitComment(inputText)}>
              <SendHorizontal color="white" />
            </TouchableOpacity>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingTop: 32,
    height: "100%",
    backgroundColor: "#000000",
  },
  innerContainer: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 24 : 0,
  },
});

export default Post;
