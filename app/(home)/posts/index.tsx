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
import { Link } from "expo-router";
import format from "date-fns/format";
import { Post, usePosts } from "@lib/react-query/posts";
import { useInsertPostRequest } from "@lib/react-query/post-request";
import LottieView from "lottie-react-native";

type SectionPost = {
  posts: Post[];
};

const PostSectionList = SectionList<SectionPost>;

const PostGrid: FC = () => {
  const { data: posts } = usePosts();
  const { mutate: requestPost } = useInsertPostRequest();

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
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => requestPost()}>
          <LottieView
            loop={true}
            autoPlay={true}
            source={require("@components/animations/Bell.json")}
            resizeMode="cover"
            colorFilters={[{ keypath: "*", color: "#fcfcfc" }]}
            style={styles.button}
          />
        </TouchableOpacity>
        <Text style={styles.buttonText}>Request Selfie</Text>
      </View>
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
    width: "25%",
    aspectRatio: 3 / 4,
    padding: 4,
  },
  imagePreview: {
    height: "100%",
    borderRadius: 16,
  },
  buttonContainer: {
    paddingBottom: Platform.OS === "ios" ? 24 : 0,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    height: 72,
    width: 72,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "500",
  },
});

export default PostGrid;
