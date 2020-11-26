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
import { Auth } from "aws-amplify";

interface IConfirmEmailInput {
  confirmation_code: string;
  email: string;
}

const ConfirmUserModal = (props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const { register, handleSubmit, errors } = useForm<IConfirmEmailInput>();
  const toast = useToast();

  const onConfirmEmail = async (
    data: IConfirmEmailInput,
    e: BaseSyntheticEvent<HTMLFormElement>
  ) => {
    try {
      // confirm email
      const confirmSignUp = await Auth.confirmSignUp(
        data.email,
        data.confirmation_code
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
            <Grid
              as="form"
              gridAutoFlow="row"
              w={["250px", "300px"]}
              gridGap={1}
              onSubmit={handleSubmit(onConfirmEmail)}
            >
              <Input
                placeholder="Email"
                bgColor="white"
                borderStyle="solid"
                borderColor="brand.gray.100"
                name="email"
                autoComplete="email"
                errorBorderColor="brand.red.600"
                ref={register({
                  required: true,
                  pattern: /\S+@\S+\.\S+/,
                })}
              />
              <Input
                placeholder="Confirmation code"
                bgColor="white"
                borderStyle="solid"
                borderColor="brand.gray.100"
                name="confirmation_code"
                autoComplete="one-time-code"
                errorBorderColor="brand.red.600"
                ref={register({
                  required: true,
                  minLength: 6,
                  maxLength: 6,
                  pattern: /[0-9]{6}/,
                })}
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
