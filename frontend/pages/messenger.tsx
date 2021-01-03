import { useState } from "react";
import { GetServerSidePropsContext } from "next";
import { Amplify, withSSRContext } from "aws-amplify";
import awsConfig from "../aws-config";
import { Box, Grid, useToken } from "@chakra-ui/react";
import { Drawer } from "components/screen/drawer/Drawer";
import { ContactI } from "api/types";

// Must do this for every page until issue is resolved: https://github.com/vercel/next.js/issues/16977
Amplify.configure({ ...awsConfig, ssr: true });

const Messenger = () => {
  const [brandGray200] = useToken("colors", ["brand.gray.200"]);
  const [selectedContact, setSelectedContact] = useState<ContactI | null>(null);

  return (
    <Grid
      as="main"
      h="100%"
      w="100%"
      position="fixed"
      overflow="hidden"
      gridTemplateColumns={{
        base: "1fr",
        md: "320px auto",
        lg: "350px auto",
      }}
      gridTemplateRows="100%"
    >
      <Drawer
        h="100%"
        gridRow="1 / span 1"
        borderRight={{ base: "none", md: `1px solid ${brandGray200}` }}
        gridColumn={{ base: "1 / span 1", md: "1 / span 1" }}
        contactInfo={{ selectedContact, setSelectedContact }}
      />
      <Box
        gridRow="1 / span 1"
        gridColumn={{ base: "1 / span 1", md: "2 / span 1" }}
      />
    </Grid>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const SSR = withSSRContext({ req: context.req });

  // redirect user to '/sign_in' if not authenticated
  try {
    // check if signed in
    await SSR.Auth.currentAuthenticatedUser().catch((e) =>
      // currentAuthenticatedUser() might throw if the accessId has expired
      // call currentSession() to get new tokens if refreshToken is still valid
      SSR.Auth.currentSession()
    );
    return { props: {} };
  } catch (error) {
    return { redirect: { destination: "/sign_in", permanent: false } };
  }
}

export default Messenger;
