import { BaseSyntheticEvent, useContext } from "react";
import { signIn, AppContext } from "context/app-context/AppContext";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Center,
  Button,
  HStack,
  PinInput,
  PinInputField,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";

interface IConfirmEmailInput {
  otc_1: string;
  otc_2: string;
  otc_3: string;
  otc_4: string;
  otc_5: string;
  otc_6: string;
}

const ConfirmUserModal = (props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  credentials: {
    username: string;
    password: string;
  };
}) => {
  const { register, handleSubmit, errors } = useForm<IConfirmEmailInput>();
  const toast = useToast();
  const [, dispatch] = useContext(AppContext);
  const router = useRouter();

  const onConfirmEmail = async (
    data: IConfirmEmailInput,
    e: BaseSyntheticEvent<HTMLFormElement>
  ) => {
    try {
      // confirm email & sign in
      await Auth.confirmSignUp(
        props.credentials.username,
        `${data.otc_1}${data.otc_2}${data.otc_3}${data.otc_4}${data.otc_5}${data.otc_6}`
      );
      await signIn(
        dispatch,
        props.credentials.username,
        props.credentials.password
      );

      // close modal
      toast({
        title: "Account Confirmed",
        description: "Your email has been confirmed.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      props.onClose();

      // redirect to /messenger
      router.push("/messenger");
    } catch (error) {
      toast({
        title: error.code,
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      // clear form
      e.target.reset();
    }
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Email</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center h="100%" w="100%">
            <HStack
              as="form"
              onSubmit={handleSubmit(onConfirmEmail)}
              id="confirmCodeForm"
            >
              <PinInput>
                <PinInputField
                  name="otc_1"
                  ref={register({ required: true, minLength: 1, maxLength: 1 })}
                  errorBorderColor="brand.red.600"
                />
                <PinInputField
                  name="otc_2"
                  ref={register({ required: true, minLength: 1, maxLength: 1 })}
                  errorBorderColor="brand.red.600"
                />
                <PinInputField
                  name="otc_3"
                  ref={register({ required: true, minLength: 1, maxLength: 1 })}
                  errorBorderColor="brand.red.600"
                />
                <PinInputField
                  name="otc_4"
                  ref={register({ required: true, minLength: 1, maxLength: 1 })}
                  errorBorderColor="brand.red.600"
                />
                <PinInputField
                  name="otc_5"
                  ref={register({ required: true, minLength: 1, maxLength: 1 })}
                  errorBorderColor="brand.red.600"
                />
                <PinInputField
                  name="otc_6"
                  ref={register({ required: true, minLength: 1, maxLength: 1 })}
                  errorBorderColor="brand.red.600"
                />
              </PinInput>
            </HStack>
          </Center>
        </ModalBody>
        <ModalFooter>
          <HStack justify="flex-end">
            <Button
              bgColor="white"
              borderStyle="solid"
              borderColor="brand.gray.100"
            >
              Resend
            </Button>
            <Button
              bgColor="brand.red.200"
              color="brand.gray.700"
              type="submit"
              form="confirmCodeForm"
              _hover={{
                bgColor: "brand.red.300",
              }}
            >
              Submit
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmUserModal;
