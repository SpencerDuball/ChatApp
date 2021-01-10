import { Box, BoxProps, Text } from "@chakra-ui/react";

interface MainViewHeaderProps extends BoxProps {}

const MainViewHeader = (props: MainViewHeaderProps) => {
  return (
    <Box
      height={"60px"}
      fontWeight="medium"
      bgColor="brand.gray.50"
      borderBottom="1px solid black"
      borderBottomColor="brand.gray.200"
      {...props}
    >
      {props.children}
    </Box>
  );
};

export default MainViewHeader;
