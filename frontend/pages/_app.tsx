import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme/index";

const _app = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default _app;
