import {
  chakra,
  Container,
  Image,
  Box,
  Text,
  CircularProgress,
  Alert,
  AlertIcon,
  Spinner,
  Tooltip,
  Badge,
  AlertTitle,
  AlertDescription,
  Center,
  useToast,
  Flex,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import { Grid, GridItem } from "@chakra-ui/react";
import { saveAs } from "file-saver";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
//back to login
const GoBack = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, []);
  return null;
};

export default function Profilepage(props) {
  const toast = useToast();
  const { data: session, status } = useSession();
  const [download, setDownload] = useState(null);
  const [load, setLoad] = useState(true);
  const [name, setName] = useState(null);
  const [statusData, setStatusData] = useState(false);
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  // env local
  const protocol = process.env.NEXT_PUBLIC_PROTOCOL;
  const domain_name = process.env.NEXT_PUBLIC_DOMAIN_NAME;
  const emailToCheck = `${process.env.NEXT_PUBLIC_MAIL_GOOGLE}`;

  var { Register,Register1 } = router.query;
  const [registerFlag, setRegisterFlag] = useState(false);
  //find user by  uid  and create data to database

  const fetchData = async () => {
    const uid = session?.uid;
    if (uid === undefined) {
      return (
        <div>
          <Center my={120}>
            <CircularProgress size="100" isIndeterminate color="orange.300" />
            <Text color="gray.300">Loading...</Text>
          </Center>
        </div>
      );
    }
    const urlFind = `${protocol}://${domain_name}/api/user/${uid}`;
    const Finduid = await axios.get(urlFind);

    setName(Finduid?.data.displayName);
    if (Finduid?.status === 204) {
      try {
        if (emailToCheck === session?.user.email) {
          const urldatapost = `${protocol}://${domain_name}/api/createdata`; //post
          const response = await axios.post(urldatapost, {
            uid: session?.uid,
            displayName: session?.user?.name.split(" ").join("_"),
            email: session?.user.email,
            role: "admin",
            photo: session?.user.image,
          });
          return;
        }
        const urldatapost = `${protocol}://${domain_name}/api/createdata`; //post
        const response = await axios.post(urldatapost, {
          uid: session?.uid,
          displayName: session?.user?.name.split(" ").join("_"),
          email: session?.user.email,
          role: "user",
          photo: session?.user.image,
        });
      } catch (err) {
        console.log("data is coming");
      }
    }
  };
  const [checkRole, setCheckRole] = useState(false);
  const FindUser = async () => {
    const { iscreated } = router.query;
    const uid = session?.uid;
    const urlFind = `${protocol}://${domain_name}/api/user/${uid}?iscreated=${iscreated}`;

    setCheckRole(true);
    const Finduid = await axios.get(urlFind).then((res) => {
      setStatusData(res.data.iscreated);
      if (
        res?.data?.role === "admin" &&
        !checkRole &&
        checkRole !== undefined &&
        checkRole !== null
      ) {
        toast({
          title: "You are admin if you do not see work admin please sign out",
          status: "success",
          isClosable: true,
          position: `top-left`,
          duration: 3000,
        });
        return;
      }
    });
  };
  useEffect(() => {
    fetchData();
    FindUser();
    if (Register && !registerFlag && session !== null)  {
      toast({
        title: "In the system, you already have an account.",
        status: "success",
        isClosable: true,
        duration: 3000,
        position: `top-right`,
      });
      setRegisterFlag(true)
    }
    if (Register1 && !registerFlag && session !== null) {
      toast({
        title: "In the system, you already have an account.",
        status: "success",
        isClosable: true,
        duration: 3000,
        position: `top-right`,
      });
      setRegisterFlag(true)
    }

    setTimeout(() => {
      setLoad(false);
    }, 1000);

    let countdown = 10;
    const interval = setInterval(async () => {
      countdown--;
      setCountdown(countdown);
      if (countdown === 0) {
        clearInterval(interval);
      }
    }, 1500);

    const intervalId = setInterval(() => {
      router.reload();
    }, 24000);

    return () => {
      clearInterval(interval);
      clearInterval(intervalId);
    };
  }, [router.query, session]);

  //downloadd action
  async function handleDownload() {
    try {
      const uid = session?.uid;
      const clientNamedata = name.split(" ").join("_").toString();
      const urlDownload = `${protocol}://${domain_name}/api/downloads/${uid}?clientName=${clientNamedata}`;
      const download = await axios.get(urlDownload);
      setDownload(download.data);
      const blob = new Blob([download.data], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, `${clientNamedata}.ovpn`);
      toast({
        title: "Download VPN success !!!",
        status: "success",
        isClosable: true,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: `Your VPN is not admin generated yet, please contact ${emailToCheck}`,
        status: "warning",
        isClosable: true,
        duration: 3000,
      });
    }
  }

  return (
    <>
      {load === false ? (
        session ? (
          <Container maxW="container.lg" overflowX="auto" py={10}>
            <Text
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              bgClip="text"
              fontSize="6xl"
              fontWeight="extrabold"
            >
              Welcome To Your VPN
            </Text>
            <br />
            <chakra.pre p={2}>
              <Card borderWidth="5px" borderRadius="lg" overflow="hidden">
                <Center>
                  <Box
                    maxW="lg"
                    borderWidth="5px"
                    borderRadius="lg"
                    overflow="hidden"
                  >
                    <Image
                      src="https://cdn.dribbble.com/users/795597/screenshots/3574014/social_network__3_.gif"
                      alt="vpn"
                    />
                  </Box>
                </Center>

     
              </Card>
              <br />
                <br />
                {statusData ? (
                  <Center>
                    <Tooltip label="Click for download" aria-label="A tooltip">
                      <Button
                        onClick={handleDownload}
                        type="submit"
                        colorScheme="orange"
                        size="lg"
                        fontSize="lg"
                        _hover={{
                          bgGradient: "linear(to-r, orange.300, yellow.300)",
                        }}
                      >
                        Download VPN
                      </Button>
                    </Tooltip>
                  </Center>
                ) : (
                  <Alert status="info" size="400px" borderRadius="xl">
                    <Flex minWidth="max-content" alignItems="center" gap="2">
                      {countdown === 0 ? (
                        <div>
                          {statusData ? (
                            <Center>
                              <Tooltip
                                label="Click for download"
                                aria-label="A tooltip"
                              >
                                <Button
                                  onClick={handleDownload}
                                  type="submit"
                                  colorScheme="orange"
                                  size="lg"
                                  fontSize="lg"
                                  _hover={{
                                    bgGradient:
                                      "linear(to-r, orange.300, yellow.300)",
                                  }}
                                >
                                  Download VPN
                                </Button>
                              </Tooltip>
                            </Center>
                          ) : (
                            <Text>
                              {" "}
                              Your VPN is not admin generated yet, please
                              contact {emailToCheck} {" "}<Spinner />
                            </Text>
                          )}
                        </div>
                      ) : (
                        ` Wait for generate from admin to download ${countdown} seconds ...`
                      )}
                      {countdown > 0 && <Spinner />}
                    </Flex>
                  </Alert>
                )}
              <br />
              <br />
              <Card borderWidth="5px" borderRadius="lg" overflow="hidden">
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <GridItem>
                    <Box maxW="lg" borderRadius="lg" overflow="hidden">
                      <Center>
                        <chakra.span
                          fontWeight="black"
                          fontStyle="italic"
                          fontSize="9xl"
                          mx={2}
                        ></chakra.span>
                        <Badge
                          fontWeight="black"
                          fontSize="4xl"
                          mx={2}
                          px={2}
                          colorScheme="teal"
                        >
                          Customix User
                        </Badge>
                      </Center>
                      <Image
                        borderRadius="lg"
                        my={8}
                        src="https://cdn.dribbble.com/users/278549/screenshots/3920892/user_tasting_dribbble.gif"
                      ></Image>
                    </Box>
                  </GridItem>

                  <GridItem>
                    <Box maxW="lg" borderRadius="lg" overflow="hidden">
                      <Alert status="success">
                        <AlertIcon />
                        <AlertTitle>1</AlertTitle>
                        <AlertDescription>
                          {" "}
                          Wait for admin generate VPN
                        </AlertDescription>
                      </Alert>
                    </Box>
                    <Box my={5} maxW="lg" borderRadius="lg" overflow="hidden">
                      <Alert status="success">
                        <AlertIcon />
                        <AlertTitle>2</AlertTitle>
                        <AlertDescription> Wait for download</AlertDescription>
                      </Alert>
                    </Box>
                    <Box my={5} maxW="lg" borderRadius="lg" overflow="hidden">
                      <Alert status="success">
                        <AlertIcon />
                        <AlertTitle>3</AlertTitle>
                        <AlertDescription>
                          {" "}
                          Download your vpn success !
                        </AlertDescription>
                      </Alert>
                    </Box>

                    <Box my={5} maxW="lg" borderRadius="lg" overflow="hidden">
                      <Alert status="success">
                        <AlertIcon />
                        <AlertTitle>4</AlertTitle>
                        <AlertDescription>
                          {" "}
                          Use your VPN in customix network
                        </AlertDescription>
                      </Alert>
                    </Box>
                  </GridItem>
                </Grid>
              </Card>
             
            </chakra.pre>
          </Container>
        ) : (
          <div>
            <GoBack />
          </div>
        )
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


export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  // console.log("session --> ", session);
  if (!session && session === null) {
  
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      props:{}
    };
  }
}
