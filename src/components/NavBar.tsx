import { Box, Button, Flex, Link, useColorMode } from "@chakra-ui/core";
import React from "react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";
import { DarkModeSwitch } from "./DarkModeSwitch";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const { colorMode } = useColorMode()
  let body = null;


  const bgColor = { light: 'white', dark: 'gray.800' }

  const color = { light: 'black', dark: 'white' }

  // data loading
  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
    // user logged in
  } else {
    body = (
      <>
        <Box>{data.me.username}</Box>
        <Button ml="2" as="a" variant="outline" size="sm">
          Logout
        </Button>
      </>
    );
  }
  return (
    <Box display="flex" bg={bgColor[colorMode]} color={color[colorMode]} p={4}>
      <Box>
        <DarkModeSwitch />
      </Box>
      <Box display="flex" mr="auto">
        {body}
      </Box>
    </Box>
  );
};
