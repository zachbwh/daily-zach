import { FC, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { supabase } from "../../../../lib/supabase";
import CustomTextInput from "../../../../components/CustomTextInput";
import CustomButton, {
  buttonStyles,
} from "../../../../components/CustomButton";
import ProfileImage from "../../../../components/ProfileImage";

type User = {
  id: string;
  user_id: string;
  display_name: string;
  profile_image_url?: string;
};

const Profile: FC = () => {
  const [name, setName] = useState<string>("");
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);

  const submit = useCallback(async () => {
    setLoading(true);
    console.log("submitting information");
    const { error: upsertError } = await supabase
      .from("users")
      .upsert({ display_name: name });
    setLoading(false);
    if (upsertError) {
      console.log(upsertError);
    }
  }, [name]);

  useEffect(() => {
    supabase
      .from("users")
      .select("id, user_id, display_name, profile_image_url")
      .limit(1)
      .then((data) => {
        console.log(data);
        if (data.data) {
          const user = data.data[0];
          setUser(user);
          setName(user.display_name || "");
        }
      });
  }, []);
  console.log(user);
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="white" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.profileImageWrapper}>
        <ProfileImage
          imageSource={
            user?.profile_image_url ? { uri: user?.profile_image_url } : null
          }
        />
      </View>
      <CustomTextInput
        autoCapitalize="words"
        autoComplete="name"
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      <CustomButton disabled={loading} loading={loading} onPress={submit}>
        <Text style={buttonStyles.primaryButtonText}>Update</Text>
      </CustomButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: "#000000",
  },
  icon: {
    color: "yellow",
  },
  text: {
    color: "white",
  },
  loadingContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  profileImageWrapper: {
    height: 120,
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
});

export default Profile;
