import { forwardRef } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

const CustomTextInput = forwardRef<
  TextInput,
  TextInputProps & {
    icon?: JSX.Element;
    iconRight?: JSX.Element;
    wrapperStyle?: StyleProp<ViewStyle>;
  }
>((props, ref) => {
  return (
    <View style={[styles.inputWrapper, props.wrapperStyle]}>
      {props.icon && <View style={styles.iconWrapper}>{props.icon}</View>}
      <TextInput
        {...props}
        style={styles.input}
        underlineColorAndroid="transparent"
        placeholderTextColor="#AAAAAA"
        ref={ref}
      />
      {props.iconRight && (
        <View style={styles.iconWrapper}>{props.iconRight}</View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    height: 48,
    backgroundColor: "#222222",
    borderWidth: 1,
    borderColor: "#888888",
    borderRadius: 8,
    overflow: "hidden",
  },
  iconWrapper: {
    backgroundColor: "#222222",
    flexGrow: 0,
    height: "100%",
    justifyContent: "center",
    paddingRight: 8,
    paddingLeft: 8,
  },
  input: {
    flex: 1,
    flexGrow: 1,
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    color: "#FFFFFF",
    backgroundColor: "#222222",
    height: "100%",
  },
});

export default CustomTextInput;
