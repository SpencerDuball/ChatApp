import { useContext } from "react";
import MainViewHeader from "components/header/MainViewHeader";
import { Box, Center, BoxProps, Text } from "@chakra-ui/react";
import { IconButton } from "components/button/IconButton";
import { IoArrowBackSharp } from "react-icons/io5";
import {
  MessengerContext,
  setSelectedContact,
} from "context/messenger-context/context";

interface HeaderProps extends BoxProps {}

const Header = (props: HeaderProps) => {
  const [, dispatch] = useContext(MessengerContext);

  return (
    <MainViewHeader {...props}>
      <Center h="full" position="relative">
        <Box
          position="absolute"
          top="50%"
          transform="translateY(-50%)"
          left={4}
        >
          <IconButton
            icon={<IoArrowBackSharp />}
            h={6}
            w={6}
            display={{ base: "grid", md: "none" }}
            onClick={() => setSelectedContact(dispatch, null)}
          />
        </Box>
        <Text color="brand.gray.700">{props.children}</Text>
      </Center>
    </MainViewHeader>
  );
};

export default Header;
