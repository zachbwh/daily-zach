import { FC } from "react";
import { Stack } from "expo-router";
const Posts: FC<{ children: React.ReactElement }> = ({ children }) => {
  return <Stack screenOptions={{title: "Zachs"}}>{children}</Stack>;
};

export default Posts;
