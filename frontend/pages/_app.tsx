import { ChakraProvider } from "@chakra-ui/react";

const _app = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default _app;
