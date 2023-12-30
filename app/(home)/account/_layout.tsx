import { FC } from "react";
import { Stack } from "expo-router";
const Account: FC<{ children: React.ReactElement }> = ({ children }) => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000",
        },
        headerTintColor: "#fff",
        headerTitle: "Account",
      }}
    >
      <Stack.Screen
        name="profile"
        options={{ headerTitle: "Manage Profile" }}
      />
    </Stack>
  );
};

export default Account;
