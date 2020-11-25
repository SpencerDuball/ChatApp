import Head from "next/head";
import { Box } from "@chakra-ui/react";

const Index = () => {
  return (
    <>
      <Head>
        <title>ChatApp</title>
      </Head>
      <Box width="100%" height="100vh" bgColor="brand.red.100">
        Index Page
      </Box>
    </>
  );
};

export default Index;
