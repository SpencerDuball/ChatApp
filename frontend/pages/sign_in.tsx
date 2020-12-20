import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { Box } from "@chakra-ui/react";
import { HeroBackground } from "@frontend/components/svg/background/HeroBackground";

const SignIn = () => {
  return (
    <>
      <Head>
        <title>Sign In - ChatApp</title>
      </Head>
      <Box as="body" h="100vh" w="100%" position="fixed">
        <Box as="main" h="100vh" w="100%" position="relative" overflow="hidden">
          <HeroBackground
            h={["700px", "1000px"]}
            fill="brand.gold.50"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          />
        </Box>
      </Box>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // validate JWT IdToken
  //    if (signedIn) redirect("/messenger")

  return { props: {} };
}

export default SignIn;
