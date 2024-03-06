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
  Share,
  RefreshControl,
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
import {
  MoreVertical,
  SendHorizontal,
  Share2Icon,
  ShareIcon,
  Trash2Icon,
  X,
} from "lucide-react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useCurrentUser } from "@lib/react-query/user";
import format from "date-fns/format";
import { useActionSheet } from "@expo/react-native-action-sheet";
import ProfileImage from "@components/ProfileImage";

const Post: FC = () => {
  const { id: postId } = useLocalSearchParams();
  const { data: comments, refetch: refetchComments } = usePostComments(
    postId as string
  );
  const [refreshingComments, setRefreshingComments] = useState(false);
  const { data: post } = usePost(postId as string);
  const { data: currentUser } = useCurrentUser();
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

  const { mutate: deletePostMutation } = useDeletePost();
  const canDeletePost = currentUser?.user_id === post?.user_id;
  const deletePost = useCallback(() => {
    Alert.alert("Delete", "Are you sure you want to delete this post?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => {
          deletePostMutation(post?.id);
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/posts");
          }
        },
      },
    ]);
  }, [post?.id]);

  const { showActionSheetWithOptions } = useActionSheet();
  const requestor = post?.post_requests?.users;

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
            return (
              <TouchableOpacity
                onPress={() => {
                  const options = canDeletePost
                    ? ["Share Post", "Delete Post", "Cancel"]
                    : ["Share Post", "Cancel"];
                  const shareIcon =
                    Platform.OS === "ios" ? (
                      <ShareIcon color="white" />
                    ) : (
                      <Share2Icon color="white" />
                    );
                  const cancelIcon = <X color="white" />;
                  const icons = canDeletePost
                    ? [shareIcon, <Trash2Icon color="white" />, cancelIcon]
                    : [shareIcon, cancelIcon];
                  const destructiveButtonIndex = canDeletePost ? 1 : undefined;

                  showActionSheetWithOptions(
                    {
                      options,
                      useModal: true,
                      icons,
                      // showSeparators: true,
                      containerStyle: {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        backgroundColor: "#333333",
                        paddingBottom: Platform.OS === "ios" ? 16 : 0,
                      },
                      textStyle: {
                        color: "#EEEEEE",
                        fontWeight: "500",
                      },
                    },
                    (selectedIndex) => {
                      switch (selectedIndex) {
                        case 0:
                          setTimeout(() => {
                            Share.share({
                              title: "Daily Zach",
                              message: `Check out this awesome new Zach selfie!
https://dailyzach.zachhuxford.io/posts/${postId}?utm-source=dailyzach-share`,
                            });
                          }, 1);
                          break;
                        case destructiveButtonIndex:
                          deletePost();
                          break;
                      }
                    }
                  );
                }}
                style={styles.deleteIconWrapper}
              >
                <MoreVertical size={24} color="white" />
              </TouchableOpacity>
            );
          },
        }}
      />
      <ScrollView
        style={styles.innerContainer}
        ref={scrollRef}
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "none"}
        refreshControl={
          <RefreshControl
            refreshing={refreshingComments}
            onRefresh={async () => {
              setRefreshingComments(true);
              await refetchComments();
              setRefreshingComments(false);
            }}
          />
        }
      >
        {post && (
          <>
            <View style={styles.postRequestor}>
              {requestor ? (
                <ProfileImage
                  style={styles.image}
                  imageSource={{ uri: requestor.profile_image_url }}
                />
              ) : (
                <ProfileImage style={styles.image} imageSource={null} />
              )}
              <View>
                <Text style={styles.postHeaderText}>Requested By</Text>
                <Text style={styles.postHeaderText}>
                  {requestor?.display_name}
                </Text>
              </View>
            </View>
          </>
        )}
        <ImagePreview imageUrl={post?.image_url} />
        <View style={styles.postHeader}>
          <Text style={styles.postHeaderText}>
            {post?.location ? `${post.location} · ${postTime}` : postTime}
          </Text>
        </View>
        <View style={styles.postFooter}>
          {post?.caption && (
            <Text style={styles.postFooterText}>{post.caption}</Text>
          )}
        </View>
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
    paddingLeft: 24,
    paddingRight: 24,
    justifyContent: "space-between",
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
  image: {
    width: 48,
    height: 48,
    maxHeight: 48,
    maxWidth: 48,
    padding: 4,
  },
  postRequestor: {
    flexDirection: "row",
    padding: 8,
    paddingLeft: 16,
    gap: 8,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default Post;
