import { FC } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { RequestStatus } from "./types";
import RequestProgress from "./RequestProgress";
import CustomButton, { buttonStyles } from "../../components/CustomButton";

const PendingRequest: FC<{
  headerText: string;
  requestStatus: RequestStatus;
  viewPost: () => Promise<void>;
}> = ({ headerText, requestStatus, viewPost }) => {
  const loadingZach = requestStatus !== RequestStatus.COMPLETED;
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{headerText}</Text>
      <RequestProgress requestStatus={requestStatus} />
      <CustomButton disabled={loadingZach} onPress={() => { void viewPost()}}>
        {loadingZach ? (
          <>
            <ActivityIndicator color="#FFFFFF" style={{ paddingRight: 8 }} />
            <Text style={buttonStyles.primaryButtonText}>
              Waiting for Zach...
            </Text>
          </>
        ) : (
          <Text style={buttonStyles.primaryButtonText}>See the Zach!</Text>
        )}
      </CustomButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 120,
    backgroundColor: "#000000",
    gap: 16,
  },
  header: {
    color: "white",
    fontWeight: "bold",
    fontSize: 32,
  },
});

export default PendingRequest;
