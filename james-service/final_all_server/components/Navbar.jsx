import {
  Box,
  HStack,
  IconButton,
  Spacer,
  useColorMode,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Tooltip,
  Flex,
  Badge,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import Navlink from "./Navlink";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
export function Navbar() {
  const { toggleColorMode } = useColorMode();
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
  };
  useEffect(() => {}, [session]);

  return (
    <Box
      borderBottom="2px"
      borderBottomColor={useColorModeValue("gray.100", "gray.700")}
      mb={4}
      py={4}
    >
      <HStack
        justifyContent="flex-end"
        maxW="container.lg"
        mx="auto"
        spacing={4}
      >
        <Navlink
          to="/Homepage"
          name="What's J.A.M.E.S ? "
          size="lg"
          title="How to use VPN"
        />
        <Spacer />
        <IconButton
          variant="ghost"
          icon={useColorModeValue(<FaSun />, <FaMoon />)}
          onClick={toggleColorMode}
          aria-label="toggle-dark-mode"
        />
        {!session && (
          <Navlink to="/" name="Login" title="Sign in for use VPN" />
        )}
        {!session && (
          <Navlink
            to="/Registerpage"
            name="Register"
            title="Register for use VPN"
          />
        )}
        {session && (
          <Navlink to="/Profilepage" name="VPN" title="Download VPN file" />
        )}
        {!session && (
          <Navlink
            to="/emailApp"
            name="What E-Mail's real ?"
            title="Check email for real email"
          />
        )}
        {session && session?.role === "admin" && (
          <Navlink to="/AdminPage" name="Admin" title="action for Admin" />
        )}
        {session && (
          <Menu>
            <Flex>
              <MenuButton
                as={Avatar}
                name={session?.user?.name || ""}
                src={session?.user.image || "god dragon"}
                title="Sign out or waiting"
                cursor="pointer"
              />
              <Box ml="3">
                <Badge ml="1" colorScheme="green">
                  online
                </Badge>
              </Box>
            </Flex>

            <MenuList>
              <MenuItem>{session?.user?.email}</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>
    </Box>
  );
}
