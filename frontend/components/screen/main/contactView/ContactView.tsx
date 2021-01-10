import {
  Grid,
  BoxProps,
  VStack,
  Avatar,
  Text,
  Icon,
  Center,
  Box,
} from "@chakra-ui/react";
import Header from "./components/Header";
import MainViewHeader from "components/header/MainViewHeader";
import { ContactI } from "api/types";
import { StackedIconButton } from "components/button/StackedIconButton";
import { IoChatbubbleSharp, IoTrash } from "react-icons/io5";
import { IdDisplay } from "./components/IdDisplay";

interface ContactViewProps extends BoxProps {
  contact: ContactI | null;
}

const ContactView = (props: ContactViewProps) => {
  if (!props.contact)
    return (
      <Grid gridTemplateRows="min-content 1fr" {...props}>
        <MainViewHeader />
        <Center>
          <Text color="brand.gray.200">No contact selected.</Text>
        </Center>
      </Grid>
    );

  return (
    <Grid gridAutoRows="min-content" {...props}>
      <Header>
        {props.contact &&
          `${props.contact.givenName} ${props.contact.familyName}`}
      </Header>
      <VStack my={12} mx={4}>
        <Avatar
          size="2xl"
          loading="lazy"
          name={
            props.contact &&
            `${props.contact.givenName} ${props.contact.familyName}`
          }
          src={props.contact && props.contact.profilePhotoUrl}
        />
        <Text fontSize="lg" fontWeight="medium" py={4}>
          {props.contact &&
            `${props.contact.givenName} ${props.contact.familyName}`}
        </Text>
        <Grid
          gridTemplateColumns="auto minmax(0, 1fr) auto"
          w="full"
          maxW="600px"
          gap={3}
        >
          <StackedIconButton
            icon={<Icon as={IoChatbubbleSharp} color="brand.gray.700" />}
          >
            Chat
          </StackedIconButton>
          <IdDisplay>{props.contact && props.contact.id}</IdDisplay>
          <StackedIconButton
            icon={<Icon as={IoTrash} color="brand.gray.700" />}
          >
            Delete
          </StackedIconButton>
        </Grid>
      </VStack>
    </Grid>
  );
};

export default ContactView;
