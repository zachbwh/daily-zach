import { FC } from "react";
import { View, StyleSheet, Text } from "react-native";
import { RequestStatus } from "./types";
import {
  CheckCircle2,
  Mails,
  ThumbsUp,
  UploadCloud,
} from "lucide-react-native";

const statusCopy: Record<RequestStatus, string> = {
  CREATED: "Sent",
  ACKNOWLEDGED: "Acknowledged",
  UPLOADING: "Uploading",
  COMPLETED: "Uploaded!",
};

const getStatusEmoji = (
  requestStatus: RequestStatus,
  completed: boolean
): React.ReactElement => {
  const iconProps = {
    color: completed ? "#111111" : "#CCCCCC",
    size: 32,
  };
  switch (requestStatus) {
    case RequestStatus.CREATED:
      return <Mails {...iconProps} />;
    case RequestStatus.ACKNOWLEDGED:
      return <ThumbsUp {...iconProps} />;
    case RequestStatus.UPLOADING:
      return <UploadCloud {...iconProps} />;
    case RequestStatus.COMPLETED:
      return <CheckCircle2 {...iconProps} />;
  }
};

const RequestProgressEntry: FC<{
  status: RequestStatus;
  inProgress: boolean;
  completed: boolean;
}> = ({ status, inProgress, completed }) => {
  const icon = getStatusEmoji(status, completed);
  return (
    <View
      style={[
        styles.statusEntry,
        {
          backgroundColor: completed ? "#999999" : "#CCCCCC00",
          borderColor: completed ? "#999999" : "#CCCCCC",
        },
      ]}
    >
      {icon}
    </View>
  );
};

const RequestProgress: FC<{
  requestStatus: RequestStatus;
}> = ({ requestStatus }) => {
  const statusIndex = Object.values(RequestStatus).findIndex(
    (status) => requestStatus === status
  );
  const currentText = statusCopy[requestStatus];
  return (
    <View style={styles.container}>
      <Text style={styles.progressText}>{currentText}</Text>
      <View style={styles.stepContainer}>
        {Object.values(RequestStatus).map((statusValue, index) => {
          const stepCompleted = statusIndex >= index;
          return (
            <>
              {index !== 0 && (
                <View
                  style={[
                    styles.rectangle,
                    { backgroundColor: stepCompleted ? "#CCCCCC" : "#999999" },
                  ]}
                  key={index}
                ></View>
              )}
              <RequestProgressEntry
                status={statusValue}
                inProgress={false}
                completed={stepCompleted}
                key={statusValue}
              />
            </>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 40,
    paddingTop: 48,
  },
  stepContainer: {
    paddingLeft: 24,
    paddingRight: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    color: "white",
    fontWeight: "bold",
    fontSize: 32,
  },
  subtitle: {
    color: "#CCCCCC",
    fontWeight: "500",
    fontSize: 16,
  },
  statusEntry: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    width: 56,
    borderRadius: 28,
    borderWidth: 4,
  },
  progressText: {
    fontWeight: "500",
    fontSize: 24,
    paddingRight: 8,
    paddingLeft: 8,
    color: "#FFFFFF",
  },
  rectangle: {
    width: "15%",
    height: 8,
  },
});

export default RequestProgress;
