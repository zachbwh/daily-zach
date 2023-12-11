import { FC, useCallback, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { View, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import SafeAndroidView from "../../../components/SafeAndroidView";
import CustomTextInput from "../../../components/CustomTextInput";
import CustomButton from "../../../components/CustomButton";
import PillSelector from "../../../components/PillSelector";

enum Vertical {
  Friend = "Friend",
  Family = "Family",
  Colleague = "Colleague",
  Acquaintance = "Acquaintance",
  Stranger = "Stranger",
  ProspectiveEmployer = "Prospective Employer",
  AppStoreTester = "App Store Tester",
  Other = "Other",
}

const Information: FC = () => {
  const [name, setName] = useState("");
  const [nameComplete, setNameComplete] = useState(false);
  const [vertical, setVertical] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then((resp) => {console.log("session: ", resp.data)})
    setError(null);
  }, [name, vertical]);

  const submit = useCallback(async () => {
    if (!nameComplete) {
      if (name) {
        setNameComplete(true);
      } else {
        setError("Please enter a name");
      }
    } else {
      if (vertical) {
        setLoading(true)
        console.log("submitting information")
        const { error: upsertError } = await supabase
          .from("users")
          .upsert({ display_name: name, vertical, is_zach: false });
        setLoading(false)
        if (upsertError) {
          console.log(upsertError)
          setError("A problem ocurred, please try again later or contact customer support (Zach).")
        } else {
          router.replace("/signup/profile_image")
        }

      } else {
        setError("Please tell me how you know me");
      }
    }
  }, [name, vertical]);
  return (
    <SafeAndroidView>
      <View style={styles.container}>
        <Text style={styles.header}>Howdy</Text>
        <Text style={styles.subtitle}>who are ya</Text>
        <CustomTextInput
          autoCapitalize="words"
          autoComplete="name"
          value={name}
          onChangeText={setName}
          placeholder="Name"
        />
        {nameComplete && (
          <>
            <Text style={styles.subtitle}>how do you know me</Text>
            <PillSelector
              options={Object.values(Vertical)}
              selectOption={(vertical) => setVertical(vertical)}
              selectedOption={vertical}
            />
          </>
        )}
        {error && <Text style={styles.error}>{error}</Text>}
        <CustomButton disabled={loading} loading={loading} onPress={submit}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </CustomButton>
      </View>
    </SafeAndroidView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
    backgroundColor: "#000000",
    gap: 16,
  },
  header: {
    color: "white",
    fontWeight: "bold",
    fontSize: 32,
  },
  subtitle: {
    color: "#CCCCCC",
    fontWeight: "500",
    fontSize: 16,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "#CCCCCC",
    paddingTop: 8
  },
});

export default Information;