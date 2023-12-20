import { FC } from "react";
import { supabase } from "../../../lib/supabase";
import { Alert, StyleSheet, View } from "react-native";
import Button from "./Button";
import { LogOut, Trash, User } from "lucide-react-native";
import { router } from "expo-router";

const logout = () => {
  Alert.alert("Logout", "Are you sure you want to logout?", [
    { text: "Cancel" },
    {
      text: "Logout",
      onPress: () => {
        supabase.auth.signOut().then((response) => {
          if (response.error) {
            console.log("error logging out, please try again");
          } else {
            router.replace("/login");
          }
        });
      },
    },
  ]);
};

const deleteAccount = () => {
  Alert.alert(
    "Request Account Deletion",
    "Are you sure you want to delete your account?",
    [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const { error: insertError, data: insertData } = await supabase
            .from("deletion_requests")
            .insert({});
          if (insertError) {
            console.error("failed to submit deletion request", {
              insertError,
              insertData,
            });
            // Handle error
            return;
          }
          supabase.auth.signOut().then((response) => {
            Alert.alert(
              "Deletion Pending",
              "Please reach out to customer support if you wish to prevent deletion."
            );
            router.replace("/signup");
          });
        },
      },
    ]
  );
};

const Account: FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.tile}>
        <Button
          onPress={() => {
            console.log("TEST");
          }}
          label="Manage Profile"
          icon={<User style={styles.icon} />}
        />
        <Button
          onPress={() => {
            logout();
          }}
          label="Logout"
          icon={<LogOut style={styles.icon} />}
        />
      </View>
      <View style={styles.tile}>
        <Button
          onPress={() => {
            deleteAccount();
          }}
          label="Delete Account"
          icon={<Trash style={styles.icon} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tile: {
    margin: 8,
    backgroundColor: "#222222",
    borderRadius: 16,
  },
  icon: {
    color: "yellow",
  },
  text: {
    color: "white",
  },
});

export default Account;
