import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme/index";
import { AppContextProvider } from "context/app-context/context";
import Amplify from "aws-amplify";
import awsConfig from "../aws-config";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClientProvider, QueryClient } from "react-query";

// setup authentication
Amplify.configure({ ...awsConfig, ssr: true });

// create a query client
const queryClient = new QueryClient();

const _app = ({ Component, pageProps }) => {
  return (
    <AppContextProvider>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} position="top-right" />
        </QueryClientProvider>
      </ChakraProvider>
    </AppContextProvider>
  );
};

export default _app;
