import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { Layout } from '../../components/Layout';
import { Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { useRouter } from 'next/router';
import { usePostQuery } from '../../generated/graphql';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';

export const SinglePost = () => {
    const router = useRouter();
    const id = router.query.id;
    const intId = typeof id === 'string' ? parseInt(id) : -1;
    const [{ data, error, fetching }] = usePostQuery({
        pause: intId === -1,
        variables: {
            id: intId,
        },
    });

    if (error) {
        return (
            <Layout>
                <div>{error.message}</div>
            </Layout>
        );
    }
    if (fetching) {
        return (
            <Layout>
                <div>loading...</div>
            </Layout>
        );
    }
    if (!data?.post) {
        return (
            <Layout>
                <div>could not find post.</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <EditDeletePostButtons id={intId} creatorId={data?.post?.creator.id} />
            <Heading mb={4}>{data?.post?.title}</Heading>
            <Text fontSize={'sm'}>Posted by: {data?.post.creator.username}</Text>
            <Box mt={6}>
                <Text>{data?.post?.text}</Text>
            </Box>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(SinglePost);
