import { FC, useState } from "react";
import SafeAndroidView from "@components/SafeAndroidView";
import PendingRequest from "./PendingRequestView";
import CreateRequest from "./CreateRequestView";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import RequestComplete from "./RequestComplete";
import {
  useInsertPostRequest,
  usePostRequest,
} from "@lib/react-query/post-request";

const demoImage = require("../signup/requestdemo/demo-selfie.jpg");

const Request: FC = () => {
  const [selfiePending, setSelfiePending] = useState(false);
  const [showSelfie, setShowSelfie] = useState(false);
  const { mutate: insertPostRequest, data: newPostRequest } =
    useInsertPostRequest();
  const requestId = newPostRequest?.data
    ? newPostRequest?.data[0].id
    : undefined;
  const { data: postRequest } = usePostRequest(requestId || "");

  if (showSelfie) {
    return (
      <SafeAndroidView>
        <RequestComplete
          image={demoImage}
          onNext={() => {
            router.replace("/posts");
          }}
        />
      </SafeAndroidView>
    );
  }

  if (selfiePending && postRequest) {
    return (
      <SafeAndroidView>
        <View style={styles.animationContainer}>
          <PendingRequest
            headerText="Selfie Request"
            requestStatus={postRequest.status}
            viewPost={async () => {
              setShowSelfie(true);
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
