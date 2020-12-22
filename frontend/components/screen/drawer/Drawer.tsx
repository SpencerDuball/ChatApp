import { useRef, useState, useLayoutEffect } from "react";
import { Box, BoxProps, VStack, IconButton, Icon } from "@chakra-ui/react";
import { IoChatbubble, IoPeople } from "react-icons/io5";
import { ContactItem } from "@frontend/components/li/ContactItem";
import { Header } from "@frontend/components/screen/drawer/Header";
import { Footer } from "@frontend/components/screen/drawer/Footer";

export interface DrawerProps extends BoxProps {}

export const Drawer = (props: BoxProps) => {
  // use refs to collect header & footer height values
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const [heightOf, setHeightOf] = useState({ header: "0px", footer: "0px" });

  // header controlled input
  const [headerValue, setHeaderValue] = useState("");

  // TODO: extract to hook
  useLayoutEffect(() => {
    if (headerRef && headerRef.current && footerRef && footerRef.current) {
      setHeightOf({
        header: `${headerRef.current.clientHeight}px`,
        footer: `${footerRef.current.clientHeight}px`,
      });
    }
  }, []);

  return (
    <Box bgColor="brand.gray.50" {...props} position="relative">
      <Header
        ref={headerRef}
        position="absolute"
        top="0"
        left="0"
        title="Contacts"
        value={headerValue}
        handleChange={(e) => setHeaderValue(e.target.value)}
      />
      {/* Content */}
      <Box h="full" w="full" overflow="auto">
        <VStack pt={heightOf.header} pb={heightOf.footer} spacing={1} px={3}>
          <ContactItem sub="809dfs20" givenName="Spencer" familyName="Duball" />
          <ContactItem sub="80dfs20" givenName="Luke" familyName="Duball" />
          <ContactItem sub="89dfs20" givenName="Jerry" familyName="Duball" />
          <ContactItem sub="809fs20" givenName="Russ" familyName="Hannamen" />
          <ContactItem sub="809ds20" givenName="Keri" familyName="Washington" />
          <ContactItem sub="809df20" givenName="Robert" familyName="Duvall" />
          <ContactItem sub="809dfs0" givenName="Russell" familyName="Stewart" />
          <ContactItem
            sub="809dfs2"
            isSelected
            givenName="Tyfus"
            familyName="Kerfa"
          />
          <ContactItem sub="809d" givenName="Alski" familyName="Stenba" />
          <ContactItem sub="39022094" givenName="Brad" familyName="Pitt" />
          <ContactItem sub="3902193" givenName="Hillary" familyName="Clinton" />
          <ContactItem sub="kdjlfsp" givenName="Donald" familyName="Trump" />
          <ContactItem sub="1093fkl" givenName="Carrot" familyName="Stick" />
          <ContactItem sub="dlksf" givenName="Morgan" familyName="Freeman" />
        </VStack>
      </Box>
      <Footer ref={footerRef} position="absolute" bottom="0" left="0">
        <IconButton
          aria-label="Toggle to Chats"
          bg="none"
          _focus={{ boxShadow: "none" }}
          _active={{ bg: "none" }}
          _hover={{ bg: "none" }}
          icon={<Icon as={IoChatbubble} fill="brand.gray.100" h={6} w={6} />}
        />
        <IconButton
          aria-label="Toggle to Contacts"
          bg="none"
          _focus={{ boxShadow: "none" }}
          _active={{ bg: "none" }}
          _hover={{ bg: "none" }}
          icon={<Icon as={IoPeople} fill="brand.gray.100" h={6} w={6} />}
        />
      </Footer>
    </Box>
  );
};
