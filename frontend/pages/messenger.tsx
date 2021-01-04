import { GetServerSidePropsContext } from "next";
import { Amplify, withSSRContext } from "aws-amplify";
import awsConfig from "../aws-config";
import { Box, Grid, useToken } from "@chakra-ui/react";
import { Drawer } from "components/screen/drawer/Drawer";
import {
  MessengerContextProvider,
  MessengerContext,
} from "context/messenger-context/context";
import ContactView from "components/screen/main/contactView/ContactView";

// Must do this for every page until issue is resolved: https://github.com/vercel/next.js/issues/16977
Amplify.configure({ ...awsConfig, ssr: true });

const Messenger = () => {
  const [brandGray200] = useToken("colors", ["brand.gray.200"]);

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
      <MessengerContextProvider>
        <Drawer
          h="100%"
          gridRow="1 / span 1"
          borderRight={{ base: "none", md: `1px solid ${brandGray200}` }}
          gridColumn={{ base: "1 / span 1", md: "1 / span 1" }}
        />
        <MessengerContext.Consumer>
          {([state]) => {
            if (state.selectedView === "CONTACT")
              return (
                <ContactView
                  gridRow="1 / span 1"
                  gridColumn={{ base: "1 / span 1", md: "2 / span 1" }}
                  contact={state.selectedContact}
                />
              );
            else return <p>hi</p>;
          }}
        </MessengerContext.Consumer>
      </MessengerContextProvider>
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
