import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme/index";
import { AppContextProvider } from "@frontend/context/app-context/context";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

// Add the ChakraProvider so all stories have access to theme tokens.
export const decorators = [
  (Story) => (
    <AppContextProvider>
      <ChakraProvider theme={theme}>
        <Story />
      </ChakraProvider>
    </AppContextProvider>
  ),
];
