import {
  Badge,
  Text,
  chakra,
  Code,
  Heading,
  ListItem,
  OrderedList,
  AspectRatio,
  Center,
  CircularProgress,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Card } from "../components/Card";
export default function Homepage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  });
  return (
    <>
      {loading === false ? (
        <div>
          <Heading
            as="h1"
            size="lg"
            textAlign="center"
            my={20}
            fontFamily="Montserrat, sans-serif"
            fontWeight="bold"
            letterSpacing="wide"
            lineHeight="shorter"
          >
            Looking for VPN solution for your software house?
            <chakra.span
              fontWeight="black"
              fontStyle="italic"
              fontSize="3xl"
              mx={1}
              color="red.500"
            >
              Try J.A.M.E.S!
            </chakra.span>
          </Heading>
          <Card>
            <Text fontSize="2xl" my={4}>
              J.A.M.E.S. stands for Just Another VPN for Managing Enterprise
              Security. With J.A.M.E.S. , you can generate a secure private
              network for your software house, ensuring that all data
              transmitted between your devices is encrypted and protected from
              potential cyber threats.
            </Text>
            <Text fontSize="2xl" my={6}>
              J.A.M.E.S. is easy to set up and use, with a simple installation
              process that can be completed in minutes. Once installed,
              J.A.M.E.S runs quietly in the background, ensuring that your data
              is secure and your team can work with confidence.
            </Text>
            <Text fontSize="2xl" my={6}>
              Do not leave your data vulnerable to cyberattacks - try J.A.M.E.S.
              today and enjoy the peace of mind that comes with knowing your
              data is protected.
            </Text>
            <Badge
              fontWeight="black"
              fontSize="2xl"
              mx={2}
              px={2}
              mt={4}
              colorScheme="orange"
            >
              Feature VPN
            </Badge>
            <OrderedList fontSize="2xl" my={3}>
              <ListItem>
                Email authentication (register/login) in firebase auth{" "}
              </ListItem>
              <ListItem>Google sign in with nextauth </ListItem>
              <ListItem>Forgot password in firebase auth</ListItem>
              <ListItem>Reset password in firebase auth</ListItem>
              <ListItem>Protected routes client and server</ListItem>
              <ListItem>
                <Code fontSize="inherit"> Generate and Revoke VPN </Code> by
                Admin
              </ListItem>
              <ListItem>
                Custom Auth <Code fontSize="3xl">Nextauth and useAuth()</Code>
              </ListItem>
              <ListItem>
                For admin, if block the admin page you must clear case data in
                history
              </ListItem>
              <ListItem>
                The user to wait for VPN you must navbar another page and back
                profile{" "}
              </ListItem>
              <ListItem>
                {" "}
                Recommend authing by Google best for coming in with fast time{" "}
              </ListItem>
            </OrderedList>
            <Badge
              fontWeight="black"
              fontSize="2xl"
              mx={2}
              px={2}
              mt={4}
              colorScheme="orange"
            >
              How to use VPN
            </Badge>{" "}
            <OrderedList fontSize="2xl" my={5}>
              <ListItem>
                Download OpenVPN client from
                https://openvpn.net/community-downloads/
              </ListItem>
              <ListItem>Download file VPN from this web application</ListItem>
              <ListItem>Use application OpenVPN to import file VPN </ListItem>

              <ListItem>
                This is project Customix from
                https://veteran.socialenable.co/users/sign_in{" "}
              </ListItem>
            </OrderedList>
            <AspectRatio ratio={16 / 9} my={4}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3884.8167630680914!2d100.93357861482417!3d13.17395049072334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3102b794b6b2cf59%3A0xca0ab17c3d41a6cd!2sCustomix%20Co.%2C%20Ltd.!5e0!3m2!1sth!2sth!4v1675185864177!5m2!1sth!2sth" />
            </AspectRatio>
          </Card>
        </div>
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
