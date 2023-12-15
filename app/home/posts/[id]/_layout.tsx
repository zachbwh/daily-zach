import { FC } from "react";
import { Slot, Stack } from "expo-router";

const Post: FC = () => {
  return (
    <>
      <Stack.Screen options={{ headerTitle: "Zach" }}></Stack.Screen>
      <Slot />
    </>
  );
};

export default Post;
