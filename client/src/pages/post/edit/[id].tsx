import React, { useMemo, useState } from 'react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useIsAuth } from '../../../utils/useIsAuth';
import { Layout } from '../../../components/Layout';
import { FormCreateEditPost } from '../../../components/FormCreateEditPost';
import { PostInput, usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { useRouter } from 'next/router';
import { Text } from '@chakra-ui/react';

interface EditPostProps {}

const EditPost: React.FC<EditPostProps> = ({}) => {
    useIsAuth();
    const [showError, setShowError] = useState('');
    const router = useRouter();
    const id = router.query.id;
    const intId = typeof id === 'string' ? parseInt(id) : -1;
    const [{ data, error, fetching }] = usePostQuery({
        pause: intId === -1,
        variables: {
            id: intId,
        },
    });
    const [, updatePost] = useUpdatePostMutation();

    const formValues = useMemo(() => {
        let values: PostInput | null;

        if (data) {
            values = {
                title: data?.post?.title || '',
                text: data?.post?.text || '',
            };
        } else {
            values = null;
        }

        return values;
    }, [data]);

    const onSubmit = async (values: PostInput) => {
        const { error } = await updatePost({ id: intId, ...values });
        if (!error) {
            await router.back();
        } else {
            setShowError(error.message);
        }
    };

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
    return (
        <Layout variant="small">
            {showError && <Text color="red.500">{showError}</Text>}
            <FormCreateEditPost onSubmit={onSubmit} values={formValues} />
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient)(EditPost);
