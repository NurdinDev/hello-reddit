import React from 'react';
import { usePostsQuery } from '../generated/graphql';
import { Button, Flex, Stack, Text } from '@chakra-ui/react';
import PostCard from './PostCard';

interface PostPageProps {
    variables: {
        limit: number;
        cursor: null | string;
    };
    isLastPage: boolean;
    loadMore: (cursor: null | string) => void;
}

const PostPage: React.FC<PostPageProps> = ({ variables, isLastPage, loadMore }) => {
    const [{ data, error, fetching }] = usePostsQuery({
        variables,
    });

    if (!fetching && !data) {
        return (
            <>
                <div>Something wrong! 🙁 check the console log 🐛.</div>
                <Text>{error?.message}</Text>
            </>
        );
    }
    return (
        <>
            {!data && fetching ? (
                <Text>Loading...</Text>
            ) : (
                <Stack spacing={8}>
                    {data!.posts.posts.map((p) => (
                        <PostCard key={p.id} post={p} />
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
