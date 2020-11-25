import Head from "next/head";
import { Box } from "@chakra-ui/react";
import BackgroundShapes from "../components/svg/BackgroundShapes";

const Index = () => {
  return (
    <Box width="100%" height="100vh" position="relative">
      <BackgroundShapes
        position="fixed"
        height="100%"
        color="#FBF6E3"
        marginLeft="50%"
        transform="translateX(-50%)"
      />
      <Head>
        <title>ChatApp</title>
      </Head>
    </Box>
  );
};

export default Index;
