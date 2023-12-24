import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react-native";
import { FC, useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Alert, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import SafeAndroidView from "../../components/SafeAndroidView";
import CustomTextInput from "../../components/CustomTextInput";
import CustomButton, { buttonStyles } from "../../components/CustomButton";

const Login: FC = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { code } = useLocalSearchParams();

  useEffect(() => {
    if (code && typeof code === "string") {
      void supabase.auth.exchangeCodeForSession(code);
    }
  }, [code]);

  async function updatePassword(password: string) {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) Alert.alert(error.message);
    setLoading(false);

    if (!error) router.replace("/home/posts");
  }

  const submit = useCallback(() => {
    updatePassword(password);
  }, [password]);
  return (
    <SafeAndroidView>
      <View style={styles.container}>
        <Text style={styles.header}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your new password.</Text>
        <CustomTextInput
          secureTextEntry={!showPassword}
          textContentType="password"
          autoCapitalize="none"
          autoComplete="password"
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          icon={<LockIcon style={{ color: "white" }} />}
          iconRight={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOffIcon style={{ color: "white" }} />
              ) : (
                <EyeIcon style={{ color: "white" }} />
              )}
            </TouchableOpacity>
          }
        />
        <CustomButton disabled={loading} loading={loading} onPress={submit}>
          <Text style={buttonStyles.primaryButtonText}>Update Password</Text>
        </CustomButton>
      </View>
    </SafeAndroidView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 120,
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
  secondaryActionsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  secondaryButton: {
    flexGrow: 1,
  },
});

export default Login;
