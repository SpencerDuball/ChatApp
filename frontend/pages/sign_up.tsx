import { GetServerSidePropsContext } from "next";
import { Box } from "@chakra-ui/react";

const SignUp = () => {
  return <Box>sign_up</Box>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // validate JWT IdToken
  //    if (signedIn) redirect("/messenger")

  return { props: {} };
}

export default SignUp;
