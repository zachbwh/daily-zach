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
    />
  );
};

export default Account;
