import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react-native";
import { FC, useCallback, useState } from "react";
import { supabase } from "@lib/supabase";
import { Alert, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import SafeAndroidView from "@components/SafeAndroidView";
import CustomTextInput from "@components/CustomTextInput";
import CustomButton, { buttonStyles } from "@components/CustomButton";

const Login: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function loginWithEmail(email: string, password: string) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);

    if (!error) router.replace("/posts");
  }

  const submit = useCallback(() => {
    loginWithEmail(email, password);
  }, [email, password]);
  return (
    <SafeAndroidView>
      <View style={styles.container}>
        <Text style={styles.header}>Login</Text>
        <Text style={styles.subtitle}>Sign in to see some Zachs.</Text>
        <CustomTextInput
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          icon={<MailIcon style={{ color: "white" }} />}
        />
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
          <Text style={buttonStyles.primaryButtonText}>Login</Text>
        </CustomButton>
        <View style={styles.secondaryActionsWrapper}>
          <CustomButton
            type="secondary"
            wrapperStyle={styles.secondaryButton}
            onPress={() => {
              router.push("/signup");
            }}
          >
            <Text style={buttonStyles.secondaryButtonText}>
              Create an Account
            </Text>
          </CustomButton>
          <CustomButton
            type="secondary"
            wrapperStyle={styles.secondaryButton}
            onPress={() => {
              router.push("/forgot-password");
            }}
          >
            <Text style={buttonStyles.secondaryButtonText}>
              Forgot Password?
            </Text>
          </CustomButton>
        </View>
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
