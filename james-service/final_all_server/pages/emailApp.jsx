import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Heading,
  Image,
  Badge,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Center,
  CircularProgress,
  useToast,
} from "@chakra-ui/react";
import { Card } from "../components/Card";
export default function Home() {
  const [email, setEmail] = useState("");
  const [res, setRes] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [isValidEmail, setIsValidEmail] = useState(false);   //check email
  const checkValidity = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/api/checkEmail/${email}`);
      if (res.data.message === "Task was not found") {
        toast({
          title: `This email is not registered in this system`,
          status: "error",
          position: 'top-right',
          isClosable: true,
          duration: 3000,
        });
        return;
      } else {
        toast({
          title: `This email is registered already`,
          status: "success",
          position: 'top-right',
          isClosable: true,
          duration: 3000,
        });
        return;
      }
    } catch (err) {
      console.log(err);
    }
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
  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);
  return (
    <>
      {loading === false ? (
        <Container>
          <Center>
            <Heading py={6}>
              <Badge
                fontWeight="black"
                fontSize="4xl"
                mx={2}
                px={2}
                colorScheme="orange"
                borderRadius="lg"
              >
                check Email Customix
              </Badge>
            </Heading>
          </Center>
          <Card
            borderWidth="5px"
            borderRadius="lg"
            overflow="hidden"
            my={3}
            borderColor="orange.300"
          >
            <Image
              src="https://cdn.dribbble.com/users/1551941/screenshots/6346538/thankyoudribble.gif"
              borderRadius="lg"
            ></Image>
          </Card>
          <Card
            borderWidth="5px"
            borderRadius="lg"
            overflow="hidden"
            my={10}
            borderColor="orange.300"
          >
            <FormControl>
              <FormLabel onSubmit={(e) => checkValidity(e)}>
                <Text as="b"> Email address</Text>
              </FormLabel>
              <Input
                my={3}
                autoFocus={true}
                type="email"
                placeholder="Enter the email address..."
                onChange={handleEmailChange}
                borderWidth="4px"
                borderRadius="lg"
                overflow="hidden"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                required
              />
              <FormHelperText
                id="email-helper-text"
                color="red.400"
              ></FormHelperText>
            </FormControl>
            <Button onClick={checkValidity} my={6} isDisabled={!isValidEmail}>
              Validate
            </Button>
            {res && (
              <Container>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>
                        <span>Information</span>
                      </Th>
                      <Th>
                        <span>Result</span>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>Valid</Td>
                      <Td>{res.valid.toString()}</Td>
                    </Tr>
                    <Tr>
                      <Td>Disposible</Td>
                      <Td>{res.disposable.toString()}</Td>
                    </Tr>
                    <Tr>
                      <Td>Domain</Td>
                      <Td>{res.domain}</Td>
                    </Tr>
                    <Tr>
                      <Td>Text</Td>
                      <Td>{res.text}</Td>
                    </Tr>
                    <Tr>
                      <Td>Reason</Td>
                      <Td>{res.reason}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Container>
            )}
          </Card>
        </Container>
      ) : (
        <div>
          <Center my={120}>
            <CircularProgress size="100" isIndeterminate color="orange.300" />
            <Text color="gray.300">Loading...</Text>
          </Center>
        </div>
      )}
    </>
  );
}
