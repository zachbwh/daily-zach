import { FC, useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Image,
  Keyboard,
  LayoutAnimation,
  NativeModules,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Text, Input, InputIcon, InputSlot } from "@gluestack-ui/themed";
import { Stack, useLocalSearchParams } from "expo-router";
import { SendHorizontal } from "lucide-react-native";

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

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

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

  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    LayoutAnimation.easeInEaseOut()
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      LayoutAnimation.easeInEaseOut();
      setKeyboardOpen(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      LayoutAnimation.easeInEaseOut();
      setKeyboardOpen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
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

  const submit = useCallback(
    async (text: string) => {
      const commentData: Omit<Comment, "id" | "user_id" | "created_at"> = {
        post_id: postId as string,
        parent_id: null,
        text,
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
      setInputText("");
      inputRef.current?.clear();

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
    },
    [comments]
  );

  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Cat" }} />
      {post && (
        <View
          style={[styles.imageContainer, {
            height: (keyboardOpen ? 0.6 : 1) * styles.imageContainer.height
          }]}
        >
          <Image source={{ uri: post.image_url }} style={styles.imagePreview} />
        </View>
      )}
      <ScrollView style={styles.commentsContainer}>
        {comments &&
          comments.map((comment, index) => {
            return <Text key={index}>{comment.text}</Text>;
          })}
      </ScrollView>
      <Input>
        <TextInput
          ref={inputRef}
          onSubmitEditing={({ nativeEvent: { text } }) => {
            submit(text);
          }}
          onChangeText={(text) => {
            setInputText(text);
          }}
          style={styles.textInput}
        />
        <InputSlot
          pr="$3"
          onPress={() => {
            submit(inputText);
          }}
        >
          <InputIcon as={SendHorizontal} color="$darkBlue500" />
        </InputSlot>
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
    height: 300
  },
  imagePreview: {
    aspectRatio: 9 / 16,
    height: "100%",
    borderRadius: 16,
  },
  commentsContainer: {
    flex: 1,
  },
  textInput: {
    height: "auto",
    width: "100%",
    flex: 1,
    padding: 12,
  },
});

export default Post;
