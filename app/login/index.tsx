import {
  Text,
  FormControl,
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
  Box,
} from "@gluestack-ui/themed";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { FC, useCallback, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

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

    if (!error) router.replace("/home/posts")
  }

  const submit = useCallback(() => {
    loginWithEmail(email, password);
  }, [email, password]);
  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <FormControl
        p="$4"
        borderWidth="$1"
        borderRadius="$lg"
        borderColor="$borderLight300"
        width="$3/4"
        sx={{
          _dark: {
            borderWidth: "$1",
            borderRadius: "$lg",
            borderColor: "$borderDark800",
          },
        }}
      >
        <VStack space="xl">
          <Heading color="$text900" lineHeight="$md">
            Login
          </Heading>
          <VStack space="xs">
            <Text color="$text500" lineHeight="$xs">
              Email
            </Text>
            <Input>
              <InputField
                type="text"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
              />
            </Input>
          </VStack>
          <VStack space="xs">
            <Text color="$text500" lineHeight="$xs">
              Password
            </Text>
            <Input>
              <InputField
                type={showPassword ? "text" : "password"}
                color="black"
                value={password}
                onChangeText={setPassword}
              />
              <InputSlot pr="$3" onPress={togglePasswordVisible}>
                <InputIcon
                  as={showPassword ? EyeIcon : EyeOffIcon}
                  color="$darkBlue500"
                />
              </InputSlot>
            </Input>
          </VStack>
          <HStack>
            <Button
              action="secondary"
              isDisabled={loading}
              onPress={() => {
                router.replace("/signup");
              }}
            >
              <ButtonText>
                Switch to Signup
              </ButtonText>
            </Button>
            <Button ml="auto" isDisabled={loading} onPress={submit}>
              {loading && <ButtonSpinner mr="$1" />}
              <ButtonText color="$white">
                Login
              </ButtonText>
            </Button>
          </HStack>
        </VStack>
      </FormControl>
    </Box>
  );
};

export default Login;
