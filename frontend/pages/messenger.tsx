import { GetServerSidePropsContext } from "next";
import { Amplify, withSSRContext } from "aws-amplify";
import awsConfig from "../aws-config";
import { Box, Grid } from "@chakra-ui/react";
import { Drawer } from "@frontend/components/screen/drawer/Drawer";

// Must do this for every page until issue is resolved: https://github.com/vercel/next.js/issues/16977
Amplify.configure({ ...awsConfig, ssr: true });

const Messenger = () => {
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
        gridColumn={{ base: "1 / span 1", md: "1 / span 1" }}
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
    const user = await SSR.Auth.currentAuthenticatedUser();
    return { props: {} };
  } catch (error) {
    return { redirect: { destination: "/sign_in", permanent: false } };
  }
}

export default Messenger;
