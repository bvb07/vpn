import {
  Button,
  Center,
  chakra,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  useToast,
  Text,
  CircularProgress,
  useColorModeValue,
  FormHelperText,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { Card } from "../components/Card";
import DividerWithText from "../components/DividerWithText";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { signIn, useSession, getSession } from "next-auth/react";
import { useAuth } from "../contexts/AuthContext";

const GoBack = () => {
  useEffect(() => {
    router.replace("/Profilepage");
  }, []);
  return null;
};
export default function Loginpage(props) {
  const { showAlert } = props;
  const session = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const [verify, setVerify] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { login, sendEmail } = useAuth();
  const [isValidEmail, setIsValidEmail] = useState(false);
  const textColor = useColorModeValue("#0a3763", "white");

  //signIn google
  const handleSignIn = async () => {
    try {
      const result = await signIn("google", { sendEmail: sendEmail(email) });

      if (result?.url) {
        router.replace(result.url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // auth to profilepage
  useEffect(() => {
    if (session.status === "loading") {
      setTimeout(() => setLoading(false), 500);
    }
  }, [session.status, router]);

  const onChangeVerify = (value) => {
    setVerify(value);
    toast({
      title: "You are not a robot and you can sign in",
      status: "success",
      position: "top-right",
      isClosable: true,
      duration: 3000,
    });
  };
  function handleEmailChange(e) {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setIsValidEmail(e.target.checkValidity());
    const isEmailValidAlert = /\S+@\S+\.\S+/.test(inputEmail);
    const helperText = document.getElementById("email-helper-text");
    const emaillength = e.target.value.length;
    if (helperText) {
      if (isEmailValidAlert || emaillength === 0) {
        if (emaillength === 0) {
          helperText.textContent = "";
          return;
        }
        helperText.textContent = "";
      } else {
        helperText.textContent = "Please enter a valid email address.";
      }
    }
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
    const passwordlength = e.target.value.length;
    const helperText = document.querySelector("#password-helper-text");
    if (passwordlength === 0) {
      helperText.textContent = "";
    } else if (passwordlength < 6) {
      helperText.textContent = "Password must be at least 6 characters long";
    } else {
      helperText.textContent = "";
    }
  }

  if (!loading) {
    return (
      <>
        {session ? (
          <div>
            <Heading textAlign="center" my={12}>
              <center>
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  style={{
                    color: "#f68221",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Just Another{" "}
                  <Text as="span" color={textColor} fontWeight="bold">
                    VPN
                  </Text>{" "}
                  For Managing Enterprise Security (JAMES)
                </Text>
              </center>
            </Heading>
            <Card maxW="md" mx="auto" mt={4}>
              <chakra.form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!email || !password) {
                    toast({
                      description: "Credentials not valid.",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                    return;
                  }
                  // login logic
                  setIsSubmitting(true);

                  login(email, password)
                    .then((res) => {
                      const result_login = signIn(
                        "credentials",
                        { email, password },
                        { callbackUrl: "/Profilepage" }
                      );

                      toast({
                        description: "Sign in successfully",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                      });
                      if (result_login?.url) {
                        router.replace(result_login?.url);
                      }
                    })
                    .catch((error) => {
                      console.log(error.message);
                      toast({
                        description: error.message,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                      });
                      router.replace("/");
                    })
                    .finally(() => {
                      setIsSubmitting(false);
                    });
                }}
              >
                <Stack spacing="6">
                  <FormControl id="email">
                    <FormLabel>Email address</FormLabel>

                    <Input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={handleEmailChange}
                    />
                    <FormHelperText
                      id="email-helper-text"
                      color="red.400"
                    ></FormHelperText>
                  </FormControl>
                  <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input
                      name="password"
                      type="password"
                      autoComplete="password"
                      value={password}
                      required
                      onChange={handlePasswordChange}
                    />
                    <FormHelperText
                      id="password-helper-text"
                      color="red.400"
                    ></FormHelperText>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="orange"
                    size="lg"
                    fontSize="md"
                    isLoading={isSubmitting}
                    isDisabled={!verify}
                  >
                    Sign in
                  </Button>
                </Stack>
              </chakra.form>
              <HStack justifyContent="space-between" my={4}>
                <Button variant="link">
                  <Link href="/ForgotPasswordPage">Forgot password?</Link>
                </Button>
                <Button variant="link">
                  <Link href="/Registerpage">
                    {" "}
                    I don&apos;t have an account ?{" "}
                  </Link>
                </Button>
              </HStack>
              <Center>
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  onChange={onChangeVerify}
                />
              </Center>
              {!verify ? (
                <Center color="red.400" borderRadius="md" my={5}>
                  <Heading as="h1" size="sd">
                    {" "}
                    Please verify Recaptcha before Sign in{" "}
                  </Heading>
                </Center>
              ) : null}
              <DividerWithText my={6}>OR</DividerWithText>

              <Center>
                <Button
                  my={8}
                  variant="outline"
                  colorScheme="orange"
                  leftIcon={<FaGoogle />}
                  onClick={handleSignIn}
                  isDisabled={!verify}
                >
                  Sign in with Google
                </Button>
              </Center>
            </Card>
          </div>
        ) : (
          <div>
            <GoBack />{" "}
          </div>
        )}
      </>
    );
  } else {
    return (
      <Center my={120}>
        <CircularProgress size="100" isIndeterminate color="orange.300" />
        <Text color="gray.300">Loading...</Text>
      </Center>
    );
  }
}
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  // console.log("session --> ", session);
  if (session && session !== null) {
    return {
      redirect: {
        destination: "/Profilepage",
        permanent: false,
      },
    };
  } else {
    return {
      props: {},
    };
  }
}
