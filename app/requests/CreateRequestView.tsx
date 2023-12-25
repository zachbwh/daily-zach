import { FC, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import CustomButton, { buttonStyles } from "@components/CustomButton";

const CreateRequest: FC<{
  headerText: string;
  subtitleText: string;
  ctaText: string;
  onMakeRequest: () => Promise<void>;
}> = ({ headerText, subtitleText, ctaText, onMakeRequest }) => {
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{headerText}</Text>
      <Text style={styles.subtitle}>{subtitleText}</Text>
      <View style={styles.ctaWrapper}>
        <CustomButton
          disabled={loading}
          loading={loading}
          onPress={() => {
            setLoading(true);
            try {
              void onMakeRequest();
            } catch (error) {
              console.log("error creating a post request");
              setLoading(false);
            }
          }}
        >
          <Text style={buttonStyles.primaryButtonText}>{ctaText}</Text>
        </CustomButton>
      </View>
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
  subtitle: {
    color: "#CCCCCC",
    fontWeight: "500",
    fontSize: 16,
  },
  secondaryActionsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  secondaryButton: {
    flexGrow: 1,
  },
  ctaWrapper: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingBottom: 48,
  },
});

export default CreateRequest;
