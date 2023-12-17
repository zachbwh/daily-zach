import { FC, useEffect, useRef, useState } from "react";
import SafeAndroidView from "../../../components/SafeAndroidView";
import PendingRequest from "../../requests/PendingRequestView";
import CreateRequest from "../../requests/CreateRequestView";
import { RequestStatus } from "../../requests/types";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

const requestStatusList = Object.values(RequestStatus);

const RequestDemo: FC = () => {
  const [selfiePending, setSelfiePending] = useState(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatus.CREATED
  );
  const counterRef = useRef(1);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (selfiePending) {
      intervalRef.current = setInterval(() => {
        const currentCounter = counterRef.current;
        if (currentCounter < requestStatusList.length) {
          console.log("interval ", currentCounter);
          counterRef.current = currentCounter + 1;
          const nextRequestStatus = requestStatusList[currentCounter];
          console.log("next request status ", nextRequestStatus);
          setRequestStatus(nextRequestStatus);
        } else {
          clearInterval(intervalRef.current);
        }
      }, 2000);
      return () => {
        clearInterval(intervalRef.current);
      };
    }
  }, [selfiePending]);

  const lottieViewRef = useRef<LottieView | null>(null);

  useEffect(() => {
    if (requestStatus === RequestStatus.COMPLETED && lottieViewRef.current) {
      console.log("we should be confetting rn");
      lottieViewRef.current.play();
    }
  }, [requestStatus]);

  if (selfiePending) {
    return (
      <SafeAndroidView>
        <View style={styles.animationContainer}>
          <PendingRequest
            headerText="Selfie Request"
            requestStatus={requestStatus}
            viewPost={async () => {
              router.replace("/home/posts");
            }}
          />
          <LottieView
            loop={false}
            ref={lottieViewRef}
            source={require("./Animation - 1702793477112.json")}
            resizeMode="cover"
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              zIndex: 10,
              flex: 1,
              pointerEvents: "none",
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
        subtitleText={`Now it's Zach's turn.\n\nExcept not really.\n\nThis time is just a demo.\n\n⏰`}
        ctaText={`"Ring" Zach`}
        onMakeRequest={async () => {
          await setSelfiePending(true);
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

export default RequestDemo;
