import { BaseSyntheticEvent } from "react";
import { useState, useContext } from "react";
import { AuthContext, setCognitoUser } from "context/auth-context/AuthContext";
import Head from "next/head";
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
} from "@chakra-ui/react";
import { IoMdPerson, IoMdPeople, IoMdKey, IoMdAt } from "react-icons/io";
import BackgroundIllustrations from "components/svg/BackgroundIllustrations";
import ChatAppLogo from "components/svg/ChatAppLogo";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";

// constants
const minH = "500px";

// types/interfaces
interface SignUpInputs {
  given_name: string;
  family_name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  // control show/hide password input field
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  // add toast
  const toast = useToast();

  // collect auth context
  const [, dispatch] = useContext(AuthContext);

  // router
  const router = useRouter();

  // control form
  const { register, handleSubmit, errors } = useForm<SignUpInputs>();
  const onSignUp = async (
    data: SignUpInputs,
    e: BaseSyntheticEvent<HTMLFormElement>
  ) => {
    try {
      // initiate sign up
      const signUpResult = await Auth.signUp({
        username: data.email,
        password: data.password,
        attributes: {
          family_name: data.family_name,
          given_name: data.given_name,
        },
      });

      // save cognito user
      setCognitoUser(dispatch, signUpResult.user);

      // redirect to /app
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
    }

    // clear the form
    e.target.reset();
  };

  return (
    <>
      <Head>
        <title>ChatApp | Sign Up</title>
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
              onSubmit={handleSubmit(onSignUp)}
            >
              <InputGroup>
                <InputLeftElement
                  children={<Icon as={IoMdPerson} color="brand.gray.900" />}
                />
                <Input
                  placeholder="First name"
                  bgColor="white"
                  borderStyle="solid"
                  borderColor="brand.gray.100"
                  name="given_name"
                  autoComplete="given-name"
                  errorBorderColor="brand.red.600"
                  ref={register({ required: true })}
                  isInvalid={!!errors.given_name}
                ></Input>
              </InputGroup>
              <InputGroup>
                <InputLeftElement
                  children={<Icon as={IoMdPeople} color="brand.gray.900" />}
                />
                <Input
                  placeholder="Last name"
                  bgColor="white"
                  borderStyle="solid"
                  borderColor="brand.gray.100"
                  name="family_name"
                  autoComplete="family-name"
                  errorBorderColor="brand.red.600"
                  isInvalid={!!errors.family_name}
                  ref={register({ required: true })}
                ></Input>
              </InputGroup>
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
                  autoComplete="new-password"
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
            _hover={{
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
        </NextLink>
      </Box>
    </>
  );
};

export default SignUp;
