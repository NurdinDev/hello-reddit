import React from 'react';
import { Button, Flex, Heading } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { Layout } from '../components/Layout';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import Posts from '../components/Posts';

const Index = () => {
    return (
        <Layout>
            <Flex justifyContent="space-between" alignItems="center">
                <Heading>Hello Reddit 👋</Heading>
                <NextLink href="/create-post">
                    <Button>Create Post</Button>
                </NextLink>
            </Flex>
            <br />

            <Posts />
        </Layout>
    );
};
export default withUrqlClient(createUrqlClient, {
    ssr: true,
})(Index);
