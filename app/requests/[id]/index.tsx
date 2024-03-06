import { FC } from "react";
import SafeAndroidView from "@components/SafeAndroidView";
import PendingRequest from "../PendingRequestView";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { usePostRequest } from "@lib/react-query/post-request";

const Request: FC = () => {
  const { id: requestId } = useLocalSearchParams();
  const { data: postRequest } = usePostRequest(requestId as string);

  return (
    <SafeAndroidView>
      <View style={styles.animationContainer}>
        <PendingRequest
          headerText="Selfie Request"
          requestStatus={postRequest?.status}
          viewPost={async () => {
            router.replace(`/posts/${postRequest?.post_id}`);
          }}
        />
      </View>
    </SafeAndroidView>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    flex: 1,
  },
});

export default Request;
