import Head from "next/head";
import { Box } from "@chakra-ui/react";
import BackgroundShapes from "../components/svg/BackgroundShapes";

const Index = () => {
  return (
    <>
      <Head>
        <title>ChatApp</title>
      </Head>
      <Box width="100%" height="100vh" bgColor="red.300"></Box>
    </>
  );
};

export default Index;
