import { FC } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Comment } from "@lib/react-query/comment";

type CommentsProps = {
  scrollRef: React.RefObject<ScrollView>;
  comments: Comment[];
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
