import { FC, useState } from "react";
import SafeAndroidView from "@components/SafeAndroidView";
import PendingRequest from "./PendingRequestView";
import CreateRequest from "./CreateRequestView";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import {
  useInsertPostRequest,
  usePostRequest,
} from "@lib/react-query/post-request";

const Request: FC = () => {
  const [selfiePending, setSelfiePending] = useState(false);
  const { mutate: insertPostRequest, data: newPostRequest } =
    useInsertPostRequest();
  const requestId = newPostRequest?.data
    ? newPostRequest?.data[0].id
    : undefined;
  const { data: postRequest } = usePostRequest(requestId || "");

  if (selfiePending && postRequest) {
    return (
      <SafeAndroidView>
        <View style={styles.animationContainer}>
          <PendingRequest
            headerText="Selfie Request"
            requestStatus={postRequest.status}
            viewPost={async () => {
              router.replace(`/posts/${postRequest.post_id}`);
            }}
          />
        </View>
      </SafeAndroidView>
    );
  }
  return (
    <SafeAndroidView>
      <CreateRequest
        headerText="Request Selfie"
        subtitleText={`Request a selfie from Zach.\n\nBe careful, you might wake him up! ⏰`}
        ctaText="WAKE HIM UP"
        onMakeRequest={async () => {
          await insertPostRequest();
          setSelfiePending(true);
        }}
      />
    </SafeAndroidView>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    flex: 1,
  },
});

export default Request;
