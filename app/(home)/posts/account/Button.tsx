import { FC } from "react";
import { NativeModules, StyleSheet, TouchableOpacity, Text } from "react-native";

type ButtonProps = {
  onPress: () => void;
  icon: JSX.Element
  label: string;
};

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const Button: FC<ButtonProps> = ({ onPress, icon, label }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
        {icon}
        <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    margin: "auto",
    alignItems: "center",
    color: "white",
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    alignContent: 'center',
    padding: 16,
  },
  text: {
    color: "white",
    flexGrow: 1,
    fontSize: 20,
    lineHeight: 20
  },
  chevron: {
    color: "white"
  }
});

export default Button;
