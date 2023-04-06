import {
  Button,
  chakra,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/Card";
import { Layout } from "../components/Layout";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const query = new URLSearchParams(router.asPath.split("?")[1]);
  const [password, setPassword] = useState("");
  const toast = useToast();
  return (
    <Layout>
      <Heading textAlign="center" my={12}>
        Reset password
      </Heading>
      <Card maxW="md" mx="auto" mt={4}>
        <chakra.form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await resetPassword(query.get("oobCode"), password);
              toast({
                description: "Password has been changed, you can login now.",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
              router.replace("/");
            } catch (error) {
              toast({
                description: error.message,
                status: "error",
                duration: 9000,
                isClosable: true,
              });
              console.log(error.message);
            }
          }}
        >
          <Stack spacing="6">
            <FormControl id="password">
              <FormLabel>New password</FormLabel>
              <Input
                type="password"
                autoComplete="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button type="submit" colorScheme="pink" size="lg" fontSize="md">
              Reset password
            </Button>
          </Stack>
        </chakra.form>
      </Card>
    </Layout>
  );
}
