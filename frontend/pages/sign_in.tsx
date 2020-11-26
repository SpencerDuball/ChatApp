import { useState, BaseSyntheticEvent, useContext } from "react";
import { AuthContext, setCognitoUser } from "context/auth-context/AuthContext";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Box,
  Center,
  Grid,
  Link,
  Input,
  Icon,
  InputLeftElement,
  InputRightElement,
  InputGroup,
  Button,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { IoMdKey, IoMdAt } from "react-icons/io";
import BackgroundIllustrations from "components/svg/BackgroundIllustrations";
import ChatAppLogo from "components/svg/ChatAppLogo";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { Auth } from "aws-amplify";
import ConfirmUserModal from "components/modal/ConfirmUserModal";

// constants
const minH = "500px";

// types/interfaces
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

  // add toast
  const toast = useToast();

  // auth context
  const [, dispatch] = useContext(AuthContext);

  // router
  const router = useRouter();

  // control form
  const { register, handleSubmit, errors } = useForm<SignInInputs>();
  const onSignIn = async (
    data: SignInInputs,
    e: BaseSyntheticEvent<HTMLFormElement>
  ) => {
    try {
      // initiate sign in
      const signInResult = await Auth.signIn({
        username: data.email,
        password: data.password,
      });

      // save cognito user
      setCognitoUser(dispatch, signInResult.user);

      // toast sign in
      toast({
        title: "Sign In Successful",
        description: "Welcome back to ChatApp!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      // redirect to /app
      router.push("/messenger");
    } catch (error) {
      // set username for modal
      setCredentials({ username: data.email, password: data.password });

      switch (error.code) {
        // present user with modal to confirm email
        case "UserNotConfirmedException": {
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
      <ConfirmUserModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        credentials={credentials}
      />
      <Head>
        <title>ChatApp | Sign In</title>
      </Head>
      <Box as="main" h="100vh" w="100%" position="relative" minH={minH}>
        <BackgroundIllustrations
          fill="brand.gold.50"
          position="fixed"
          h="100%"
          minH={minH}
          left="50%"
          transform="translateX(-50%)"
          zIndex="hide"
        />
        <Center h="100%" w="100%">
          <Grid templateRows="max-content max-content" gap={10}>
            <Center>
              <NextLink href="/" passHref>
                <Link>
                  <ChatAppLogo
                    primaryColor="brand.red.200"
                    secondaryColor="brand.red.600"
                    textColor="brand.gray.700"
                    h={["128px", "156px"]}
                    w={["128px", "156px"]}
                  />
                </Link>
              </NextLink>
            </Center>
            <Grid
              as="form"
              gridAutoFlow="row"
              w={["250px", "300px"]}
              gridGap={1}
              onSubmit={handleSubmit(onSignIn)}
            >
              <InputGroup>
                <InputLeftElement
                  children={<Icon as={IoMdAt} color="brand.gray.900" />}
                />
                <Input
                  placeholder="Email"
                  bgColor="white"
                  borderStyle="solid"
                  borderColor="brand.gray.100"
                  name="email"
                  autoComplete="email"
                  isInvalid={!!errors.email}
                  errorBorderColor="brand.red.600"
                  ref={register({ required: true, pattern: /\S+@\S+\.\S+/ })}
                ></Input>
              </InputGroup>
              <InputGroup>
                <InputLeftElement
                  children={<Icon as={IoMdKey} color="brand.gray.900" />}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  bgColor="white"
                  borderStyle="solid"
                  borderColor="brand.gray.100"
                  name="password"
                  autoComplete="current-password"
                  isInvalid={!!errors.password}
                  errorBorderColor="brand.red.600"
                  ref={register({ required: true, minLength: 8 })}
                ></Input>
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
                _hover={{
                  bgColor: "brand.red.300",
                }}
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
            _hover={{
              textDecoration: "none",
            }}
          >
            Sign Up
          </Link>
        </NextLink>
      </Box>
    </>
  );
};

export default SignIn;
