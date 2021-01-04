import { Box, BoxProps, Center, Text, Icon, useToken } from "@chakra-ui/react";
import { IoCopy } from "react-icons/io5";
import hexToRGB from "util/hexToRGB";

interface IdDisplay extends BoxProps {}

export const IdDisplay = (props: IdDisplay) => {
  const [gray100] = useToken("colors", ["brand.gray.100"]);

  return (
    <Box bgColor="brand.gray.50" borderRadius="md" {...props}>
      <Center h="full" position="relative">
        <Text
          color="brand.gray.700"
          pl={3}
          w="full"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          fontSize="xs"
        >
          {props.children}
        </Text>
        <Icon as={IoCopy} h={5} w={5} color={hexToRGB(gray100, 0.8)} mr={3} />
      </Center>
    </Box>
  );
};
