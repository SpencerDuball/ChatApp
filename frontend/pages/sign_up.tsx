import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { Box, Center, Grid, Link } from "@chakra-ui/react";
import { HeroBackground } from "@frontend/components/svg/background/HeroBackground";
import { ChatAppIcon } from "@frontend/components/svg/icon/ChatAppIcon";

const SignUp = () => {
  return (
    <>
      <Head>
        <title>Sign Up - ChatApp</title>
      </Head>
      <Box as="main" h="100%" w="100%" position="fixed" overflow="hidden">
        <HeroBackground
          h={["700px", "1000px"]}
          fill="brand.gold.50"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex="hide"
        />
        <Center h="100%" w="100%">
          <Grid autoFlow="row" gap={8}>
            <NextLink href="/" passHref>
              <Link>
                <ChatAppIcon
                  h={["128px"]}
                  w={["128px"]}
                  primaryColor="brand.red.200"
                  secondaryColor="brand.red.500"
                  textColor="brand.gray.700"
                />
              </Link>
            </NextLink>
          </Grid>
        </Center>
      </Box>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // validate JWT IdToken
  //    if (signedIn) redirect("/messenger")

  return { props: {} };
}

export default SignUp;
