import { FC } from "react";
import { supabase } from "@lib/supabase";
import { Alert, StyleSheet, View } from "react-native";
import Button from "./Button";
import { LogOut, Trash, User } from "lucide-react-native";
import { Stack, router } from "expo-router";
import { useLogoutPushNotificationSubscriber } from "@lib/react-query/push_notification_subscribers";

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
            Alert.alert("Account Deleted");
            router.replace("/signup");
          });
        },
      },
    ]
  );
};

const Account: FC = () => {
  const { mutate: logoutPushNotifications } =
    useLogoutPushNotificationSubscriber();
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Account",
        }}
      />
      <View style={styles.tile}>
        <Button
          onPress={() => {
            router.push("/posts/account/profile");
          }}
          label="Manage Profile"
          icon={<User style={styles.icon} />}
        />
        <Button
          onPress={async () => {
            try {
              await logoutPushNotifications();
            } catch (error) {
              console.error("error logging out push notifications", error);
            }
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
    flexGrow: 1,
    backgroundColor: "#000000",
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
