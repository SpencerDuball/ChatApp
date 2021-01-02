import { useRef, useState, useEffect } from "react";
import {
  Box,
  BoxProps,
  VStack,
  IconButton,
  Icon,
  Skeleton,
} from "@chakra-ui/react";
import { IoChatbubble, IoPeople } from "react-icons/io5";
import { ContactItem } from "@frontend/components/li/ContactItem";
import { Header } from "@frontend/components/screen/drawer/Header";
import { Footer } from "@frontend/components/screen/drawer/Footer";
import { useQuery } from "react-query";
import { API } from "@frontend/context/app-context/API";

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
  const contacts = useQuery("contacts", async () => {
    const data = await API.get("/test/contacts");
    return data.data;
  });

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
          {contacts.data ? (
            contacts.data.body.map((contact) => (
              <ContactItem
                key={contact.SK}
                sub={contact.SK}
                givenName={contact.givenName}
                familyName={contact.familyName}
              />
            ))
          ) : (
            <>
              <Skeleton width="100%" endColor="brand.gray.100">
                <ContactItem
                  key="skeleton-1"
                  sub="skeleton-1"
                  givenName=""
                  familyName=""
                />
              </Skeleton>
              <Skeleton width="100%" endColor="brand.gray.100">
                <ContactItem
                  key="skeleton-2"
                  sub="skeleton-2"
                  givenName=""
                  familyName=""
                />
              </Skeleton>
              <Skeleton width="100%" endColor="brand.gray.100">
                <ContactItem
                  key="skeleton-3"
                  sub="skeleton-3"
                  givenName=""
                  familyName=""
                />
              </Skeleton>
            </>
          )}
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
