import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const CustomButton: React.FC<{
  children: JSX.Element;
  wrapperStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
  type?: "primary" | "secondary";
  onPress?: (event: GestureResponderEvent) => void;
}> = ({
  children,
  wrapperStyle,
  disabled = false,
  loading = false,
  type = "primary",
  onPress,
}) => {
  return (
    <View
      style={[
        buttonStyles.buttonWrapper,
        type === "primary" ? buttonStyles.primaryWrapper : buttonStyles.secondaryWrapper,
        wrapperStyle,
      ]}
    >
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={buttonStyles.pressable}
      >
        {loading ? <ActivityIndicator color="white" /> : children}
      </TouchableOpacity>
    </View>
  );
};

export const buttonStyles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  primaryWrapper: {
    height: 48,
    borderWidth: 1,
    borderColor: "#888888",
    borderRadius: 8,
    backgroundColor: "#222222",
    overflow: "hidden",
  },
  secondaryWrapper: {
    height: 24,
  },
  pressable: {
    justifyContent: "center",
    marginLeft: 0,
    maringRight: 0,
    flexGrow: 1,
    height: "100%",
    alignItems: "center",
    flexDirection: "row"
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButtonText: {
    textDecorationLine: "underline",
    color: "#AAAAAA",
  },
});

export default CustomButton;
