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
  Text,
  CircularProgress,
  FormHelperText,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Card } from "../components/Card";
import DividerWithText from "../components/DividerWithText";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";



export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const router = useRouter();
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);
  // auth to profilepage
  useEffect(() => {
    if (session.status === "loading") {
      setTimeout(() => setLoading(false), 500);
    }
    if (session.status === "authenticated") {
      setTimeout(() => setLoading(true), 500);
      router.replace("/Profilepage");
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

  if (!loading) {
    return (
      <>
        <Heading textAlign="center" my={12}>
          Forget password
        </Heading>
        <Card maxW="md" mx="auto" mt={4}>
          <chakra.form
            onSubmit={async (e) => {
              e.preventDefault();
              //login logic
              try {
                await forgotPassword(email);
                toast({
                  description: `An email is sent to ${email} for a password reset. Please check your inbox in Gmail.`,
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
                router.replace("/");
              } catch (error) {
                console.log(error.message);
                toast({
                  description: error.message,
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                });
              }
            }}
          >
            <Stack spacing="6">
              <FormControl id="email">
                <FormLabel>Email address </FormLabel>
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
              <Button
                type="submit"
                colorScheme="orange"
                size="lg"
                fontSize="md"
              >
                Submit
              </Button>
            </Stack>
          </chakra.form>
          <DividerWithText my={6}>OR</DividerWithText>
          <Center>
            <Button variant="link">
              <Link href="/">Login</Link>
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
