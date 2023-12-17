import { FC, useEffect, useRef } from "react";
import { View, StyleSheet, Text, Animated, Easing } from "react-native";
import { RequestStatus } from "./types";

const statusCopy: Record<RequestStatus, string> = {
  CREATED: "Sent",
  DELIVERED: "Delivered",
  ACKNOWLEDGED: "Acknowledged",
  UPLOADING: "Uploading",
  COMPLETED: "Uploaded!",
};

const statusEmoji: Record<RequestStatus, string> = {
  CREATED: "📤",
  DELIVERED: "⏰",
  ACKNOWLEDGED: "👍",
  UPLOADING: "🚚",
  COMPLETED: "✅",
};

const RequestProgressEntry: FC<{
  emoji: string;
  name: string;
  inProgress: boolean;
  completed: boolean;
}> = ({ emoji, name, inProgress, completed }) => {
  const completeAnimatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    console.log("completed ", { name, completed })
    if (completed) {
      Animated.timing(completeAnimatedValue, {
        toValue: 1.0,
        duration: 600,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  }, [completed]);
  return (
    <View style={styles.statusEntry}>
      <Animated.Text
        style={[
          styles.progressText,
          {
            transform: [
              {
                scale: completeAnimatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.2, 1.5],
                }),
              },
            ],
          },
        ]}
      >
        {emoji}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.progressText,
          {
            color: completeAnimatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ["#CCCCCC", "#FFFFFF"],
            }),
          },
        ]}
      >
        {name}
      </Animated.Text>
    </View>
  );
};

const RequestProgress: FC<{
  requestStatus: RequestStatus;
}> = ({ requestStatus }) => {
  const statusIndex = Object.values(RequestStatus).findIndex(
    (status) => requestStatus === status
  );
  return (
    <View style={styles.container}>
      {Object.values(RequestStatus).map((statusValue, index) => {
        const stepCompleted = statusIndex >= index;
        return (
          <RequestProgressEntry
            emoji={statusEmoji[statusValue]}
            name={statusCopy[statusValue]}
            inProgress={false}
            completed={stepCompleted}
            key={statusValue}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 40,
    paddingTop: 48,
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
  },
  progressText: {
    fontWeight: "500",
    fontSize: 24,
    paddingRight: 8,
    paddingLeft: 8,
  },
});

export default RequestProgress;
