import {
  chakra,
  Container,
  Input,
  FormControl,
  RadioGroup,
  HStack,
  FormLabel,
  FormHelperText,
  Box,
  Checkbox,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Tag,
  useToast,
  Center,
  CircularProgress,
  Text,
  Image,
  Badge,
  InputGroup,
  Flex,
  InputLeftAddon,
  TableCaption,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "../components/Card";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { saveAs } from "file-saver";

//block  client another admin
const GoBack = () => {
  useEffect(() => {
    Router.replace("/");
  }, []);
  return null;
};
export default function AdminPage() {
  const { data: session, status } = useSession();
  const [data1, setData1] = useState([]);
  const [email1, setEmail1] = useState([]);
  const [uid1, setUid1] = useState([]);
  const [status1, setStatus1] = useState([]);
  const [date1, setDate1] = useState([]);
  const [name1, setName1] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState([]);
  const [role, setRole] = useState("");
  const [checked, setChecked] = useState([]); //role change
  const [download, setDownload] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [test, setTest] = useState(false);
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const toast = useToast();
  // env local
  const protocol = process.env.NEXT_PUBLIC_PROTOCOL;
  const domain_name = process.env.NEXT_PUBLIC_DOMAIN_NAME;

  const fetchData = async () => {
    try {
      const urldata = `${protocol}://${domain_name}/api/getdata`;
      const res = await axios.get(urldata);
      const allData = res.data.map((item) => {
        const { email, uid, status, time, displayName, iscreated, role } = item;
        if (session.uid === uid) {
          setRole(role);
        }
        return {
          email1: email,
          uid1: uid,
          status1: status,
          date1: time,
          data1: item,
          name1: displayName,
          state: iscreated,
          checked: role,
        };
      });
      setEmail1(allData.map((item) => item.email1));
      setUid1(allData.map((item) => item.uid1));
      setStatus1(allData.map((item) => item.status1));
      setDate1(allData.map((item) => item.date1));
      setData1(allData.map((item) => item.data1));
      setName1(allData.map((item) => item.name1));
      setState(allData.map((item) => item.state));
      setChecked(allData.map((item) => item.checked));
      setFilteredData(allData);
    } catch (error) {
      console.error(error);
    }
  };
  //admin check file vpn User data
  const checkFileAdmin = () => {
    axios
      .get(`${protocol}://${domain_name}/api/checkFileAdmin`)
      .then((response) => {
        setFiles(response.data.files);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
    fetchData();
    checkFileAdmin();
  }, []);

  //search by email
  const handleSearch = (e) => {
    const value = e.target.value;
    setFilteredData(
      email1
        .filter((item, index) =>
          item.toLowerCase().includes(value.toLowerCase())
        )
        .map((item, index) => ({
          email1: item,
          uid1: uid1[index],
          date1: date1[index],
          status1: status1[index],
          name1: name1[index],
          checked: checked[index],
        }))
    );
    checkFileAdmin();
  };

  //gen vpn
  const handleAccessVpn = async (id, statusdata, namedata, iscreated) => {
    const urlData = `${protocol}://${domain_name}/api/post/${id}`;
    const urlGenvpn = `${protocol}://${domain_name}/api/gen_vpn?clientName=${namedata}&iscreated=${iscreated}`;

    if (statusdata === "pending") {
      try {
        const updateStatus = await axios.put(urlData, {
          uid: id,
          status: "approve",
          iscreated: true,
        });
        await fetchData();
        await axios.post(urlGenvpn);
        await checkFileAdmin();
        await fetchData();
        router.push(`/Profilepage?status=${updateStatus.data.iscreated}`);
      } catch (err) {
        console.log(err);
      }
    } else {
      toast({
        title: "VPN warning",
        description: `You  generated VPN already`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  //gen input text  vpn
  const handleGenVPN = async () => {
    const check = true;
    const thaiRegex = /[\u0E00-\u0E7F]/;
    const thaitest = thaiRegex.test(inputValue);
    if (thaitest) {
      toast({
        title: "Please input English language",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
      return;
    }
    const urlGenvpn = `${protocol}://${domain_name}/api/gen_vpn?clientName=${inputValue}&iscreated=${check}`;

    toast({
      title: "Generating VPN wait for 10s to download VPN ...",
      status: "info",
      isClosable: true,
      position: `top-right`,
      duration: 4000,
    });

    await axios.post(urlGenvpn);

    checkFileAdmin();
  };

  //download input text  vpn
  const handleDownloadVPN = async (nameData) => {
    const checkString = nameData.toString();
    const checkUser = checkString.split(".")[0];

    const urlDownload = `${protocol}://${domain_name}/api/download?clientName=${checkUser}`;
    toast({
      title: "Downloading VPN success",
      status: "success",
      isClosable: true,
      duration: 3000,
    });
    const download = await axios.get(urlDownload);
    setDownload(download.data);
    const blob = new Blob([download.data], {
      type: "text/plain;charset=utf-8",
    });

    saveAs(blob, `${checkUser}.ovpn`);
  };

  //Revoke input text  vpn
  const handleRevokeVPN = async (nameData) => {
    const checkString = nameData.toString();
    const checkUser = checkString.split(".")[0];
    const urlRevoke = `${protocol}://${domain_name}/api/revokeInput/?clientName=${checkUser}`;
    toast({
      title: "Revoke VPN success",
      status: "success",
      isClosable: true,
      duration: 3000,
    });
    await axios.post(urlRevoke);
    await checkFileAdmin();
  };

  //input  vpn for gen and download
  const handleInputChange = (e) => {
    checkFileAdmin();
    setInputValue(e.target.value);
    if (!test) {
      toast({
        title: "You input English and gen for generate VPN",
        status: "info",
        isClosable: true,
        duration: 3000,
      });
      setTest(true);
    }
  };

  //filter data
  const handleSelectApprove = (e, iscreated) => {
    const value = e.target.checked;
    if (value === true) {
      setFilteredData((prev) => {
        return prev.filter((item) => {
          return item.status1 === "approve";
        });
      });
    } else {
      fetchData();
    }
  };

  const handleSelectPending = (e) => {
    const value = e.target.checked;
    if (value === true) {
      setFilteredData((prev) =>
        prev.filter((item) => item.status1 === "pending")
      );
    } else {
      fetchData();
    }
  };

  const handleAlertStatus = (state) => {
    try {
      if (state === "pending") {
        toast({
          title: "VPN Access",
          description: `VPN Access approve`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (err) {
      if (err) {
        toast({
          title: "VPN error",
          description: `VPN error`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  //revoke action
  const handleRevoke = async (id, disname, statusdata) => {
    const urlData = `${protocol}://${domain_name}/api/post/${id}`;
    const urlrevoke = `${protocol}://${domain_name}/api/post/${id}?clientName=${disname}`;
    const check = statusdata;
    if (check === "approve") {
      toast({
        title: "VPN success",
        description: `revoke VPN suscessfully`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      try {
        await axios.put(urlData, {
          uid: id,
          status: "pending",
          iscreated: false,
        });
        await fetchData();
        await axios.post(urlrevoke);
        await fetchData();
        await checkFileAdmin();
      } catch (err) {
        toast({
          title: "VPN error revoke",
          description: `revoke VPN error`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "VPN warning",
        description: `You  generated VPN already`,
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await axios.delete(
        `${protocol}://${domain_name}/api/post/${id}`
      );
      toast({
        title: "Delete user success",
        description: `Delete user success`,
        status: "success",
        duration: 2000,

        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Delete user",
        description: `Error delete user`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  //update role
  const handleRole = async (id, role) => {
    const urlData = `${protocol}://${domain_name}/api/post/${id}`;
    if (role === "user") {
      try {
        toast({
          title: "Change role to admin success",
          description: `Change role to admin success`,
          status: "success",
          duration: 2000,

          isClosable: true,
        });
        await axios.put(urlData, {
          uid: id,
          role: "admin",
        });
        await fetchData();
      } catch (err) {
        toast({
          title: "role error",
          description: `Error change role`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } else {
      try {
        toast({
          title: "Change role to user success",
          description: `Change role to user success`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        await axios.put(urlData, {
          uid: id,
          role: "user",
        });
        await fetchData();
      } catch (err) {
        toast({
          title: "role error",
          description: `Error change role`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  if (status === "loading") {
    return (
      <Center my={120}>
        <CircularProgress size="100" isIndeterminate color="orange.300" />

        <Text color="gray.300">Loading...</Text>
      </Center>
    );
  }

  const totalPages = Math.ceil(files.length / rowsPerPage);
  const pageNumbers = [];
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = files.slice(indexOfFirstRow, indexOfLastRow);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      {loading === false ? (
        role === "admin" && session ? (
          <div>
            <Badge
              fontWeight="black"
              fontSize="3xl"
              mx={2}
              px={2}
              colorScheme="blue"
              borderRadius="lg"
              py="2"
              my="4"
            >
              Admin Dashboard
            </Badge>

            <Container maxW="container.lg" overflowX="auto" py={1}>
              <Center my={7}>
                <Card borderWidth="5px" borderRadius="lg" overflow="hidden">
                  <Image src="https://www.navicosoft.com/wp-content/uploads/2018/10/ecommerce-development.gif"></Image>
                </Card>
              </Center>
              <Center>
                <Flex>
                  <Box my={6} py={2} p="2">
                    <InputGroup>
                      <InputLeftAddon size="lg">VPN name</InputLeftAddon>
                      <Input
                        type="text"
                        placeholder="VPN name"
                        borderWidth="3px"
                        borderRadius="lg"
                        overflow="hidden"
                        value={inputValue}
                        onChange={handleInputChange}
                      />
                      <Button
                        ml={4}
                        onClick={handleGenVPN}
                        colorScheme="orange"
                        title="Generate VPN"
                      >
                        Gen
                      </Button>
                    </InputGroup>
                  </Box>
                </Flex>
              </Center>
              <Center my={4}>
                <TableContainer>
                  <Table variant="simple" colorScheme="teal">
                    <TableCaption>VPN Files</TableCaption>
                    <Thead>
                      <Tr>
                        <Th fontSize="lg" fontWeight="bold">
                          File VPN
                        </Th>
                        <Th fontSize="lg" fontWeight="bold">
                          Get
                        </Th>
                        <Th fontSize="lg" fontWeight="bold">
                          Revoke
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {currentRows.map((file, index) => (
                        <Tr key={index}>
                          <Td fontSize="md">{file}</Td>
                          <Td>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                handleDownloadVPN(file);
                              }}
                              colorScheme="green"
                              title="Download VPN"
                            >
                              Get
                            </Button>
                          </Td>
                          <Td>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                handleRevokeVPN(file);
                              }}
                              colorScheme="red"
                              title="revoke VPN"
                            >
                              REV
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Center>
              <Center>
                <div>
                  {pageNumbers.map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      colorScheme={currentPage === pageNumber ? "teal" : "gray"}
                      ml={2}
                    >
                      {pageNumber}
                    </Button>
                  ))}
                </div>
              </Center>
              <Box
                as="button"
                borderRadius="md"
                bg="orange.600"
                color="white"
                px={6}
                h={20}
                my={4}
              >
                <FormControl as="fieldset">
                  <FormLabel as="legend">Group status</FormLabel>
                  <RadioGroup defaultValue="Itachi">
                    <HStack spacing="24px">
                      <Checkbox onChange={handleSelectApprove}>
                        approve
                      </Checkbox>
                      <Checkbox onChange={handleSelectPending}>
                        pending
                      </Checkbox>
                    </HStack>
                  </RadioGroup>
                  <FormHelperText></FormHelperText>
                </FormControl>
              </Box>

              <Box my={6} py={2}>
                <InputGroup>
                  <InputLeftAddon>e-mail</InputLeftAddon>
                  <Input
                    type="text"
                    placeholder="Search email"
                    onChange={handleSearch}
                    borderWidth="3px"
                    borderRadius="lg"
                    overflow="hidden"
                  />
                </InputGroup>
              </Box>
              <chakra.pre p={1} my={12}>
                <TableContainer>
                  <Table size="sm" variant="simple" colorScheme="teal">
                    <Thead>
                      <Tr>
                        <Th>Email</Th>
                        <Th>Uid</Th>
                        <Th>Time in</Th>
                        <Th>status</Th>
                        <Th>Accept</Th>
                        <Th isNumeric>Revoke Vpn</Th>
                        <Th>Role</Th>
                        <Th>del</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredData.map(
                        ({
                          email1,
                          uid1,
                          status1,
                          date1,
                          name1,
                          state,
                          checked,
                        }) => (
                          <Tr key={uid1}>
                            <Td>{email1}</Td>
                            <Td>{uid1}</Td>
                            <Td>{date1}</Td>
                            <Td>
                              <Tag
                                style={
                                  { color: "black" } && {
                                    backgroundColor:
                                      status1 === "pending"
                                        ? "gray"
                                        : status1 === "approve"
                                        ? "Chocolate"
                                        : "black",
                                  }
                                }
                              >
                                {status1}
                              </Tag>
                            </Td>

                            <Td isNumeric>
                              <Button
                                onClick={() => {
                                  handleAccessVpn(
                                    uid1,
                                    status1,
                                    name1,
                                    state
                                  ) && handleAlertStatus(status1);
                                }}
                                size="sm"
                                type="submit"
                                colorScheme="green"
                              >
                                Gen
                              </Button>
                            </Td>
                            <Td isNumeric>
                              <Button
                                onClick={() => {
                                  handleRevoke(uid1, name1, status1);
                                }}
                                size="sm"
                                type="submit"
                                colorScheme="red"
                              >
                                {" "}
                                Revoke
                              </Button>
                            </Td>

                            <Td isNumeric>
                              <Button
                                onClick={() => {
                                  handleRole(uid1, checked);
                                }}
                                size="sm"
                                type="submit"
                                colorScheme="blue"
                              >
                                {" "}
                                {checked}
                              </Button>
                            </Td>
                            <Td isNumeric>
                              <Button
                                onClick={async () => {
                                  await handleDeleteUser(uid1);
                                  await fetchData();
                                }}
                                size="sm"
                                type="submit"
                                colorScheme="orange"
                              >
                                {" "}
                                del
                              </Button>
                            </Td>
                          </Tr>
                        )
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </chakra.pre>
            </Container>
            <br />
          </div>
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
