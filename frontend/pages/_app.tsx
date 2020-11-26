import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import theme from "../theme/theme";
import Amplify from "aws-amplify";
import awsConfig from "../aws-config";
import { AuthContextProvider } from "context/auth-context/AuthContext";

Amplify.configure(awsConfig);

const extendedTheme = extendTheme(theme);

const _app = ({ Component, pageProps }) => {
  return (
    <AuthContextProvider>
      <ChakraProvider theme={extendedTheme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthContextProvider>
  );
};

export default _app;
