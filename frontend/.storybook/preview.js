import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme/index";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

// Add the ChakraProvider so all stories have access to theme tokens.
export const decorators = [
  (Story) => (
    <ChakraProvider theme={theme}>
      <Story />
    </ChakraProvider>
  ),
];
