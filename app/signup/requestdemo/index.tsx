import { FC, useEffect, useRef, useState } from "react";
import SafeAndroidView from "../../../components/SafeAndroidView";
import PendingRequest from "../../requests/PendingRequestView";
import CreateRequest from "../../requests/CreateRequestView";
import { RequestStatus } from "../../requests/types";
import { router } from "expo-router";

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

  if (selfiePending) {
    return (
      <SafeAndroidView>
        <PendingRequest
          headerText="Selfie Request"
          requestStatus={requestStatus}
          viewPost={async () => {
            router.replace("/home/posts")
          }}
        />
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

export default RequestDemo;
