import { FC, useEffect } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Comment, useDeleteComment } from "@lib/react-query/comment";
import ProfileImage from "@components/ProfileImage";
import { useCurrentUser, useUser } from "@lib/react-query/user";
import useFormatDistanceToNow from "@lib/useFormatDistanceToNow";

type CommentsProps = {
  scrollRef: React.RefObject<ScrollView>;
  comments: Comment[];
};

const CommentView: FC<{ comment: Comment }> = ({ comment }) => {
  const { data: user, refetch } = useUser(comment.user_id);
  const { data: currentUser } = useCurrentUser();
  const date = new Date(comment.created_at);
  const formattedDate = useFormatDistanceToNow(date);
  const { mutate: deleteComment } = useDeleteComment(comment.post_id);

  useEffect(() => {
    refetch();
  }, []);
  const profileImage = user?.profile_image_url;
  const displayName = user?.display_name || "";
  return (
    <Pressable
      style={styles.commentContainer}
      onLongPress={() => {
        if (comment.user_id === currentUser?.user_id) {
          Alert.alert(
            "Delete",
            "Are you sure you want to delete this comment?",
            [
              { text: "Cancel" },
              {
                text: "Delete",
                onPress: () => {
                  deleteComment(comment.id);
                },
              },
            ]
          );
        }
      }}
    >
      <View>
        {profileImage ? (
          <ProfileImage
            style={styles.image}
            imageSource={{ uri: profileImage }}
          />
        ) : (
          <ProfileImage style={styles.image} imageSource={null} />
        )}
      </View>
      <View style={styles.commentBodyContainer}>
        <View style={styles.commentHeaderContainer}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.time}>{formattedDate}</Text>
        </View>
        <Text style={styles.text}>{comment.text}</Text>
      </View>
    </Pressable>
  );
};

const Comments: FC<CommentsProps> = ({ scrollRef, comments }) => {
  return (
    <ScrollView style={styles.commentsContainer} ref={scrollRef}>
      {comments && comments.length > 0 ? (
        comments.map((comment, index) => {
          return <CommentView key={index} comment={comment} />;
        })
      ) : (
        <View style={styles.noCommentsContainer}>
          <Text style={styles.noCommentsText}>No comments</Text>
          <Text style={styles.noCommentsText}>
            Leave a comment to let Zach know he looks good
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  commentsContainer: {
    flex: 1,
  },
  commentContainer: {
    flexDirection: "row",
  },
  noCommentsContainer: {
    padding: 16,
  },
  noCommentsText: {
    color: "#EEEEEE",
    textAlign: "center",
    paddingBottom: 4,
  },
  commentBodyContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: 8,
  },
  commentHeaderContainer: {
    flexDirection: "row",
  },
  name: {
    fontWeight: "600",
    paddingRight: 8,
    color: "#FFFFFF",
  },
  time: {
    color: "#AAAAAA",
  },
  text: {
    color: "#FFFFFF",
  },
  image: {
    width: 56,
    height: 56,
    padding: 4,
  },
});

export default Comments;
