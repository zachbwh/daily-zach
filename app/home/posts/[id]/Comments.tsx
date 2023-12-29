import { FC, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Comment } from "@lib/react-query/comment";
import ProfileImage from "@components/ProfileImage";
import { useUser } from "@lib/react-query/user";
import useFormatDistanceToNow from "@lib/useFormatDistanceToNow";

type CommentsProps = {
  scrollRef: React.RefObject<ScrollView>;
  comments: Comment[];
};

const CommentView: FC<{ comment: Comment }> = ({ comment }) => {
  const { data: user, refetch } = useUser(comment.user_id);
  const date = new Date(comment.created_at);
  const formattedDate = useFormatDistanceToNow(date);

  useEffect(() => {
    refetch();
  }, []);
  const profileImage = user?.profile_image_url;
  const displayName = user?.display_name || "";
  return (
    <View style={styles.commentContainer}>
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
        <Text>{comment.text}</Text>
      </View>
    </View>
  );
};

const Comments: FC<CommentsProps> = ({ scrollRef, comments }) => {
  return (
    <ScrollView style={styles.commentsContainer} ref={scrollRef}>
      {comments &&
        comments.map((comment, index) => {
          return <CommentView key={index} comment={comment} />;
        })}
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
  },
  time: {},
  image: {
    width: 56,
    height: 56,
    padding: 4,
  },
});

export default Comments;
