import { Box, Button, Flex, Link } from "@chakra-ui/core";
import { Formik } from "formik";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import NextLink from "next/link";

const ForgetPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);

  const [, forgotPassword] = useForgotPasswordMutation();

  function validateEmail(value: any) {
    let error;
    if (!value) {
      error = "Username is required";
    }
    return error;
  }

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async ({ email }, actions) => {
          await forgotPassword({ email });
          setComplete(true);
        }}
      >
        {(props) =>
          complete ? (
            <Flex flexDirection="column" textAlign="center">
              <Box boxShadow="md" py="4">
                if an account with that email exits, we sent you an email, check
                your inbox 👋{" "}
              </Box>
              <NextLink href="/">
                <Link color="teal.500" mt="3">
                  Back to home 🏡
                </Link>
              </NextLink>
            </Flex>
          ) : (
            <form onSubmit={props.handleSubmit}>
              <InputField
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                validate={validateEmail}
              />

              <Button
                mt={4}
                variantColor="teal"
                isLoading={props.isSubmitting}
                type="submit"
              >
                forget password
              </Button>
            </form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default ForgetPassword;
