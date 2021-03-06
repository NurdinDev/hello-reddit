import { Button } from '@chakra-ui/react';
import { Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { useRegisterMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';

interface RegisterProps {}

export const Register: React.FC<RegisterProps> = ({}) => {
    const [, register] = useRegisterMutation();
    const router = useRouter();

    function validateName(value: any) {
        let error;
        if (!value) {
            error = 'Username is required';
        }
        return error;
    }
    function validatePassword(value: any) {
        let error;
        if (!value) {
            error = 'Password is required';
        }
        return error;
    }

    function validateEmail(value: string) {
        let error;
        if (!value) {
            error = 'Email is required';
        }
        return error;
    }

    return (
        <Layout variant="small">
            <Formik
                initialValues={{ username: '', password: '', email: '' }}
                onSubmit={async (values, actions) => {
                    const response = await register({ options: values });
                    if (response.data?.register.errors) {
                        actions.setErrors(toErrorMap(response.data.register.errors));
                    } else if (response.data?.register.user) {
                        console.log('Register success!!! 👻 ');
                        router.push('/');
                    }
                }}
            >
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                        <InputField
                            name="username"
                            label="Username"
                            placeholder="Enter your username"
                            validate={validateName}
                        />
                        <InputField
                            name="email"
                            label="Email"
                            placeholder="Enter your email"
                            validate={validateEmail}
                        />
                        <InputField
                            name="password"
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            validate={validatePassword}
                        />
                        <Button mt={4} variantColor="teal" isLoading={props.isSubmitting} type="submit">
                            Register
                        </Button>
                    </form>
                )}
            </Formik>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient)(Register);
