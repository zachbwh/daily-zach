import { StyleSheet, View, Text } from "react-native";
import CustomButton from "./CustomButton";

const PillSelector: React.FC<{
  options: string[];
  selectedOption: string | null;
  selectOption: (option: string) => void;
}> = ({ options, selectedOption, selectOption }) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <CustomButton
          onPress={() => {
            selectOption(option);
          }}
          wrapperStyle={[
            styles.button,
            selectedOption === option ? styles.selected : styles.unselected,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              selectedOption === option
                ? styles.selectedButtonText
                : styles.unselectedButtonText,
            ]}
          >
            {option}
          </Text>
        </CustomButton>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: "auto",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  button: {
    borderRadius: 24,
    padding: 8,
    paddingRight: 24,
    paddingLeft: 24,
    alignItems: "flex-start",
    backgroundColor: "red",
  },
  selected: {
    backgroundColor: "#DDDDDD",
    color: "black",
  },
  unselected: {
    backgroundColor: "#333333",
  },
  buttonText: {
    fontWeight: "500",
  },
  selectedButtonText: {
    color: "#000000",
  },
  unselectedButtonText: {
    color: "#FFFFFF",
  },
});

export default PillSelector;
