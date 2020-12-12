import React from 'react';
import { usePostsQuery } from '../generated/graphql';
import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/core';

interface PostPageProps {
    variables: {
        limit: number;
        cursor: null | string;
    };
    isLastPage: boolean;
    loadMore: (cursor: null | string) => void;
}

const PostPage: React.FC<PostPageProps> = ({ variables, isLastPage, loadMore }) => {
    const [{ data, fetching }] = usePostsQuery({
        variables,
    });

    console.log({ data }, { fetching });

    if (!fetching && !data) {
        return <div>Something wrong! 🙁 check the console log 🐛.</div>;
    }
    return (
        <>
            {!data && fetching ? (
                <Text>Loading...</Text>
            ) : (
                <Stack spacing={8}>
                    {' '}
                    {data!.posts.posts.map((p) => (
                        <Box key={p.id} p="5" shadow="md" borderWidth="1px">
                            <Heading fontSize="xl">{p.title} </Heading>
                            <Text mt="4">{p.textSnippet}</Text>
                        </Box>
                    ))}
                </Stack>
            )}
            {data && isLastPage && data.posts.hasMore ? (
                <Flex>
                    <Button
                        isLoading={fetching}
                        mx={'auto'}
                        my="6"
                        variant="outline"
                        onClick={() => {
                            loadMore(data.posts.posts[data.posts.posts.length - 1].createdAt as string);
                        }}
                    >
                        {' '}
                        Load More 👻{' '}
                    </Button>
                </Flex>
            ) : null}
        </>
    );
};

export default PostPage;
