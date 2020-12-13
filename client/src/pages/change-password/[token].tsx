import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';
import { Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from 'next/link';

const ChangePassword = () => {
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState('');
    const router = useRouter();
    const token = typeof router.query.token === 'string' ? router.query.token : '';

    function validatePassword(value: any) {
        let error;
        if (!value) {
            error = 'New password is required';
        }
        return error;
    }

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ newPassword: '' }}
                onSubmit={async ({ newPassword }, actions) => {
                    const response = await changePassword({ token, newPassword });
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(response.data.changePassword.errors);
                        if ('token' in errorMap) {
                            setTokenError(errorMap.token);
                        }
                        actions.setErrors(errorMap);
                    } else if (response.data?.changePassword.user) {
                        router.push('/');
                    }
                }}
            >
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                        <InputField
                            name="newPassword"
                            label="new password"
                            type="password"
                            placeholder="Enter your new password"
                            validate={validatePassword}
                        />

                        {tokenError && (
                            <Box>
                                <Text mt="2" color="red.500">
                                    {tokenError}
                                </Text>

                                <Flex mt="2" justifyContent="space-between">
                                    <NextLink href="/forget-password">
                                        <Link>Go forget it again</Link>
                                    </NextLink>
                                    <Text color="teal.500"> OR </Text>
                                    <NextLink href="/">
                                        <Link>Back to home</Link>
                                    </NextLink>
                                </Flex>
                            </Box>
                        )}

                        <Button mt={4} variantColor="teal" isLoading={props.isSubmitting} type="submit">
                            Submit
                        </Button>
                    </form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
