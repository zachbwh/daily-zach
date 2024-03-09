import { FC } from "react";
import { Stack, router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useCurrentUser } from "@lib/react-query/user";
import ProfileImage from "@components/ProfileImage";
const Posts: FC<{ children: React.ReactElement }> = ({ children }) => {
  const { data: user } = useCurrentUser();
  const imageSource = user?.profile_image_url
    ? { uri: user.profile_image_url }
    : null;

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000",
        },
        headerTintColor: "#fff",
        headerTitle: "Zachs",
        headerRight: () => {
          return (
            <TouchableOpacity
              onPress={() => {
                router.push("/account");
              }}
              style={styles.profileImageWrapper}
            >
              <ProfileImage imageSource={imageSource} />
            </TouchableOpacity>
          );
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
  profileImageWrapper: { height: 32, width: 32 },
});

export default Posts;
