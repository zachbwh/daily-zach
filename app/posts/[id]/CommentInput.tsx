import { FC, useRef, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { Input, InputIcon, InputSlot } from "@gluestack-ui/themed";
import { SendHorizontal } from "lucide-react-native";

type CommentInputProps = {
  submitComment: (comment: string) => void;
};

const CommentInput: FC<CommentInputProps> = ({ submitComment }) => {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<TextInput>(null);

  const submit = (text: string) => {
    if (text) {
      inputRef.current?.clear();
      submitComment(text);
    }
  };

  return (
    <Input>
      <TextInput
        ref={inputRef}
        onSubmitEditing={({ nativeEvent: { text } }) => {
          submit(text);
        }}
        onChangeText={(text) => {
          setInputText(text);
        }}
        style={styles.textInput}
      />
      <InputSlot
        pr="$3"
        onPress={() => {
          submit(inputText);
        }}
      >
        <InputIcon as={SendHorizontal} color="$darkBlue500" />
      </InputSlot>
    </Input>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: "auto",
    width: "100%",
    flex: 1,
    padding: 12,
  },
});

export default CommentInput;
