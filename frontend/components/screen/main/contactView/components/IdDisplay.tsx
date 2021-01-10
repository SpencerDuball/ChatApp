import { useState } from "react";
import {
  Input,
  Box,
  BoxProps,
  Center,
  Icon,
  useToken,
  useClipboard,
} from "@chakra-ui/react";
import { IoCopy } from "react-icons/io5";
import hexToRGB from "util/hexToRGB";

interface IdDisplay extends BoxProps {
  id: string;
}

export const IdDisplay = (props: IdDisplay) => {
  const [gray100] = useToken("colors", ["brand.gray.100"]);
  const [value, setValue] = useState(props.id);
  const { onCopy } = useClipboard(value);

  return (
    <Box bgColor="brand.gray.50" borderRadius="md" {...props}>
      <Center h="full" position="relative">
        <Input
          color="brand.gray.700"
          pl={3}
          w="full"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          fontSize="xs"
          textAlign="center"
          isReadOnly
          border="none"
          value={value}
        />
        <Icon
          as={IoCopy}
          h={5}
          w={5}
          color={hexToRGB(gray100, 0.8)}
          _hover={{ color: gray100 }}
          mr={3}
          onClick={onCopy}
        />
      </Center>
    </Box>
  );
};
