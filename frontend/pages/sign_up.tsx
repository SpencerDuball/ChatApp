import { useState, BaseSyntheticEvent } from "react";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import NextLink from "next/link";
import {
  Box,
  Center,
  Grid,
  Link,
  Icon,
  Input,
  InputLeftElement,
  InputRightElement,
  InputGroup,
  Button,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { IoKey, IoAtCircle } from "react-icons/io5";
import { HeroBackground } from "@frontend/components/svg/background/HeroBackground";
import { ChatAppIcon } from "@frontend/components/svg/icon/ChatAppIcon";
import { useForm } from "react-hook-form";
import { ConfirmUserModal } from "@frontend/components/overlay/ConfirmUserModal";
import { signUp } from "@frontend/context/app-context/context";

interface SignUpInputs {
  email: string;
  password: string;
}

const SignUp = () => {
  // control show/hide password input field
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  // modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // toast
  const toast = useToast();

  // form
  const { register, handleSubmit, errors } = useForm<SignUpInputs>();
  const onSubmit = async (
    data: SignUpInputs,
    e: BaseSyntheticEvent<HTMLFormElement>
  ) => {
    // set crednetials so they are accessible by ConfirmUserModal
    setCredentials({ username: data.email, password: data.password });

    try {
      await signUp(data);
    } catch (error) {
      toast({
        title: error.code,
        description: error.message,
        status: "error",
        duration: 500,
        isClosable: true,
        position: "top",
      });
    }

    // reset the form
    e.target.reset();
  };

  return (
    <>
      <Head>
        <title>Sign Up - ChatApp</title>
      </Head>
      <ConfirmUserModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        credentials={credentials}
      />
      <Box as="main" h="100%" w="100%" position="fixed" overflow="hidden">
        <HeroBackground
          h={["700px", "1000px"]}
          fill="brand.gold.50"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex="hide"
        />
        <Center h="100%" w="100%">
          <Grid autoFlow="row" gap={8}>
            <Center>
              <NextLink href="/" passHref>
                <Link>
                  <ChatAppIcon
                    h={["128px"]}
                    w={["128px"]}
                    primaryColor="brand.red.200"
                    secondaryColor="brand.red.500"
                    textColor="brand.gray.700"
                  />
                </Link>
              </NextLink>
            </Center>
            <Grid
              as="form"
              w={["250px", "300px"]}
              gridAutoFlow="row"
              gridGap={1}
              onSubmit={handleSubmit(onSubmit)}
            >
              <InputGroup>
                <InputLeftElement
                  children={
                    <Icon as={IoAtCircle} boxSize={5} color="brand.gray.700" />
                  }
                />
                <Input
                  placeholder="Email"
                  bgColor="white"
                  borderStyle="solid"
                  borderColor="brand.gray.100"
                  name="email"
                  isInvalid={!!errors.email}
                  errorBorderColor="brand.red.600"
                  ref={register({ required: true, pattern: /\S+@\S+\.\S+/ })}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement
                  children={
                    <Icon as={IoKey} boxSize={5} color="brand.gray.900" />
                  }
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  bgColor="white"
                  borderStyle="solid"
                  borderColor="brand.gray.100"
                  name="password"
                  autoComplete="new-password"
                  isInvalid={!!errors.password}
                  errorBorderColor="brand.red.600"
                  ref={register({ required: true, minLength: 8 })}
                />
                <InputRightElement>
                  <Button
                    onClick={toggleShowPassword}
                    fontSize="xs"
                    h="calc(100% - 10px)"
                    mr="10px"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Button
                mt={1}
                bgColor="brand.red.200"
                color="brand.gray.700"
                type="submit"
                _hover={{ bgColor: "brand.red.300" }}
              >
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </Center>
        <NextLink href="/sign_in" passHref>
          <Link
            position="absolute"
            bottom={5}
            left="50%"
            transform="translateX(-50%)"
            color="brand.red.300"
            borderBottomWidth="2px"
            borderBottomStyle="solid"
            borderColor="brand.red.300"
            _hover={{ textDecoration: "none" }}
          >
            Sign In
          </Link>
        </NextLink>
      </Box>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // validate JWT IdToken
  //    if (signedIn) redirect("/messenger")

  return { props: {} };
}

export default SignUp;
