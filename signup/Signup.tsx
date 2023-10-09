import { Text, FormControl, VStack, Heading, Input, InputField, InputSlot, InputIcon, Button, ButtonText } from "@gluestack-ui/themed";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { FC, useCallback, useState } from "react";

const Signup: FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const togglePasswordVisible = () => {
        setShowPassword((showState) => {
            return !showState
        })
    }

    const onSubmit = useCallback(() => {
        
    }, [email, password])
    return (
        <FormControl
            p="$4"
            borderWidth="$1"
            borderRadius="$lg"
            borderColor="$borderLight300"
            width="$2/3"
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
                        <InputField type="text" keyboardType="email-address" autoCapitalize='none' autoComplete="email" value={email} onChangeText={setEmail} />
                    </Input>
                </VStack>
                <VStack space="xs">
                    <Text color="$text500" lineHeight="$xs">
                        Password
                    </Text>
                    <Input>
                        <InputField type={showPassword ? "text" : "password"} value={password} onChangeText={setPassword} />
                        <InputSlot pr="$3" onPress={togglePasswordVisible}>
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