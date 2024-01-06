import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import ImagePreview from "./ImagePreview";
import Comments from "./Comments";
import { useDeletePost, usePost } from "@lib/react-query/posts";
import {
  Comment,
  useInsertComment,
  usePostComments,
} from "@lib/react-query/comment";
import CustomTextInput from "@components/CustomTextInput";
import { SendHorizontal, Trash2Icon } from "lucide-react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useCurrentUser } from "@lib/react-query/user";
import format from "date-fns/format";

const Post: FC = () => {
  const { id: postId } = useLocalSearchParams();
  const { data: comments } = usePostComments(postId as string);
  const { data: post } = usePost(postId as string);
  console.log("post!", post);
  const { data: currentUser } = useCurrentUser();
  const { mutate } = useInsertComment();
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<TextInput>(null);
  const height = useHeaderHeight();
  const { mutate: deletePost } = useDeletePost();

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
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      scrollRef.current?.scrollToEnd();
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      scrollRef.current?.scrollToEnd();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const postDate = new Date(post?.inserted_at || Date.now());
  const postTime = format(postDate, "h:mm aaa");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "position" : undefined}
      keyboardVerticalOffset={height - 16}
    >
      <Stack.Screen
        options={{
          headerTitle: "Zach",
          headerRight: (props) => {
            if (currentUser?.user_id === post?.user_id) {
              return (
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Delete",
                      "Are you sure you want to delete this post?",
                      [
                        { text: "Cancel" },
                        {
                          text: "Delete",
                          onPress: () => {
                            deletePost(post?.id);
                            if (router.canGoBack()) {
                              router.back();
                            } else {
                              router.replace("/posts");
                            }
                          },
                        },
                      ]
                    );
                  }}
                  style={styles.deleteIconWrapper}
                >
                  <Trash2Icon color="#AA0000" size={32} strokeWidth={1.5} />
                </TouchableOpacity>
              );
            }
          },
        }}
      />
      <ScrollView
        style={styles.innerContainer}
        ref={scrollRef}
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "none"}
      >
        {post && (
          <View style={styles.postHeader}>
            <Text style={styles.postHeaderText}>
              {post?.location ? `${post.location} · ${postTime}` : postTime}
            </Text>
          </View>
        )}
        <ImagePreview imageUrl={post?.image_url} />
        {post?.caption && (
          <View style={styles.postFooter}>
            <Text style={styles.postFooterText}>{post.caption}</Text>
          </View>
        )}
        {comments ? (
          <Comments comments={comments} />
        ) : (
          <ActivityIndicator color="white" />
        )}
      </ScrollView>
      <CustomTextInput
        value={inputText}
        onChangeText={setInputText}
        ref={inputRef}
        placeholder="Add a comment..."
        onSubmitEditing={({ nativeEvent: { text } }) => {
          submitComment(text);
        }}
        iconRight={
          <TouchableOpacity onPress={() => submitComment(inputText)}>
            <SendHorizontal color="white" />
          </TouchableOpacity>
        }
        wrapperStyle={styles.commentInputContainer}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flexGrow: 1,
    backgroundColor: "#000000",
  },
  innerContainer: {
    paddingBottom: Platform.OS === "ios" ? 24 : 0,
    height: "100%",
  },
  deleteIconWrapper: { height: 32, width: 32 },
  commentInputContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 24 : 16,
    left: 8,
    right: 8,
  },
  postHeader: {
    flexDirection: "row",
    padding: 16,
  },
  postHeaderText: {
    color: "#AAAAAA",
    fontSize: 16,
    fontWeight: "500",
  },
  postFooter: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "center",
  },
  postFooterText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Post;
