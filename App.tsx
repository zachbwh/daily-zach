import { GluestackUIProvider, Box } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import Signup from "./signup";

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <Box width="100%" height="100%" justifyContent="center" alignItems="center">
        <Signup />
      </Box>
    </GluestackUIProvider>
  );
}