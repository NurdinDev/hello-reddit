import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../components/Layout';
import { PostInput, useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';
import { FormCreateEditPost } from '../components/FormCreateEditPost';

const CreatePost: React.FC<{}> = ({}) => {
    useIsAuth();
    const router = useRouter();
    const [, createPost] = useCreatePostMutation();

    const onSubmit = async (values: PostInput) => {
        const { error } = await createPost({ input: values });
        if (!error) {
            router.push('/');
        }
    };
    return (
        <Layout variant="small">
            <FormCreateEditPost onSubmit={onSubmit} />
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
