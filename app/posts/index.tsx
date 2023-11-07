import { FC, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Image, SectionList, StyleSheet, View } from "react-native";
import { Heading, Pressable } from "@gluestack-ui/themed";
import { Link } from "expo-router";
import { format } from "date-fns";

type Post = {
  id: string;
  image_url: string;
  inserted_at: string;
};

const PostGrid: FC<{ children: React.ReactElement }> = ({ children }) => {
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

  return (
    <SectionList
      style={styles.container}
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
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    marginTop: 32,
  },
  heading: {
    paddingHorizontal: 4,
    fontSize: 35,
    lineHeight: 40,
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
});

export default PostGrid;
