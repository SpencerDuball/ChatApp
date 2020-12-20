import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme/index";
import { AppContextProvider } from "context/app-context/context";
import Amplify from "aws-amplify";
import awsConfig from "../aws-config";

const _app = ({ Component, pageProps }) => {
  return (
    <AppContextProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </AppContextProvider>
  );
};

export default _app;
