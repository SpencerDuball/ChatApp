import { Amplify, withSSRContext } from "aws-amplify";
import awsConfig from "../aws-config";
import { useState, BaseSyntheticEvent, useContext } from "react";
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
import { signIn } from "@frontend/context/app-context/context";
import { AppContext } from "@frontend/context/app-context/context";

// Must do this for every page until issue is resolved: https://github.com/vercel/next.js/issues/16977
Amplify.configure({ ...awsConfig, ssr: true });

interface SignInInputs {
  email: string;
  password: string;
}

const SignIn = () => {
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

  // auth context
  const [, dispatch] = useContext(AppContext);

  // form
  const { register, handleSubmit, errors } = useForm<SignInInputs>();
  const onSubmit = async (
    data: SignInInputs,
    e: BaseSyntheticEvent<HTMLFormElement>
  ) => {
    // set credentials so they are accessable by ConfirmUserModal
    setCredentials({ username: data.email, password: data.password });

    try {
      await signIn(dispatch, data.email, data.password);
      toast({
        title: "Sign In Successful",
        description: "Welcome back to ChatApp!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      switch (error.code) {
        case "UserNotConfirmedException": {
          // present user with modal to confirm email
          onOpen();
          break;
        }
        default: {
          toast({
            title: error.code,
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        }
      }
    }

    // clear the form
    e.target.reset();
  };

  return (
    <>
      <Head>
        <title>Sign In - ChatApp</title>
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
                Sign In
              </Button>
            </Grid>
          </Grid>
        </Center>
        <NextLink href="/sign_up" passHref>
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
            Sign Up
          </Link>
        </NextLink>
      </Box>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const SSR = withSSRContext({ req: context.req });

  // redirect user to '/messenger' if signed in
  try {
    const user = await SSR.Auth.currentAuthenticatedUser();
    return { redirect: { destination: "/messenger", permanent: false } };
  } catch (error) {
    return { props: {} };
  }
}

export default SignIn;
