import { MailIcon } from "lucide-react-native";
import { FC, useCallback, useState } from "react";
import { supabase } from "@lib/supabase";
import { Alert, View, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import SafeAndroidView from "@components/SafeAndroidView";
import CustomTextInput from "@components/CustomTextInput";
import CustomButton, { buttonStyles } from "@components/CustomButton";

const Login: FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  async function requestPasswordReset(email: string) {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://dailyzach.zachhuxford.io/reset-password",
    });

    if (error) Alert.alert(error.message);
    setLoading(false);

    if (!error) setEmailSent(true);
  }

  const submit = useCallback(() => {
    requestPasswordReset(email);
  }, [email]);

  if (emailSent) {
    <SafeAndroidView>
      <View style={styles.container}>
        <Text style={styles.header}>Reset Password Email Sent</Text>
        <Text style={styles.subtitle}>
          Please check your email to find your password reset link. If you have
          any issues, please try again or contact customer support.
        </Text>
        <View style={styles.secondaryActionsWrapper}>
          <CustomButton
            type="secondary"
            wrapperStyle={styles.secondaryButton}
            onPress={() => {
              setEmailSent(false);
            }}
          >
            <Text style={buttonStyles.secondaryButtonText}>Try again</Text>
          </CustomButton>
          {router.canGoBack() && (
            <CustomButton
              type="secondary"
              wrapperStyle={styles.secondaryButton}
              onPress={() => {
                router.back();
              }}
            >
              <Text style={buttonStyles.secondaryButtonText}>Back</Text>
            </CustomButton>
          )}
        </View>
      </View>
    </SafeAndroidView>;
  }
  return (
    <SafeAndroidView>
      <View style={styles.container}>
        <Text style={styles.header}>Forgot password?</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a password resest link if
          your account exists.
        </Text>
        <CustomTextInput
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          icon={<MailIcon style={{ color: "white" }} />}
        />
        <CustomButton disabled={loading} loading={loading} onPress={submit}>
          <Text style={buttonStyles.primaryButtonText}>Continue</Text>
        </CustomButton>
        <View style={styles.secondaryActionsWrapper}>
          <CustomButton
            type="secondary"
            wrapperStyle={styles.secondaryButton}
            onPress={() => {
              router.push("/login");
            }}
          >
            <Text style={buttonStyles.secondaryButtonText}>Back to Login</Text>
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
