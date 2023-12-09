import {
  ButtonText,
  ButtonSpinner,
} from "@gluestack-ui/themed";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react-native";
import { FC, useCallback, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Alert, View, StyleSheet, Text, TouchableOpacity, Button, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import SafeAndroidView from "../../components/SafeAndroidView";
import CustomTextInput from "../../components/CustomTextInput";

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

    if (!error) router.replace("/home/posts");
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
        <Button disabled={loading} onPress={submit} title="Login" />
        <Button
          disabled={loading}
          onPress={() => {
            router.replace("/signup");
          }}
          title="Create an Account"
        />
        <ActivityIndicator color="#FFFFFF" />
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
});

export default Login;
