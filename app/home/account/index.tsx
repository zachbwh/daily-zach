import { FC } from "react";
import { supabase } from "../../../lib/supabase";
import { StyleSheet, View } from "react-native";
import Button from "./Button";
import { LogOut, Trash, User } from "lucide-react-native";
import { useRouter } from "expo-router";

const Account: FC = () => {
  const router = useRouter()
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
            console.log("TEST");
            supabase.auth.signOut().then(response => {
              if (response.error) {
                  console.log("error logging out, please try again")
              } else {
                  router.replace("/login")
              }
          })
          }}
          label="Logout"
          icon={<LogOut style={styles.icon} />}
        />
      </View>
      <View style={styles.tile}>
        <Button
          onPress={() => {
            console.log("TEST");
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
