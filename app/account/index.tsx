import { FC, useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { StyleSheet, View, Text } from "react-native";
import Button from "./Button";
import { LogOut, Trash, User } from "lucide-react-native";

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
            console.log("TEST");
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
