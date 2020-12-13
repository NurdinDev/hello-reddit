import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/react';
import { FieldValidator, useField } from 'formik';
import React, { HTMLAttributes } from 'react';

type InputFieldProps = HTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
    placeholder?: string;
    type?: string;
    validate?: FieldValidator;
    isTextArea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = (props) => {
    const [field, { error, touched }] = useField(props);
    let InputOrTextArea: any = Input;
    if (props.isTextArea) {
        InputOrTextArea = Textarea;
    }
    return (
        <FormControl isInvalid={!!error && touched}>
            <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
            <InputOrTextArea {...field} id={props.name} placeholder={props.placeholder} type={props.type || 'text'} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
};
