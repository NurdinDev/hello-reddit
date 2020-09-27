import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/core";
import { Field, Formik } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";

interface RegisterProps {}

export const Register: React.FC<RegisterProps> = ({}) => {
  function validateName(value) {
    let error;
    if (!value) {
      error = "Username is required";
    }
    return error;
  }
  function validatePassword(value) {
    let error;
    if (!value) {
      error = "Password is required";
    }
    return error;
  }

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            console.log(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
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
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              validate={validatePassword}
            />
            <Button
              mt={4}
              variantColor="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Register
            </Button>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
