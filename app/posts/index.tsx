import { FC, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { StyleSheet, SectionList, TouchableOpacity } from "react-native";
import { Heading, Pressable, View, Image } from "@gluestack-ui/themed";
import { Link } from "expo-router";
import { format } from "date-fns";
import { AlarmClock } from "lucide-react-native";

type Post = {
  id: string;
  image_url: string;
  inserted_at: string;
};

type SectionPost = {
  posts: Post[];
}

const PostSectionList = SectionList<SectionPost>

const PostGrid: FC = () => {
  const [posts, setPosts] = useState<Post[]>();

  useEffect(() => {
    supabase
      .from("posts")
      .select("id, image_url, inserted_at")
      .order("inserted_at", { ascending: false })
      .then((data) => {
        setPosts(data.data as Post[]);
      });
  }, []);

  const groupedPosts = useMemo(() => {
    if (posts) {
      return posts.reduce<Record<string, Post[]>>((prev, current) => {
        const date = new Date(current.inserted_at);
        const formattedDate = format(date, "do MMMM ''yy");

        if (!prev[formattedDate]) {
          prev[formattedDate] = [current];
        } else {
          prev[formattedDate].push(current);
        }
        return prev;
      }, {});
    }
    return {};
  }, [posts]);
  const sectionedData = useMemo(() => {
    return Object.keys(groupedPosts).map((index) => {
      const posts = groupedPosts[index];
      return { title: index, data: [{ posts }] };
    });
  }, [groupedPosts]);

  async function requestPost() {
    const { error: insertError, data: insertData } = await supabase
        .from("post_requests")
        .insert({});
      if (insertError) {
        console.error("failed to insert post request data", {
          insertError,
          insertData,
        });
        // Handle error
        return;
      }
      console.log("inserted post request into db", insertData);
  }

  return (
    <View style={styles.container}>
      <PostSectionList
        style={styles.listContainer}
        sections={sectionedData}
        stickySectionHeadersEnabled={true}
        renderItem={({ item }) => {
          return (
            <View style={styles.imageGrid}>
              {item.posts.map((post) => {
                return (
                  <Link
                    href={{ pathname: "/posts/[id]", params: { id: post.id } }}
                    asChild
                    style={styles.imageContainer}
                  >
                    <Pressable>
                      <Image
                        source={{ uri: post.image_url }}
                        style={styles.imagePreview}
                        alt=""
                      />
                    </Pressable>
                  </Link>
                );
              })}
            </View>
          );
        }}
        renderSectionHeader={({ section: { title } }) => (
          <Heading style={styles.heading}>{title}</Heading>
        )}
      />
      <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={requestPost}>
            <AlarmClock style={styles.button} />
          </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    padding: 12,
    backgroundColor: "#000000",
    flex: 1
  },
  listContainer: {
    backgroundColor: "#000000"
  },
  heading: {
    paddingHorizontal: 4,
    fontSize: 35,
    lineHeight: 40,
    backgroundColor: "black"
  },
  imageGrid: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "auto",
    margin: "auto",
    marginVertical: 16
  },
  imageContainer: {
    width: "25%",
    aspectRatio: 3 / 4,
    padding: 4,
  },
  imagePreview: {
    height: "100%",
    borderRadius: 16,
  },
  buttonContainer: {
    flex: 1,
    flexGrow: 0,
    margin: 24,
    width: "100%",
    height: 100,
    backgroundColor: "black"
  },
  button: {
    flex: 1,
    alignItems: "center",
    color: "white",
    height: 50
  },
});

export default PostGrid;
