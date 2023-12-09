import {
  VStack,
  Heading,
  Input,
  InputField,
  InputSlot,
  InputIcon,
  Button,
  ButtonText,
  HStack,
  ButtonSpinner,
} from "@gluestack-ui/themed";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { FC, useCallback, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Alert, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import SafeAndroidView from "../../components/SafeAndroidView";

const Login: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisible = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };
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
        <VStack space="xl">
          <Heading color="$text900" lineHeight="$md">
            Login
          </Heading>
          <Input>
            <InputField
              type="text"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
            />
          </Input>
          <Input>
            <InputField
              type={showPassword ? "text" : "password"}
              color="black"
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
            />
            <InputSlot pr="$3" onPress={togglePasswordVisible}>
              <InputIcon
                as={showPassword ? EyeIcon : EyeOffIcon}
                color="$darkBlue500"
              />
            </InputSlot>
          </Input>
          <Button width="$full" isDisabled={loading} onPress={submit}>
            {loading && <ButtonSpinner mr="$1" />}
            <ButtonText color="$white">Login</ButtonText>
          </Button>
          <HStack>
            <Button
              action="secondary"
              isDisabled={loading}
              onPress={() => {
                router.replace("/signup");
              }}
            >
              <ButtonText>Create an Account</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </View>
    </SafeAndroidView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default Login;
