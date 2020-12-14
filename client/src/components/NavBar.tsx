import { Box, Button, Link, useColorMode, Flex, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { DarkModeSwitch } from './DarkModeSwitch';
import { NextChakraLink } from './NextChakraLink';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{ data, fetching }] = useMeQuery({
        pause: isServer(),
    });
    const [{ fetching: logoutFetchign }, logout] = useLogoutMutation();
    const { colorMode } = useColorMode();
    let body = null;

    const bgColor = { light: 'teal.500', dark: 'gray.800' };

    const color = { light: 'white', dark: 'white' };

    // data loading
    if (fetching) {
        // user not logged in
    } else if (!data?.me) {
        body = (
            <>
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
            <Flex alignItems={'center'}>
                <Text>{data.me.username}</Text>
                <Button ml="2" as="a" variant="outline" size="sm" onClick={() => logout()} isLoading={logoutFetchign}>
                    Logout
                </Button>
            </Flex>
        );
    }
    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            w="100%"
            mb={8}
            bg={bgColor[colorMode]}
            color={color[colorMode]}
            p={4}
        >
            <Box>
                <DarkModeSwitch />
            </Box>
            <NextChakraLink href="/" mr={2}>
                Home
            </NextChakraLink>
            <Box display="flex" mr="auto">
                {body}
            </Box>
        </Flex>
    );
};
