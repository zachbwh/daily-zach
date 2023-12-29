import { FC } from "react";
import { Stack } from "expo-router";
const Posts: FC<{ children: React.ReactElement }> = ({ children }) => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000",
        },
        headerTintColor: "#fff",
        headerTitle: "Zachs",
      }}
    />
  );
};

export default Posts;
