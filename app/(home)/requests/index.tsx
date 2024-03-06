import { FC, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import ProfileImage from "@components/ProfileImage";
import { useCurrentUser } from "@lib/react-query/user";
import {
  usePendingPostRequestsCurrentUser,
  usePendingPostRequestsIsZach,
} from "@lib/react-query/post-request";
import format from "date-fns/format";
import { Link, Stack } from "expo-router";

export type PostRequestItem = {
  id: any;
  created_at: any;
  post_id: any;
  status: any;
  users: {
    display_name: any;
    profile_image_url: any;
  };
};

const PostRequest: FC<{ postRequest: PostRequestItem }> = ({ postRequest }) => {
  const profileImage = postRequest.users.profile_image_url;
  const displayName = postRequest.users.display_name;
  const formattedDate = format(
    new Date(postRequest.created_at),
    "h:mm aaa dd/MM/yy"
  );
  const { data: currentUser } = useCurrentUser();
  const isZach = currentUser?.is_zach;
  const url = isZach
    ? `/camera?postRequestId=${postRequest.id}`
    : `/requests/${postRequest.id}`;

  return (
    <Link href={url}>
      <View style={styles.requestContainer}>
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
        <View style={styles.requestBodyContainer}>
          <View style={styles.requestHeaderContainer}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.time}>{formattedDate}</Text>
          </View>
          <Text style={styles.text}>{postRequest.status}</Text>
        </View>
      </View>
    </Link>
  );
};

const PostRequests: FC = () => {
  const { data: postRequestsZach, refetch: refetchPostRequestsZach } =
    usePendingPostRequestsIsZach();
  const { data } = useCurrentUser();
  const isZach = data?.is_zach;
  const { data: postRequestsNormal, refetch: refetchPostRequests } =
    usePendingPostRequestsCurrentUser(data?.user_id);

  const postRequests = isZach ? postRequestsZach : postRequestsNormal;
  const [refreshing, setRefreshing] = useState(false);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Pending Requests",
        }}
      />
      <FlatList
        data={postRequests}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await Promise.all([
                refetchPostRequestsZach(),
                refetchPostRequests(),
              ]);
              setRefreshing(false);
            }}
          />
        }
        renderItem={(element) => {
          return (
            <PostRequest
              postRequest={element.item as unknown as PostRequestItem}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    flex: 1,
  },
  requestContainer: {
    flexDirection: "row",
    paddingTop: 4,
    paddingBottom: 4,
  },
  requestBodyContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: 8,
  },
  requestHeaderContainer: {
    flexDirection: "row",
  },
  name: {
    fontWeight: "600",
    paddingRight: 8,
    color: "#FFFFFF",
  },
  time: {
    color: "#AAAAAA",
  },
  text: {
    color: "#FFFFFF",
  },
  image: {
    width: 56,
    height: 56,
    maxHeight: 56,
    maxWidth: 56,
    padding: 4,
  },
});

export default PostRequests;
