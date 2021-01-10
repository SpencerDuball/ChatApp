import {
  Grid,
  BoxProps,
  VStack,
  Avatar,
  Text,
  Icon,
  Center,
  Input,
  Textarea,
} from "@chakra-ui/react";
import Header from "./components/Header";
import MainViewHeader from "components/header/MainViewHeader";
import { ContactI } from "api/types";
import { StackedIconButton } from "components/button/StackedIconButton";
import { IoChatbubbleSharp, IoTrash } from "react-icons/io5";
import { IdDisplay } from "./components/IdDisplay";
import { API } from "api/API";
import {
  MessengerContext,
  setSelectedContact,
} from "context/messenger-context/context";
import { useContext, useState } from "react";
import { IconButton } from "components/button/IconButton";
import { IoArrowBackSharp, IoSaveSharp, IoPencilSharp } from "react-icons/io5";

interface ContactViewProps extends BoxProps {
  contact: ContactI | null;
}

const ContactView = (props: ContactViewProps) => {
  const [state, dispatch] = useContext(MessengerContext);
  const [isEditing, setIsEditing] = useState(true);

  if (!props.contact)
    return (
      <Grid gridTemplateRows="min-content 1fr" {...props}>
        <MainViewHeader />
        <Center>
          <Text color="brand.gray.200">No contact selected.</Text>
        </Center>
      </Grid>
    );

  if (isEditing)
    return (
      <Grid gridAutoRows="min-content" bgColor="white" {...props}>
        <MainViewHeader
          display="grid"
          gridTemplateColumns="16px 1fr 16px"
          alignContent="center"
          px={6}
        >
          <IconButton
            h={6}
            w={6}
            icon={<IoArrowBackSharp />}
            display={{ base: "grid", md: "none" }}
            gridColumn="1 / span 1"
            onClick={() => setSelectedContact(dispatch, null)}
          />
          <Text
            color="brand.gray.700"
            gridColumn="2 / span 1"
            textAlign="center"
          >
            {`${props.contact.givenName} ${props.contact.familyName}`}
          </Text>
          <IconButton
            h={6}
            w={6}
            gridColumn="3 / span 1"
            icon={<IoSaveSharp />}
            onClick={() => setIsEditing(false)}
          />
        </MainViewHeader>
      </Grid>
    );

  return (
    <Grid gridAutoRows="min-content" bgColor="white" {...props}>
      <MainViewHeader
        display="grid"
        gridTemplateColumns="16px 1fr 16px"
        alignContent="center"
        px={6}
      >
        <IconButton
          h={6}
          w={6}
          icon={<IoArrowBackSharp />}
          display={{ base: "grid", md: "none" }}
          gridColumn="1 / span 1"
          onClick={() => setSelectedContact(dispatch, null)}
        />
        <Text color="brand.gray.700" gridColumn="2 / span 1" textAlign="center">
          {`${props.contact.givenName} ${props.contact.familyName}`}
        </Text>
        <IconButton
          h={6}
          w={6}
          gridColumn="3 / span 1"
          icon={<IoPencilSharp />}
          onClick={() => setIsEditing(true)}
        />
      </MainViewHeader>
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
          <IdDisplay id={props.contact && props.contact.id} />
          <StackedIconButton
            icon={<Icon as={IoTrash} color="brand.gray.700" />}
            onClick={() => {
              API.delete(`/test/contact/${props.contact.id}`).then(() =>
                setSelectedContact(dispatch, null)
              );
            }}
          >
            Delete
          </StackedIconButton>
        </Grid>
        <Textarea
          isReadOnly
          placeholder="Notes"
          value={props.contact.notes}
          bgColor="brand.gray.50"
          border="none"
          color="brand.gray.700"
          maxW="600px"
          height="175px"
        />
      </VStack>
    </Grid>
  );
};

export default ContactView;
