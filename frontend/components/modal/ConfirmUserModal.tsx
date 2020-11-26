import { BaseSyntheticEvent } from "react";
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
  Grid,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Auth, toast } from "aws-amplify";

interface IConfirmEmailInput {
  confirmation_code: string;
}

const ConfirmUserModal = (props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  // form
  const { register, handleSubmit, errors } = useForm<IConfirmEmailInput>();

  // toast
  const toast = useToast();

  // context

  const onConfirmEmail = async (
    data: IConfirmEmailInput,
    e: BaseSyntheticEvent<HTMLFormElement>
  ) => {
    try {
      // confirm email
      // const confirmSignUp = await Auth.confirmSignUp()
    } catch (error) {
      toast({
        title: error.code,
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
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
            <Grid
              as="form"
              gridAutoFlow="row"
              w={["250px", "300px"]}
              gridGap={1}
            >
              <Input
                placeholder="Confirmation code"
                bgColor="white"
                borderStyle="solid"
                borderColor="brand.gray.100"
                name="confirmation_code"
                autoComplete="one-time-code"
                errorBorderColor="brand.red.600"
              />
              <Button
                mt={1}
                bgColor="brand.red.200"
                color="brand.gray.700"
                type="submit"
                _hover={{
                  bgColor: "brand.red.300",
                }}
              >
                Confirm Email
              </Button>
            </Grid>
          </Center>
        </ModalBody>
        <ModalFooter>
          <Center h="100%" w="100%">
            <Button
              bgColor="white"
              borderStyle="solid"
              borderColor="brand.gray.100"
            >
              Resend Code
            </Button>
          </Center>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmUserModal;
