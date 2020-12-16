import React, { useMemo } from 'react';
import { PostInput } from '../generated/graphql';
import { InputField } from './InputField';
import { Button } from '@chakra-ui/react';
import { Formik } from 'formik';

interface FormCreateEditPostProps {
    values?: PostInput | null;
    onSubmit: (values: PostInput) => Promise<any> | void;
}

export const FormCreateEditPost: React.FC<FormCreateEditPostProps> = ({ onSubmit, values }) => {
    const initialValues = useMemo(() => {
        if (values) {
            return values;
        }
        return {
            title: '',
            text: '',
        };
    }, [values]);

    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {(props) => (
                <form onSubmit={props.handleSubmit}>
                    <InputField name="title" label="Title" placeholder="title" />
                    <InputField name="text" label="Body" isTextArea={true} placeholder="text..." />
                    <Button mt={4} colorScheme="teal" isLoading={props.isSubmitting} type="submit">
                        {values ? 'Update Post' : 'Create Post'}
                    </Button>
                </form>
            )}
        </Formik>
    );
};
