import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import theme from "../theme/theme";
import Amplify from "aws-amplify";
import awsConfig from "../aws-config";
import { AppContextProvider } from "context/app-context/AppContext";
import Head from "next/head";

Amplify.configure(awsConfig);

const extendedTheme = extendTheme(theme);

const _app = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>ChatApp</title>
      </Head>
      <AppContextProvider>
        <ChakraProvider theme={extendedTheme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </AppContextProvider>
    </>
  );
};

export default _app;
