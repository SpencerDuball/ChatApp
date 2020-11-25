import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import theme from "../theme/theme";

const extendedTheme = extendTheme(theme);

const _app = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={extendedTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default _app;
