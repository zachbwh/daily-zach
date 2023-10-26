import { FC } from "react";
import { Stack } from "expo-router";
const Posts: FC<{ children: React.ReactElement }> = ({ children }) => {
  return <Stack>{children}</Stack>;
};

export default Posts;
