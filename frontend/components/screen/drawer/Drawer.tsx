import {
  useRef,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { Box, BoxProps, VStack, IconButton, Icon } from "@chakra-ui/react";
import { IoChatbubble, IoPeople } from "react-icons/io5";
import { ContactItem } from "components/li/ContactItem";
import { ContactItemSkeleton } from "components/li/ContactItemSkeleton";
import { Header } from "components/screen/drawer/components/Header";
import { Footer } from "components/screen/drawer/components/Footer";
import { useQuery } from "react-query";
import { API } from "api/API";
import { AppContext } from "context/app-context/context";
import { ContactI } from "api/types";

export interface DrawerProps extends BoxProps {
  contactInfo: {
    selectedContact: ContactI;
    setSelectedContact: Dispatch<SetStateAction<ContactI>>;
  };
}

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
  const [state] = useContext(AppContext);
  const contacts = useQuery(
    "contacts",
    async () => {
      const res = await API.get("/test/contacts");
      return res.data;
    },
    { enabled: !!state.credentials }
  );

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
          {contacts.data
            ? contacts.data.body.map((contact) => (
                <ContactItem
                  key={contact.id}
                  givenName={contact.givenName}
                  familyName={contact.familyName}
                  profilePhotoUrl={
                    contact.profilePhotoUrl ? contact.profilePhotoUrl : null
                  }
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
