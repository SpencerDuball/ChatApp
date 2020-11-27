import Head from "next/head";
import { Box } from "@chakra-ui/react";

const Messenger = () => {
  return (
    <>
      <Head>
        <title>Messenger - ChatApp</title>
      </Head>
      <Box h="100vh" w="100%" bgColor="brand.blue.200">
        hello
      </Box>
    </>
  );
};

export default Messenger;
