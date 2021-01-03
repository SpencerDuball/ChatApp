import { useRef, useState, useEffect, useContext } from "react";
import { Box, BoxProps, VStack, IconButton, Icon } from "@chakra-ui/react";
import { IoChatbubble, IoPeople } from "react-icons/io5";
import { ContactItem } from "components/li/ContactItem";
import { ContactItemSkeleton } from "components/li/ContactItemSkeleton";
import { Header } from "components/screen/drawer/components/Header";
import { Footer } from "components/screen/drawer/components/Footer";
import {
  MessengerContext,
  setSelectedContact,
} from "context/messenger-context/context";

export interface DrawerProps extends BoxProps {}

export const Drawer = (props: DrawerProps) => {
  // use refs to collect header & footer height values
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const [heightOf, setHeightOf] = useState({ header: "0px", footer: "0px" });
  useEffect(() => {
    if (headerRef && headerRef.current && footerRef && footerRef.current) {
      setHeightOf({
        header: `${headerRef.current.clientHeight}px`,
        footer: `${footerRef.current.clientHeight}px`,
      });
    }
  }, []);

  // drawer UI control
  const [headerValue, setHeaderValue] = useState("");
  const [currentDrawer, setCurrentDrawer] = useState("chats");

  // API data
  const [state, dispatch] = useContext(MessengerContext);

  return (
    <Box bgColor="brand.gray.50" position="relative" {...props}>
      <Header
        ref={headerRef}
        position="absolute"
        top="0"
        left="0"
        title={currentDrawer === "chats" ? "Chats" : "Contacts"}
        value={headerValue}
        handleChange={(e) => setHeaderValue(e.target.value)}
      />
      {/* Content */}
      <Box h="full" w="full" overflow="auto">
        <VStack pt={heightOf.header} pb={heightOf.footer} spacing={1} px={3}>
          {state.contacts
            ? state.contacts.map((contact) => (
                <ContactItem
                  key={contact.id}
                  givenName={contact.givenName}
                  familyName={contact.familyName}
                  profilePhotoUrl={
                    contact.profilePhotoUrl ? contact.profilePhotoUrl : null
                  }
                  isSelected={state.selectedContact.id === contact.id}
                  onClick={() => setSelectedContact(dispatch, contact)}
                />
              ))
            : Array.from({ length: 5 }).map((_, key) => (
                <ContactItemSkeleton key={key} />
              ))}
        </VStack>
      </Box>
      <Footer ref={footerRef} position="absolute" bottom="0" left="0">
        <IconButton
          aria-label="Toggle to Chats"
          bg="none"
          _focus={{ boxShadow: "none" }}
          _active={{ bg: "none" }}
          _hover={{ bg: "none" }}
          onClick={() => setCurrentDrawer("chats")}
          icon={
            <Icon
              as={IoChatbubble}
              fill={
                currentDrawer === "chats" ? "brand.red.100" : "brand.gray.100"
              }
              h={6}
              w={6}
            />
          }
        />
        <IconButton
          aria-label="Toggle to Contacts"
          bg="none"
          _focus={{ boxShadow: "none" }}
          _active={{ bg: "none" }}
          _hover={{ bg: "none" }}
          onClick={() => setCurrentDrawer("contacts")}
          icon={
            <Icon
              as={IoPeople}
              fill={
                currentDrawer === "contacts"
                  ? "brand.red.100"
                  : "brand.gray.100"
              }
              h={6}
              w={6}
            />
          }
        />
      </Footer>
    </Box>
  );
};
