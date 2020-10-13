import { Button, Flex, Link, Text } from "@chakra-ui/core";
import { Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
import NextLink from "next/link";

export const Login: React.FC<{}> = ({}) => {
  const [, login] = useLoginMutation();
  const router = useRouter();

  function validateName(value: any) {
    let error;
    if (!value) {
      error = "Username is required";
    }
    return error;
  }
  function validatePassword(value: any) {
    let error;
    if (!value) {
      error = "Password is required";
    }
    return error;
  }

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, actions) => {
          const response = await login({ options: values });
          if (response.data?.login.errors) {
            actions.setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            console.log("Login success!!! 👻 ");
            router.push("/");
          }
        }}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <InputField
              name="usernameOrEmail"
              label="Username"
              placeholder="Enter your username"
              validate={validateName}
            />
            <InputField
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              validate={validatePassword}
            />
            <Flex mt="2">
              <NextLink href="/forget-password">
                <Link ml="auto">forget the password?</Link>
              </NextLink>
            </Flex>
            <Button
              mt={4}
              variantColor="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Login
            </Button>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
