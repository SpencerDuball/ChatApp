import Head from "next/head";
import { Box, Center, Grid } from "@chakra-ui/react";
import BackgroundIllustrations from "components/svg/BackgroundIllustrations";
import ChatAppLogo from "components/svg/ChatAppLogo";

const SignUp = () => {
  return (
    <>
      <Head>
        <title>ChatApp | Sign Up</title>
      </Head>
      <Box as="main" h="100vh" w="100%" position="relative">
        <BackgroundIllustrations
          fill="brand.gold.50"
          position="fixed"
          h="100%"
          left="50%"
          transform="translateX(-50%)"
          zIndex="hide"
        />
        <Center h="100%" w="100%">
          <Grid templateRows="max-content max-content" gap={10}>
            <Box bgColor="blue.200">
              <ChatAppLogo
                primaryColor="brand.red.200"
                secondaryColor="brand.red.600"
                textColor="brand.gray.700"
              />
            </Box>
            <Box h="200px" w="200px" bgColor="red.200" />
          </Grid>
        </Center>
      </Box>
    </>
  );
};

export default SignUp;
