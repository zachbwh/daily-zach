import { FC } from "react";
import { Slot, Stack } from "expo-router";
const Posts: FC<{ children: React.ReactElement }> = ({ children }) => {
  return (
    <Slot />
  );
};

export default Posts;
