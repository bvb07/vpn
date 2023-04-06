import {
  Button,
  Center,
  chakra,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
  FormHelperText,
  Text,
  CircularProgress,
} from "@chakra-ui/react";
import axios from "axios";
import DividerWithText from "../components/DividerWithText";
import { FaGoogle } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { Card } from "../components/Card";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import { signIn, useSession, getSession } from "next-auth/react";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
export default function Registerpage() {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();
  const toast = useToast();
  const mounted = useRef(false);
  const router = useRouter();
  const [isValidEmail, setIsValidEmail] = useState(false);

  const handleSignIn = async () => {
    try {
      const result = await signIn("google");
      if (result?.url) {
        router.replace(result.url);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (session?.data?.check) {
      toast({
        title: "Account created.",
        description: "We've created your account for you to wait for 5 s.",
        status: "success",
        position: "top-right",
        isClosable: true,
      });
      setTimeout(() => {
        location.reload();
      }, 5000);
    }

    if (session.status === "loading") {
      setTimeout(() => setLoading(false), 500);
    }
  }, [session.status, router]);

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
        <Heading textAlign="center" my={8}>
          Register
        </Heading>
        <Card maxW="md" mx="auto" mt={4}>
          <chakra.form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email || !password) {
                toast({
                  description: "Credentials not valid.",
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                });
                return;
              }
              // register
              setIsSubmitting(true);

              register(email, password)
                .then((res) => {
                  try {
                    signIn("credentials", { email, password });
                    toast({
                      description:
                        "Registration is successful and you can sign in to get VPN",
                      status: "success",
                      position: "top-right",
                      duration: 9000,
                      isClosable: true,
                    });

                    return;
                  } catch {
                    console.log("error");
                  }
                })
                .catch((error) => {
                  console.log(error.message);
                  toast({
                    description: error.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
                })
                .finally(() => {
                  mounted.current && setIsSubmitting(false);
                });
            }}
          >
            <Stack spacing="8">
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
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
                <FormHelperText
                  id="password-helper-text"
                  color="red.400"
                ></FormHelperText>
              </FormControl>
              <Button
                type="submit"
                size="lg"
                fontSize="md"
                // isLoading={isSubmitting}
                colorScheme="orange"
              >
                Sign up
              </Button>
            </Stack>
          </chakra.form>
          <DividerWithText my={6}>OR</DividerWithText>
          <Center>
            <Button
              my={3}
              variant="outline"
              colorScheme="orange"
              leftIcon={<FaGoogle />}
              onClick={async () => {
                try {
                  await handleSignIn();
                } catch (error) {
                  console.log("Error signing in:", error.message);
                }
              }}
            >
              Sign up with Google
            </Button>
          </Center>
        </Card>
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

  if (session?.message === `You not registered`) {
    const protocol = process.env.NEXT_PUBLIC_PROTOCOL;
    const domain_name = process.env.NEXT_PUBLIC_DOMAIN_NAME;
    const emailToCheck = `${process.env.NEXT_PUBLIC_MAIL_GOOGLE}`;
    try {
      if (emailToCheck === session?.user.email) {
        const urldatapost = `${protocol}://${domain_name}/api/createDataRegister`; //post
        const response = await axios.post(urldatapost, {
          uid: session?.uid,
          displayName: session?.user?.name.split(" ").join("_"),
          email: session?.user?.email,
          role: "admin",
          photo: session?.user?.image,
        });
        return {
           redirect: {
          destination: "/Profilepage?Register=true",
          permanent: false,
        },
        };
      }
      const urldatapost = `${protocol}://${domain_name}/api/createDataRegister`;
      const response = await axios.post(urldatapost, {
        uid: session?.uid,
        displayName: session?.user?.name.split(" ").join("_"),
        email: session?.user.email,
        role: "user",
        photo: session?.user.image,
      });
      return {
         redirect: {
          destination: "/Profilepage?Register=true",
          permanent: false,
        },
      };
    } catch (e) {
      console.log("error");
    }
    return {
      redirect: {
        destination: "/Profilepage?Register=true",
        permanent: false,
      },
    };
  }
  if (session?.message === `You are user`) {
    return {
      redirect: {
        destination: "/Profilepage?Register=true",
        permanent: false,
      },
    };
  }

  if (session?.message === `Sign up email`) {
    return {
      redirect: {
        destination: "/Profilepage?Register1=true",
        permanent: false,
      },
    };
  }
  if (!session) {
    return { props: {} };
  }
}
