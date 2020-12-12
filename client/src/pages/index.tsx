import React from 'react';
import {Box, Button, Flex, Heading, Stack, Text} from "@chakra-ui/core";
import {withUrqlClient} from "next-urql";
import {Layout} from "../components/Layout";
import {createUrqlClient} from "../utils/createUrqlClient";
import NextLink from "next/link";
import {usePostsQuery} from "../generated/graphql";

const Index = () => {
        const [{data, fetching}] = usePostsQuery({
            variables: {
                limit: 10,
            },
        });

        if(!fetching && !data) {
            return (<div>Something wrong! 🙁 check the console log 🐛.</div>)
        }

        return (
            <Layout>
                <Flex justifyContent="space-between" alignItems="center">
                    <Heading>Hello Reddit 👋</Heading>
                    <NextLink href="/create-post">
                        <Button>Create Post</Button>
                    </NextLink>
                </Flex>
                <br/>
                {!data && fetching ? <Text>Loading...</Text> : (
                    <Stack spacing={8}> {
                        data!.posts.map((p) =>
                            (
                                <Box key={p.id} p="5" shadow="md" borderWidth="1px">
                                    <Heading fontSize="xl">{p.title} </Heading>
                                    <Text mt="4">{p.textSnippet}</Text>
                                </Box>
                            )
                        )
                    }
                    </Stack>
                )}
                {data && <Flex>
                    <Button isLoading={fetching} mx={"auto"} my="6" variant="outline"> Load More 👻 </Button>
                </Flex>}
            </Layout>
        );
    }
;

export default withUrqlClient(createUrqlClient,
    {
        ssr: true
    }
)(Index);
