import { FC } from "react";
import { Slot, Stack } from "expo-router";

const Post: FC = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Zach" }}></Stack.Screen>
      <Slot />
    </>
  );
};

export default Post;
