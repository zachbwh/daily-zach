import { FC, useMemo } from "react";
import {
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Image,
  Platform,
  Text,
} from "react-native";
import { Heading, Pressable, View } from "@gluestack-ui/themed";
import { Link, router } from "expo-router";
import format from "date-fns/format";
import { Post, usePosts } from "@lib/react-query/posts";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";

type SectionPost = {
  posts: Post[];
};

const PostSectionList = SectionList<SectionPost>;

const PostGrid: FC = () => {
  const { data: posts } = usePosts();

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
    <View style={styles.container}>
      <PostSectionList
        style={styles.listContainer}
        sections={sectionedData}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={{ paddingBottom: 64 }}
        renderItem={({ item }) => {
          return (
            <View style={styles.imageGrid}>
              {item.posts.map((post) => {
                return (
                  <Link
                    href={{
                      pathname: "/posts/[id]",
                      params: { id: post.id },
                    }}
                    asChild
                    style={styles.imageContainer}
                    key={post.id}
                  >
                    <Pressable>
                      <Image
                        source={{ uri: post.image_url }}
                        style={styles.imagePreview}
                        alt=""
                        resizeMethod="resize"
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
      <LinearGradient
        colors={["#00000055", "#000000CC", "#000000CC", "#00000055"]}
        start={[0, 1]}
        end={[1, 0]}
        style={styles.buttonContainerContainer}
      >
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => router.push("/requests/new")}
        >
          <LottieView
            loop={true}
            autoPlay={true}
            source={require("@components/animations/Bell.json")}
            resizeMode="cover"
            colorFilters={[{ keypath: "*", color: "#fcfcfc" }]}
            style={styles.button}
          />
          <Text style={styles.buttonText}>Ring Zach</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    flex: 1,
  },
  listContainer: {
    backgroundColor: "#000000",
    paddingRight: 8,
    paddingLeft: 8,
  },
  heading: {
    paddingHorizontal: 4,
    fontSize: 35,
    lineHeight: 40,
    backgroundColor: "black",
  },
  imageGrid: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "auto",
    margin: "auto",
    marginVertical: 16,
  },
  imageContainer: {
    width: "50%",
    aspectRatio: 3 / 4,
    padding: 8,
  },
  imagePreview: {
    height: "100%",
    borderRadius: 16,
  },
  buttonContainerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    paddingBottom: Platform.OS === "ios" ? 24 : 4,
    alignItems: "center",
    padding: 16,
    paddingTop: 8,
  },
  button: {
    height: 42,
    width: 64,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default PostGrid;
