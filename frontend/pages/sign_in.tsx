import { Box } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";

const SignIn = () => {
  return <Box>hello</Box>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // validate JWT IdToken
  //    if (signedIn) redirect("/messenger")

  return { props: {} };
}

export default SignIn;
