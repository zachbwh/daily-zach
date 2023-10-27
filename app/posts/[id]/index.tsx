import { FC, useCallback, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Image, StyleSheet, View } from "react-native";
import {
  Heading,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { Stack, useLocalSearchParams } from "expo-router";

type Post = {
  id: string;
  image_url: string;
};

type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  created_at: string;
  text: string;
};

const Post: FC = () => {
  const [post, setPost] = useState<Post>();
  const { id: postId } = useLocalSearchParams();
  useEffect(() => {
    supabase
      .from("posts")
      .select("id, image_url")
      .eq("id", postId)
      .then((data) => {
        if (data.data) {
          setPost(data.data[0] as Post);
        }
      });
  }, []);

  const [comments, setComments] = useState<Comment[]>([]);
  useEffect(() => {
    supabase
      .from("comments")
      .select("id, post_id, user_id, parent_id, created_at, text")
      .eq("post_id", postId)
      .then((data) => {
        if (data.data) {
          setComments(data.data as Comment[]);
        }
      });
  }, []);

  const [inputText, setInputText] = useState("");

  const submit = useCallback(async () => {
    const commentData: Omit<Comment, "id" | "user_id" | "created_at"> = {
      post_id: postId as string,
      parent_id: null,
      text: inputText,
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
    setInputText("")
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
  }, [inputText, comments]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Cat" }} />
      <Heading style={styles.heading}>Posts 2</Heading>
      {post && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: post.image_url }} style={styles.imagePreview} />
        </View>
      )}
      <View style={styles.commentsContainer}>
        {comments &&
          comments.map((comment, index) => {
            return <Text key={index}>{comment.text}</Text>;
          })}
      </View>
      <Input>
        <InputField type="text" value={inputText} onChangeText={setInputText} />
        <Button
          ml="auto"
          onPress={() => {
            submit();
          }}
        >
          <ButtonText color="$white">Send</ButtonText>
        </Button>
      </Input>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    marginTop: 32,
    flex: 1,
  },
  heading: {
    paddingHorizontal: 4,
    marginBottom: 32,
    fontSize: 40,
    lineHeight: 40,
  },
  imageContainer: {
    width: "100%",
    margin: "auto",
    alignItems: "center",
  },
  imagePreview: {
    aspectRatio: 9 / 16,
    width: "50%",
    borderRadius: 16,
  },
  commentsContainer: {
    flex: 1,
  },
});

export default Post;
