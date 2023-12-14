import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react-native";
import { FC, useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Alert, TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import SafeAndroidView from "../../components/SafeAndroidView";
import CustomTextInput from "../../components/CustomTextInput";
import CustomButton from "../../components/CustomButton";

const Signup: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function signUpWithEmail(email: string, password: string) {
    setLoading(true);
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);

    console.log("signup data: ", data)

    // commence onboarding
    if (!error) router.replace("/signup/information");
  }

  const submit = useCallback(() => {
    signUpWithEmail(email, password);
  }, [email, password]);
  return (
    <SafeAndroidView>
      <View style={styles.container}>
        <Text style={styles.header}>Create an Account</Text>
        <Text style={styles.subtitle}>Sign up, see some Zachs.</Text>
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
          <Text style={styles.primaryButtonText}>Create Account</Text>
        </CustomButton>
        <View style={styles.secondaryActionsWrapper}>
          <Text style={styles.alreadyHaveAccount}>Already have an account?</Text>
          <CustomButton
            type="secondary"
            wrapperStyle={styles.secondaryButton}
            onPress={() => {
              router.replace("/login");
            }}
          >
            <Text style={styles.secondaryButtonText}>Log in</Text>
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
  },
  secondaryButton: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButtonText: {
    textDecorationLine: "underline",
    color: "#AAAAAA",
    flexGrow: 1
  },
  alreadyHaveAccount: {
    color: "#AAAAAA",
    paddingRight: 4,
    alignItems: "flex-start"
  },
});

export default Signup;
