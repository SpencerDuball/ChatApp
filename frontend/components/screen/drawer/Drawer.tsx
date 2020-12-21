import { Box, BoxProps } from "@chakra-ui/react";

export interface DrawerProps extends BoxProps {}

export const Drawer = (props: BoxProps) => {
  return (
    <Box bgColor="brand.gray.50" px={3} py={4} {...props}>
      <Box bgColor="red.200" h="35px" w="35px" borderRadius="full" />
    </Box>
  );
};
