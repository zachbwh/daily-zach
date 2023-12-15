import { FC } from "react";
import { Slot, Stack } from "expo-router";
const Posts: FC<{ children: React.ReactElement }> = ({ children }) => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000",
        },
        headerTintColor: "#fff",
        headerTitle: "Zachs"
      }}
    >
      <Slot />
    </Stack>
  );
};

export default Posts;
