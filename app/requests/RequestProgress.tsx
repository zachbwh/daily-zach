import { FC } from "react";
import { View, StyleSheet, Text } from "react-native";
import { RequestStatus } from "./types";
import { Circle } from "lucide-react-native";

const statusCopy: Record<RequestStatus, string> = {
  CREATED: "Notification Sent",
  DELIVERED: "Notification Delivered",
  ACKNOWLEDGED: "Acknowledged",
  UPLOADING: "Uploading",
  COMPLETED: "Uploaded!",
};

const RequestProgress: FC<{
  requestStatus: RequestStatus;
}> = ({ requestStatus }) => {
    const statusIndex = Object.values(RequestStatus).findIndex((status) => requestStatus === status)
  return (
    <View style={styles.container}>
      {Object.values(RequestStatus).map((statusValue, index) => {
        const stepCompleted = statusIndex >= index
        const stepColour = stepCompleted ? "#EEEEEE" : "#AAAAAA"
        return (
          <View style={styles.statusEntry} key={statusValue}>
            <Circle size={40} strokeWidth={2.5} color={stepColour} fill={stepCompleted ? stepColour : undefined} />
            <Text style={[styles.progressText, (stepCompleted ? styles.completeText : undefined)]}>
              {statusCopy[statusValue]}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 40,
    paddingTop: 48
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
    alignItems: "center"
  },
  progressText: {
    color: "#CCCCCC",
    fontWeight: "500",
    fontSize: 24,
    paddingLeft: 16
  },
  completeText: {
    color: "white"
  }
});

export default RequestProgress;
