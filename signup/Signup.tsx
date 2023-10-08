import { Text, FormControl, VStack, Heading, Input, InputField, InputSlot, InputIcon, Button, ButtonText } from "@gluestack-ui/themed";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { FC, useState } from "react";

const Signup: FC = () => {
    const [showPassword, setShowPassword] = useState(false)
    const handleState = () => {
      setShowPassword((showState) => {
        return !showState
      })
    }
    return (
      <FormControl
        p="$4"
        borderWidth="$1"
        borderRadius="$lg"
        borderColor="$borderLight300"
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
            Signup
          </Heading>
          <VStack space="xs">
            <Text color="$text500" lineHeight="$xs">
              Email
            </Text>
            <Input>
              <InputField type="text" />
            </Input>
          </VStack>
          <VStack space="xs">
            <Text color="$text500" lineHeight="$xs">
              Password
            </Text>
            <Input>
              <InputField type={showPassword ? "text" : "password"} />
              <InputSlot pr="$3" onPress={handleState}>
                {/* EyeIcon, EyeOffIcon are both imported from 'lucide-react-native' */}
                <InputIcon
                  as={showPassword ? EyeIcon : EyeOffIcon}
                  color="$darkBlue500"
                />
              </InputSlot>
            </Input>
          </VStack>
          <Button
            ml="auto"
            onPress={() => {
            }}
          >
            <ButtonText color="$white">Save</ButtonText>
          </Button>
        </VStack>
      </FormControl>
    )
}

export default Signup