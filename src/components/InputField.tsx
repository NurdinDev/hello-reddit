import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/core";
import { FieldValidator, useField } from "formik";
import React, { HTMLAttributes } from "react";

type InputFieldProps = HTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  validate: FieldValidator
};

export const InputField: React.FC<InputFieldProps> = (props) => {
  const [field, { error , touched}] = useField(props);
  return (
    <FormControl isInvalid={!!error && touched}>
      <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
      <Input {...field} id={props.name} placeholder={props.placeholder} type={props.type || 'text'}/>
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
