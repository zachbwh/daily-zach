import { FC } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

type CommentsProps = {
  scrollRef: React.RefObject<ScrollView>;
  comments: Comment[];
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  created_at: string;
  text: string;
};

const Comments: FC<CommentsProps> = ({ scrollRef, comments }) => {
  return (
    <ScrollView style={styles.commentsContainer} ref={scrollRef}>
      {comments &&
        comments.map((comment, index) => {
          return <Text key={index}>{comment.text}</Text>;
        })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  commentsContainer: {
    flex: 1,
  },
});

export default Comments;
