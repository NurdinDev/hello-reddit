import { Button } from "@chakra-ui/core";
import { Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, createPost] = useCreatePostMutation();
  useIsAuth();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          title: "",
          text: "",
        }}
        onSubmit={async (values, actions) => {
          const { error } = await createPost({ input: values });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <InputField name="title" label="Title" placeholder="title" />
            <InputField
              name="text"
              label="Body"
              isTextArea={true}
              placeholder="text..."
            />
            <Button
              mt={4}
              variantColor="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Create Post
            </Button>
          </form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
