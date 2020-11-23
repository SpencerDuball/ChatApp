import * as React from "react";
import { ChakraProvider, Box, Center, theme } from "@chakra-ui/react";
import { AuthContextProvider } from "./context/auth/AuthContext";

export const App = () => (
  <AuthContextProvider>
    <ChakraProvider theme={theme}>
      <Center h="100%" w="100%" bgColor="red.100">
        <Box maxW="1000px" h="100vh" w="100%" bgColor="blue.500">
          <Center h="100%" w="100%">
            <Box
              w={300}
              h={500}
              bgColor="white"
              borderRadius="20px"
              boxShadow="lg"
            ></Box>
          </Center>
        </Box>
      </Center>
    </ChakraProvider>
  </AuthContextProvider>
);
