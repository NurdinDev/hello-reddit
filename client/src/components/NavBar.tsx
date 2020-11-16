import { Box, Button, Link, useColorMode } from "@chakra-ui/core";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { DarkModeSwitch } from "./DarkModeSwitch";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ fetching: logoutFetchign }, logout] = useLogoutMutation();
  const { colorMode } = useColorMode();
  let body = null;

  const bgColor = { light: "white", dark: "gray.800" };

  const color = { light: "black", dark: "white" };

  // data loading
  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/">
          <Link mr="2">Home</Link>
        </NextLink>
        <NextLink href="/login">
          <Link mr="2">login</Link>
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
        <Button
          ml="2"
          as="a"
          variant="outline"
          size="sm"
          onClick={() => logout()}
          isLoading={logoutFetchign}
        >
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
