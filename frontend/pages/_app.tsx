import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import theme from "../theme/theme";
import Amplify from "aws-amplify";
import awsConfig from "../aws-config";
import { AppContextProvider } from "context/app-context/AppContext";

Amplify.configure(awsConfig);

const extendedTheme = extendTheme(theme);

const _app = ({ Component, pageProps }) => {
  return (
    <AppContextProvider>
      <ChakraProvider theme={extendedTheme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </AppContextProvider>
  );
};

export default _app;
