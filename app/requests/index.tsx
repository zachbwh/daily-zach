import { FC, useEffect, useRef, useState } from "react";
import SafeAndroidView from "@components/SafeAndroidView";
import PendingRequest from "./PendingRequestView";
import CreateRequest from "./CreateRequestView";
import { RequestStatus } from "./types";

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
      // set up real time monitor
    }
  }, [selfiePending]);

  if (selfiePending) {
    return (
      <SafeAndroidView>
        <PendingRequest
          headerText="Selfie Request"
          requestStatus={requestStatus}
        />
      </SafeAndroidView>
    );
  }
  return (
    <SafeAndroidView>
      <CreateRequest
        headerText="Request Selfie"
        subtitleText="Now it's Zach's turn"
        ctaText="'Ring' Zach"
        onMakeRequest={async () => {
          await setSelfiePending(true);
        }}
      />
    </SafeAndroidView>
  );
};

export default RequestDemo;
