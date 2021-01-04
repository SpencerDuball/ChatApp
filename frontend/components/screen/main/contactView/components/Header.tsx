import { Center, CenterProps, Text } from "@chakra-ui/react";

interface HeaderProps extends CenterProps {}

const Header = (props: HeaderProps) => {
  return (
    <Center
      height={"60px"}
      fontWeight="medium"
      bgColor="brand.gray.50"
      borderBottom="1px solid black"
      borderBottomColor="brand.gray.200"
      {...props}
    >
      <Text color="brand.gray.700">{props.children}</Text>
    </Center>
  );
};

export default Header;
