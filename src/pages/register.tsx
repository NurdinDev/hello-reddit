import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/core";
import { Field, Formik } from "formik";
import React from "react";
import { useMutation } from "urql";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";

interface RegisterProps {}

const REGISTER_MUT = `
 mutation Register($username: String!, $password: String!){
   register(options: {username: $username, password: $password}) {
     errors {
       field
       message
     }

     user {
       id
       username
     }
   }
 }
`;
export const Register: React.FC<RegisterProps> = ({}) => {
  const [, register] = useMutation(REGISTER_MUT);

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
        onSubmit={async (values, actions) => {
          await register(values);
          actions.setSubmitting(false);
          actions.resetForm();
          console.log("Register success!!! 👻 ");
          
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
