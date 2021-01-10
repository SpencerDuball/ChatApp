import MainViewHeader from "components/header/MainViewHeader";
import { Center, BoxProps, Text } from "@chakra-ui/react";

interface HeaderProps extends BoxProps {}

const Header = (props: HeaderProps) => {
  return (
    <MainViewHeader {...props}>
      <Center h="full">
        <Text color="brand.gray.700">{props.children}</Text>
      </Center>
    </MainViewHeader>
  );
};

export default Header;
